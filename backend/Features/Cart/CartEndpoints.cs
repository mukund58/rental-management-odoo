using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Features.Cart;

public static class CartEndpoints
{
    public static RouteGroupBuilder MapCartEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/cart").WithTags("Cart").RequireAuthorization();

        // GET /api/cart — get current user's cart
        group.MapGet("/", async (ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = GetUserId(user);
            if (userId == null) return Results.Unauthorized();

            var cart = await db.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return Results.Ok(Array.Empty<CartItemDto>());

            var items = cart.Items.Select(i => MapToDto(i)).ToList();
            return Results.Ok(items);
        });

        // POST /api/cart/add — add item to cart
        group.MapPost("/add", async (ClaimsPrincipal user, [FromBody] AddCartItemRequest request, AppDbContext db) =>
        {
            var userId = GetUserId(user);
            if (userId == null) return Results.Unauthorized();

            // Get or create cart for this user
            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new backend.Models.Cart { Id = Guid.NewGuid(), UserId = userId.Value };
                db.Carts.Add(cart);
            }

            var item = new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                PickupDate = request.RentalStart,
                ReturnDate = request.RentalEnd,
            };

            db.CartItems.Add(item);
            await db.SaveChangesAsync();

            // Reload with product info
            var saved = await db.CartItems
                .Include(i => i.Product)
                .FirstAsync(i => i.Id == item.Id);

            return Results.Created($"/api/cart/{item.Id}", MapToDto(saved));
        });

        // DELETE /api/cart/{id} — remove item from cart
        group.MapDelete("/{id:guid}", async (Guid id, ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = GetUserId(user);
            if (userId == null) return Results.Unauthorized();

            var item = await db.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == id && i.Cart.UserId == userId);

            if (item is null) return Results.NotFound();

            db.CartItems.Remove(item);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        // DELETE /api/cart — clear entire cart
        group.MapDelete("/", async (ClaimsPrincipal user, AppDbContext db) =>
        {
            var userId = GetUserId(user);
            if (userId == null) return Results.Unauthorized();

            var cart = await db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return Results.NoContent();

            db.CartItems.RemoveRange(cart.Items);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        return group;
    }

    private static Guid? GetUserId(ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(idStr, out var id) ? id : null;
    }

    private static CartItemDto MapToDto(CartItem item) => new(
        item.Id,
        item.ProductId,
        item.Quantity,
        item.PickupDate,
        item.ReturnDate,
        item.Product?.Price ?? 0,
        item.Product?.Name ?? "Unknown",
        item.Product?.ImageUrl,
        (int)(item.ReturnDate - item.PickupDate).TotalDays
    );
}
