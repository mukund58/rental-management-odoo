namespace backend.Features.Products;

public sealed record ProductUpsertRequest(
    string Name,
    string Description,
    decimal Price,
    decimal Deposit,
    string? ImageUrl,
    Guid CategoryId,
    int StockQuantity,
    bool IsActive);

public sealed record ProductResponseDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    decimal Deposit,
    string? ImageUrl,
    Guid CategoryId,
    string CategoryName,
    int StockQuantity,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record ProductFilterRequest(
    string? Search,
    Guid? CategoryId,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? IsActive,
    string? SortBy,
    bool Desc = false,
    int Page = 1,
    int PageSize = 10);

public sealed record ProductPagedResponse(
    IEnumerable<ProductResponseDto> Items,
    int Page,
    int PageSize,
    int TotalRecords,
    int TotalPages);