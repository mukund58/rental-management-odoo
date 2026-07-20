using backend.Models;

namespace backend.Features.Cart;

public static class CartMapper
{
    public static CartDto ToDto(this Models.Cart cart)
    {
        var items = cart.Items.Select(x => new CartItemDto(
            x.Id,
            x.ProductId,
            x.Quantity,
            x.PickupDate,
            x.ReturnDate,
            x.Product?.Price ?? 0,
            x.Product?.Name ?? "Unknown",
            x.Product?.ImageUrl,
            (int)(x.ReturnDate - x.PickupDate).TotalDays
        )).ToList();

        var subtotal = items.Sum(i => i.PricePerUnit * i.Quantity * Math.Max(1, i.RentalDurationDays));

        var deposit = cart.Items.Sum(x =>
            (x.Product?.Deposit ?? 0) * x.Quantity);

        return new CartDto(
            cart.Id,
            items,
            subtotal,
            deposit,
            subtotal + deposit
        );
    }
}