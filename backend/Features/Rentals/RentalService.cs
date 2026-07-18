
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Features.Rentals.Enums;

namespace backend.Features.Rentals;

public class RentalService
{
    private readonly AppDbContext _db;

    public RentalService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IResult> CreateRental(CreateRentalRequestDto request)
    {

        await using var transaction =
            await _db.Database.BeginTransactionAsync();
        /* 
         Product Missing

            ↓

            Stock Empty

            ↓

            Customer Missing

            ↓

            Vendor Missing
        */

        // Customer

        var customer = await _db.Users
            .FirstOrDefaultAsync(x =>
                x.Id == request.CustomerId);

        if (customer == null)
            return Results.BadRequest("Customer not found.");

        // Vendor

        var vendor = await _db.Users
            .FirstOrDefaultAsync(x =>
                x.Id == request.VendorId);

        if (vendor == null)
            return Results.BadRequest("Vendor not found.");

        decimal subtotal = 0;
        decimal deposit = 0;

        var rentalItems = new List<RentalItem>();

        foreach (var item in request.Items)
        {
            var product = await _db.Products
                .FirstOrDefaultAsync(x =>
                    x.Id == item.ProductId);

            if (product == null)
                return Results.BadRequest($"Product {item.ProductId} not found.");

            if (!product.IsActive)
                return Results.BadRequest($"{product.Name} is inactive.");

            if (product.StockQuantity < item.Quantity)
                return Results.BadRequest($"{product.Name} is out of stock.");

            var lineTotal =
                product.Price * item.Quantity;

            subtotal += lineTotal;

            // Example: 20% deposit
            //var lineDeposit =
            //    lineTotal * 0.20m;

            var lineDeposit = product.Deposit * item.Quantity;
            deposit += lineDeposit;

            product.StockQuantity -= item.Quantity;

            rentalItems.Add(new RentalItem
            {
                Id = Guid.NewGuid(),

                ProductId = product.Id,

                Quantity = item.Quantity,

                UnitPrice = product.Price,

                Deposit = lineDeposit,

                TotalPrice = lineTotal
            });
        }

        var rental = new RentalOrder
        {
            Id = Guid.NewGuid(),

            OrderNumber = await GenerateOrderNumber(),

            CustomerId = customer.Id,

            VendorId = vendor.Id,

            PickupDate = request.PickupDate,

            ReturnDate = request.ReturnDate,

            Status = RentalStatus.Reserved,

            Notes = request.Notes,

            CreatedAt = DateTime.UtcNow,

            UpdatedAt = DateTime.UtcNow,

            SubTotal = subtotal,

            Deposit = deposit,

            LateFee = 0,

            TotalAmount = subtotal + deposit,

            Items = rentalItems
        };

        _db.RentalOrders.Add(rental);

        await _db.SaveChangesAsync();

        await transaction.CommitAsync();

        rental = await _db.RentalOrders
            .Include(x => x.Customer)
            .Include(x => x.Vendor)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .FirstAsync(x => x.Id == rental.Id);

        return Results.Created(
            $"/api/rentals/{rental.Id}",
            rental.ToDto());
    }

    // -------------------------------------------------

    private async Task<string> GenerateOrderNumber()
    {
        var count =
            await _db.RentalOrders.CountAsync();

        return $"RNT-{(count + 1):D6}";
    }
    public async Task<IResult> GetAllRentals()
    {
        var rentals = await _db.RentalOrders
            .Include(x => x.Customer)
            .Include(x => x.Vendor)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Results.Ok(rentals.Select(x => x.ToDto()));
    }
    public async Task<IResult> GetRental(Guid id)
    {
        var rental = await _db.RentalOrders
            .Include(x => x.Customer)
            .Include(x => x.Vendor)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (rental == null)
            return Results.NotFound();

        return Results.Ok(rental.ToDto());
    }
    public async Task<IResult> UpdateStatus(
        Guid id,
        UpdateRentalStatusDto request)
    {
        var rental = await _db.RentalOrders
            .FirstOrDefaultAsync(x => x.Id == id);

        if (rental == null)
            return Results.NotFound();

        rental.Status = request.Status;
        rental.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Results.Ok();
    }
    public async Task<IResult> ReturnRental(Guid id)
    {
        var rental = await _db.RentalOrders
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (rental == null)
            return Results.NotFound();

        foreach (var item in rental.Items)
        {
            var product = await _db.Products
                .FirstAsync(x => x.Id == item.ProductId);

            product.StockQuantity += item.Quantity;
        }

        rental.ActualReturnDate = DateTime.UtcNow;

        if (DateTime.UtcNow > rental.ReturnDate)
        {
            var hoursLate =
                Math.Ceiling(
                    (DateTime.UtcNow - rental.ReturnDate)
                    .TotalHours);

            rental.LateFee = (decimal)hoursLate * 10;

            rental.Status = RentalStatus.Late;
        }
        else
        {
            rental.Status = RentalStatus.Returned;
        }

        rental.TotalAmount =
            rental.SubTotal +
            rental.Deposit +
            rental.LateFee;

        rental.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Results.Ok();
    }
    public async Task<IResult> DeleteRental(Guid id)
    {
        var rental = await _db.RentalOrders
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (rental == null)
            return Results.NotFound();

        foreach (var item in rental.Items)
        {
            var product = await _db.Products
                .FirstAsync(x => x.Id == item.ProductId);

            product.StockQuantity += item.Quantity;
        }

        _db.RentalOrders.Remove(rental);

        await _db.SaveChangesAsync();

        return Results.NoContent();
    }

}
/* 
 Client

↓

Validate DTO

↓

Customer Exists?

↓

Vendor Exists?

↓

Product Exists?

↓

Enough Stock?

↓

Calculate Totals

↓

Reduce Stock

↓

Create Rental

↓

Save

↓

Return DTO
 */