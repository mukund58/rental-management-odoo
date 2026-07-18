using backend.Models;

namespace backend.Features.Products;

public static class ProductMapper
{
    public static ProductResponseDto ToDto(this Product product)
    {
        return new ProductResponseDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Deposit,
            product.ImageUrl,
            product.CategoryId,
            product.Category?.Name ?? "",
            product.StockQuantity,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt);
    }

    public static void UpdateFromRequest(
        this Product product,
        ProductUpsertRequest request)
    {
        product.Name = request.Name.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.Deposit = request.Deposit;
        product.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
            ? null
            : request.ImageUrl.Trim();
        product.CategoryId = request.CategoryId;
        product.StockQuantity = request.StockQuantity;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;
    }

    public static Product ToEntity(
        this ProductUpsertRequest request)
    {
        return new Product
        {
            Id = Guid.NewGuid(),

            Name = request.Name.Trim(),

            Description = request.Description.Trim(),

            Price = request.Price,

            Deposit = request.Deposit,

            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim(),

            CategoryId = request.CategoryId,

            StockQuantity = request.StockQuantity,

            IsActive = request.IsActive,

            CreatedAt = DateTime.UtcNow,

            UpdatedAt = DateTime.UtcNow
        };
    }
}