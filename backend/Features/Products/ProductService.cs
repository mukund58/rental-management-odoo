using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Products;

public class ProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db)
    {
        _db = db;
    }

    // ============================
    // GET ALL PRODUCTS
    // ============================
    public async Task<IResult> GetAll(ProductFilterRequest filter)
    {
        IQueryable<Product> query = _db.Products
            .AsNoTracking()
            .Include(x => x.Category);

        // Search
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();

            query = query.Where(x =>
                x.Name.ToLower().Contains(search) ||
                x.Description.ToLower().Contains(search));
        }

        // Category
        if (filter.CategoryId.HasValue)
        {
            query = query.Where(x =>
                x.CategoryId == filter.CategoryId.Value);
        }

        // Price
        if (filter.MinPrice.HasValue)
        {
            query = query.Where(x =>
                x.Price >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(x =>
                x.Price <= filter.MaxPrice.Value);
        }

        // Active
        if (filter.IsActive.HasValue)
        {
            query = query.Where(x =>
                x.IsActive == filter.IsActive.Value);
        }

        // Sorting
        query = filter.SortBy?.ToLower() switch
        {
            "name" => filter.Desc
                ? query.OrderByDescending(x => x.Name)
                : query.OrderBy(x => x.Name),

            "price" => filter.Desc
                ? query.OrderByDescending(x => x.Price)
                : query.OrderBy(x => x.Price),

            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        var totalRecords = await query.CountAsync();

        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return Results.Ok(
            new ProductPagedResponse(
                items.Select(x => x.ToDto()),
                filter.Page,
                filter.PageSize,
                totalRecords,
                (int)Math.Ceiling(totalRecords / (double)filter.PageSize)
            ));
    }

    // ============================
    // GET BY ID
    // ============================
    public async Task<IResult> Get(Guid id)
    {
        var product = await _db.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (product == null)
            return Results.NotFound();

        return Results.Ok(product.ToDto());
    }

    // ============================
    // CREATE
    // ============================
    public async Task<IResult> Create(ProductUpsertRequest request)
    {
        var categoryExists = await _db.Categories
            .AnyAsync(x => x.Id == request.CategoryId);

        if (!categoryExists)
            return Results.BadRequest("Category not found.");

        var product = request.ToEntity();

        _db.Products.Add(product);

        await _db.SaveChangesAsync();

        product = await _db.Products
            .Include(x => x.Category)
            .FirstAsync(x => x.Id == product.Id);

        return Results.Created(
            $"/api/products/{product.Id}",
            product.ToDto());
    }

    // ============================
    // UPDATE
    // ============================
    public async Task<IResult> Update(
        Guid id,
        ProductUpsertRequest request)
    {
        var product = await _db.Products
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (product == null)
            return Results.NotFound();

        var categoryExists = await _db.Categories
            .AnyAsync(x => x.Id == request.CategoryId);

        if (!categoryExists)
            return Results.BadRequest("Category not found.");

        product.UpdateFromRequest(request);

        await _db.SaveChangesAsync();

        return Results.Ok(product.ToDto());
    }

    // ============================
    // DELETE
    // ============================
    public async Task<IResult> Delete(Guid id)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(x => x.Id == id);

        if (product == null)
            return Results.NotFound();

        _db.Products.Remove(product);

        await _db.SaveChangesAsync();

        return Results.NoContent();
    }

    // ============================
    // STOCK CHECK
    // ============================
    public async Task<bool> HasEnoughStock(
        Guid productId,
        int quantity)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(x => x.Id == productId);

        if (product == null)
            return false;

        return product.StockQuantity >= quantity;
    }

    // ============================
    // UPDATE STOCK
    // ============================
    public async Task ReduceStock(
        Guid productId,
        int quantity)
    {
        var product = await _db.Products
            .FirstAsync(x => x.Id == productId);

        product.StockQuantity -= quantity;

        await _db.SaveChangesAsync();
    }

    public async Task IncreaseStock(
        Guid productId,
        int quantity)
    {
        var product = await _db.Products
            .FirstAsync(x => x.Id == productId);

        product.StockQuantity += quantity;

        await _db.SaveChangesAsync();
    }
}