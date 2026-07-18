using backend.Models;

namespace backend.Features.Cart;

public static class CartMapper
{
    public static CartDto ToDto(this Models.Cart cart)
    {
        var items = cart.Items.Select(x => new CartItemDto(
            x.Id,
            x.ProductId,
            x.Product.Name,
            x.Product.ImageUrl,
            x.Product.Price,
            x.Product.Deposit,
            x.Quantity,
            x.Product.Price * x.Quantity
        )).ToList();

        var subtotal = items.Sum(x => x.LineTotal);

        var deposit = cart.Items.Sum(x =>
            x.Product.Deposit * x.Quantity);

        return new CartDto(
            cart.Id,
            items,
            subtotal,
            deposit,
            subtotal + deposit
        );
    }
}