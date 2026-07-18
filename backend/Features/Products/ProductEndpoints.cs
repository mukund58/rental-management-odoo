using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Products;

public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products").WithTags("Products");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var products = await db.Products
                .AsNoTracking()
                .Include(product => product.Category)
                .OrderByDescending(product => product.CreatedAt)
                .Select(product => ToDto(product))
                .ToListAsync();

            return Results.Ok(products);
        });

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var product = await db.Products
                .AsNoTracking()
                .Include(item => item.Category)
                .Where(item => item.Id == id)
                .Select(item => ToDto(item))
                .FirstOrDefaultAsync();

            return product is null ? Results.NotFound() : Results.Ok(product);
        });

        group.MapPost("/", async (ProductUpsertRequest request, AppDbContext db) =>
        {
            var categoryExists = await db.Categories.AnyAsync(category => category.Id == request.CategoryId);
            if (!categoryExists)
                return Results.BadRequest("Category not found");

            var product = new Product
            {
                Name = request.Name.Trim(),
                Description = request.Description.Trim(),
                Price = request.Price,
                ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim(),
                CategoryId = request.CategoryId,
                StockQuantity = request.StockQuantity,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Products.Add(product);
            await db.SaveChangesAsync();

            var createdProduct = await db.Products
                .AsNoTracking()
                .Include(item => item.Category)
                .Where(item => item.Id == product.Id)
                .Select(item => ToDto(item))
                .FirstAsync();

            return Results.Created($"/api/products/{product.Id}", createdProduct);
        });

        group.MapPut("/{id:guid}", async (Guid id, ProductUpsertRequest request, AppDbContext db) =>
        {
            var product = await db.Products.FirstOrDefaultAsync(item => item.Id == id);
            if (product is null)
                return Results.NotFound();

            var categoryExists = await db.Categories.AnyAsync(category => category.Id == request.CategoryId);
            if (!categoryExists)
                return Results.BadRequest("Category not found");

            product.Name = request.Name.Trim();
            product.Description = request.Description.Trim();
            product.Price = request.Price;
            product.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim();
            product.CategoryId = request.CategoryId;
            product.StockQuantity = request.StockQuantity;
            product.IsActive = request.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            var updatedProduct = await db.Products
                .AsNoTracking()
                .Include(item => item.Category)
                .Where(item => item.Id == product.Id)
                .Select(item => ToDto(item))
                .FirstAsync();

            return Results.Ok(updatedProduct);
        });

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var product = await db.Products.FirstOrDefaultAsync(item => item.Id == id);
            if (product is null)
                return Results.NotFound();

            db.Products.Remove(product);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        return group;
    }

    private static ProductResponseDto ToDto(Product product)
    {
        return new ProductResponseDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.ImageUrl,
            product.CategoryId,
            product.Category.Name,
            product.StockQuantity,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt);
    }
}

public sealed record ProductUpsertRequest(
    string Name,
    string Description,
    decimal Price,
    string? ImageUrl,
    Guid CategoryId,
    int StockQuantity,
    bool IsActive);

public sealed record ProductResponseDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    string? ImageUrl,
    Guid CategoryId,
    string CategoryName,
    int StockQuantity,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);