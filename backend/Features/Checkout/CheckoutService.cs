using backend.Data;
using backend.Models;
using backend.Features.Rentals.Enums;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Features.Checkout;

public class CheckoutService
{
    private readonly AppDbContext _db;

    public CheckoutService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IResult> Checkout(CheckoutRequestDto request, ClaimsPrincipal user)
    {
        await using var transaction =
            await _db.Database.BeginTransactionAsync();

        // -----------------------------
        // Customer
        // -----------------------------

        //var customer = await _db.Users
        //    .FirstOrDefaultAsync(x =>
        //        x.Id == request.CustomerId);

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var customer = await _db.Users
            .FirstOrDefaultAsync(x => x.Id == Guid.Parse(userId));

        if (customer == null)
            return Results.Unauthorized();
        if (customer == null)
            return Results.BadRequest("Customer not found.");

        // -----------------------------
        // Vendor
        // -----------------------------
        
        // If VendorId is not passed or doesn't exist, we fallback to an admin or the customer themselves
        var vendor = await _db.Users.FirstOrDefaultAsync(x => x.Id == request.VendorId) 
                     ?? customer; // Fallback to customer as vendor if not provided

        if (vendor == null)
            return Results.BadRequest("Vendor not found.");

        // -----------------------------
        // Address Processing
        // -----------------------------
        if (request.DeliveryAddress != null)
        {
            var address = new Address
            {
                Id = Guid.NewGuid(),
                UserId = customer.Id,
                FullName = request.DeliveryAddress.FullName,
                Phone = request.DeliveryAddress.Phone,
                AddressLine1 = request.DeliveryAddress.AddressLine1,
                City = request.DeliveryAddress.City,
                State = request.DeliveryAddress.State,
                PostalCode = request.DeliveryAddress.PostalCode,
                IsDefault = true
            };
            _db.Addresses.Add(address);
        }

        decimal subtotal = 0;
        decimal deposit = 0;

        var rentalItems = new List<RentalItem>();

        foreach (var item in request.Items)
        {
            var product = await _db.Products
                .FirstOrDefaultAsync(x =>
                    x.Id == item.ProductId);

            if (product == null)
                return Results.BadRequest(
                    $"Product {item.ProductId} not found.");

            if (!product.IsActive)
                return Results.BadRequest(
                    $"{product.Name} is inactive.");

            if (product.StockQuantity < item.Quantity)
                return Results.BadRequest(
                    $"{product.Name} has insufficient stock.");

            var lineTotal =
                product.Price * item.Quantity;

            subtotal += lineTotal;

            var lineDeposit =
                product.Deposit * item.Quantity;

            deposit += lineDeposit;

            rentalItems.Add(new RentalItem
            {
                Id = Guid.NewGuid(),

                ProductId = product.Id,

                Quantity = item.Quantity,

                UnitPrice = product.Price,

                Deposit = lineDeposit,

                TotalPrice = lineTotal
            });

            // Reduce Stock
            product.StockQuantity -= item.Quantity;
        }

        // -----------------------------
        // Rental Order
        // -----------------------------

        var order = new RentalOrder
        {
            Id = Guid.NewGuid(),

            OrderNumber = await GenerateOrderNumber(),

            InvoiceNumber = await GenerateInvoiceNumber(),

            CustomerId = customer.Id,

            VendorId = vendor.Id,

            PickupDate = request.PickupDate,

            ReturnDate = request.ReturnDate,

            Status = RentalStatus.Reserved,

            CreatedAt = DateTime.UtcNow,

            UpdatedAt = DateTime.UtcNow,

            SubTotal = subtotal,

            Deposit = deposit,

            LateFee = 0,

            TotalAmount = subtotal + deposit,

            IsPaid = true,

            PaymentMethod = request.PaymentMethod.ToString(),

            DeliveryMethod = "Standard",

            Items = rentalItems
        };
        _db.RentalOrders.Add(order);

        await _db.SaveChangesAsync();

        // -----------------------------
        // Payment
        // -----------------------------

        var payment = new Payment
        {
            Id = Guid.NewGuid(),

            RentalOrderId = order.Id,

            Amount = order.TotalAmount,

            PaymentMethod = request.PaymentMethod,

            Status = PaymentStatus.Paid,

            TransactionId =
                $"TXN-{Guid.NewGuid():N}"[..12],

            PaidAt = DateTime.UtcNow
        };

        _db.Payments.Add(payment);

        await _db.SaveChangesAsync();

        await transaction.CommitAsync();

        return Results.Ok(new CheckoutResponseDto
        {
            OrderId = order.Id,

            OrderNumber = order.OrderNumber,

            InvoiceNumber = order.InvoiceNumber,

            PaymentId = payment.Id,

            TotalAmount = order.TotalAmount,

            PaymentStatus = payment.Status
        });
    }

    // --------------------------------

    private async Task<string> GenerateOrderNumber()
    {
        var count =
            await _db.RentalOrders.CountAsync();

        return $"RNT-{(count + 1):D6}";
    }

    private async Task<string> GenerateInvoiceNumber()
    {
        var count =
            await _db.RentalOrders.CountAsync();

        return $"INV-{(count + 1):D6}";
    }
    public async Task<IResult> GetOrders(ClaimsPrincipal user)
    {
        var userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = user.FindFirstValue(ClaimTypes.Role);

        var query = _db.RentalOrders
            .Include(x => x.Customer)
            .Include(x => x.Vendor)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .AsQueryable();

        if (role == "Vendor" && Guid.TryParse(userIdStr, out var vendorId))
        {
            query = query.Where(x => x.VendorId == vendorId);
        }
        else if (role == "Customer" && Guid.TryParse(userIdStr, out var customerId))
        {
            query = query.Where(x => x.CustomerId == customerId);
        }

        var orders = await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        var result = orders.Select(x => new
        {
            x.Id,
            x.OrderNumber,
            x.InvoiceNumber,
            Customer = $"{x.Customer.FirstName} {x.Customer.LastName}",
            Vendor = $"{x.Vendor.FirstName} {x.Vendor.LastName}",
            x.Status,
            x.PickupDate,
            x.ReturnDate,
            x.SubTotal,
            x.Deposit,
            x.LateFee,
            x.TotalAmount,
            x.CreatedAt,
            Items = x.Items.Select(i => new { i.Product.Name, i.Quantity })
        });

        return Results.Ok(result);
    }
    public async Task<IResult> GetOrder(Guid id, ClaimsPrincipal user)
    {
        var userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = user.FindFirstValue(ClaimTypes.Role);

        var query = _db.RentalOrders
            .Include(x => x.Customer)
            .Include(x => x.Vendor)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .Include(x => x.Payment)
            .AsQueryable();

        if (role == "Vendor" && Guid.TryParse(userIdStr, out var vendorId))
        {
            query = query.Where(x => x.VendorId == vendorId);
        }
        else if (role == "Customer" && Guid.TryParse(userIdStr, out var customerId))
        {
            query = query.Where(x => x.CustomerId == customerId);
        }

        var order = await query.FirstOrDefaultAsync(x => x.Id == id);

        if (order == null)
            return Results.NotFound();

        return Results.Ok(new
        {
            order.Id,

            order.OrderNumber,

            order.InvoiceNumber,

            Customer =
                $"{order.Customer.FirstName} {order.Customer.LastName}",

            Vendor =
                $"{order.Vendor.FirstName} {order.Vendor.LastName}",

            order.Status,

            order.PickupDate,

            order.ReturnDate,

            order.SubTotal,

            order.Deposit,

            order.LateFee,

            order.TotalAmount,

            Payment = order.Payment,

            Items = order.Items.Select(x => new
            {
                x.Product.Name,

                x.Quantity,

                x.UnitPrice,

                x.Deposit,

                x.TotalPrice
            })
        });
    }
    public async Task<IResult> CancelOrder(Guid id)
    {
        var order = await _db.RentalOrders
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (order == null)
            return Results.NotFound();

        if (order.Status == backend.Features.Rentals.Enums.RentalStatus.Returned)
            return Results.BadRequest("Returned orders cannot be cancelled.");

        foreach (var item in order.Items)
        {
            var product = await _db.Products
                .FirstAsync(x => x.Id == item.ProductId);

            product.StockQuantity += item.Quantity;
        }

        order.Status = backend.Features.Rentals.Enums.RentalStatus.Cancelled;

        order.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Results.Ok("Order cancelled.");
    }

    public async Task<IResult> UpdateOrderStatus(Guid id, backend.Features.Rentals.Enums.RentalStatus newStatus)
    {
        var order = await _db.RentalOrders.FirstOrDefaultAsync(x => x.Id == id);
        if (order == null) return Results.NotFound();

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Results.Ok(new { message = "Order status updated successfully." });
    }
}