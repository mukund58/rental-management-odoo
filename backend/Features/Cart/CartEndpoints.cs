using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Cart;

public static class CartEndpoints
{
    private static readonly List<CartItemResponse> _cart = new();

    public static RouteGroupBuilder MapCartEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/cart").WithTags("Cart");

        group.MapGet("/", () => Results.Ok(_cart));

        group.MapPost("/add", async ([FromBody] AddCartItemRequest request) =>
        {
            var item = new CartItemResponse
            (
                Guid.NewGuid(),
                request.ProductId,
                request.Quantity,
                request.RentalStart,
                request.RentalEnd,
                request.PricePerUnit
            );

            _cart.Add(item);

            return Results.Created($"/api/cart/{item.Id}", item);
        });

        group.MapDelete("/{id:guid}", (Guid id) =>
        {
            var item = _cart.FirstOrDefault(x => x.Id == id);
            if (item is null) return Results.NotFound();
            _cart.Remove(item);
            return Results.NoContent();
        });

        return group;
    }
}

public sealed record AddCartItemRequest(
    Guid ProductId,
    int Quantity,
    DateTime RentalStart,
    DateTime RentalEnd,
    decimal PricePerUnit);

public sealed record CartItemResponse(
    Guid Id,
    Guid ProductId,
    int Quantity,
    DateTime RentalStart,
    DateTime RentalEnd,
    decimal PricePerUnit);
