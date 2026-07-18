using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Invoice;

public class InvoiceService
{
    private readonly AppDbContext _db;

    public InvoiceService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IResult> GetInvoice(Guid orderId)
    {
        var order = await _db.RentalOrders
            .Include(x => x.Customer)
            .Include(x => x.Vendor)
            .Include(x => x.Payment)
            .Include(x => x.Items)
                .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.Id == orderId);

        if (order == null)
            return Results.NotFound();

        return Results.Ok(new InvoiceDto
        {
            InvoiceNumber = order.InvoiceNumber,
            OrderNumber = order.OrderNumber,

            Customer =
                $"{order.Customer.FirstName} {order.Customer.LastName}",

            Vendor =
                $"{order.Vendor.FirstName} {order.Vendor.LastName}",

            PickupDate = order.PickupDate,
            ReturnDate = order.ReturnDate,

            SubTotal = order.SubTotal,
            Deposit = order.Deposit,
            LateFee = order.LateFee,
            Total = order.TotalAmount,

            PaymentMethod = order.Payment?.PaymentMethod.ToString() ?? "",
            PaymentStatus = order.Payment?.Status.ToString() ?? "",

            Items = order.Items.Select(x => new InvoiceItemDto
            {
                ProductName = x.Product.Name,
                Quantity = x.Quantity,
                Price = x.UnitPrice,
                Deposit = x.Deposit,
                Total = x.TotalPrice
            }).ToList()
        });
    }
}