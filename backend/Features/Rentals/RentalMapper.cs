using backend.Models;

namespace backend.Features.Rentals;

public static class RentalMapper
{
    public static RentalDto ToDto(this RentalOrder order)
    {
        return new RentalDto
        {
            Id = order.Id,

            OrderNumber = order.OrderNumber,

            CustomerId = order.CustomerId,

            CustomerName =
                $"{order.Customer.FirstName} {order.Customer.LastName}",

            VendorId = order.VendorId,

            VendorName =
                $"{order.Vendor.FirstName} {order.Vendor.LastName}",

            Status = order.Status,

            PickupDate = order.PickupDate,

            ReturnDate = order.ReturnDate,

            SubTotal = order.SubTotal,

            Deposit = order.Deposit,

            LateFee = order.LateFee,

            TotalAmount = order.TotalAmount,

            Items = order.Items
                .Select(item => new RentalItemDto
                {
                    ProductId = item.ProductId,

                    ProductName = item.Product.Name,

                    Quantity = item.Quantity,

                    UnitPrice = item.UnitPrice,

                    Deposit = item.Deposit,

                    TotalPrice = item.TotalPrice
                })
                .ToList()
        };
    }
}