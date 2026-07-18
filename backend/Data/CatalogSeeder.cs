using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace backend.Data;

public static class CatalogSeeder
{
    private static readonly Guid ElectronicsId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid FurnitureId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid AppliancesId = Guid.Parse("33333333-3333-3333-3333-333333333333");
    private static readonly Guid ToolsId = Guid.Parse("44444444-4444-4444-4444-444444444444");
    private static readonly Guid VehiclesId = Guid.Parse("55555555-5555-5555-5555-555555555555");

    
    public static async Task SeedAsync(AppDbContext db)
    {
        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Id = ElectronicsId, Name = "Electronics" },
                new Category { Id = FurnitureId, Name = "Furniture" },
                new Category { Id = AppliancesId, Name = "Appliances" },
                new Category { Id = ToolsId, Name = "Tools" },
                new Category { Id = VehiclesId, Name = "Vehicles" }
            );
        }

        if (!await db.Products.AnyAsync())
        {
            db.Products.AddRange(
                new Product
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Name = "SoundMax Bluetooth Speaker",
                    Description = "Portable wireless speaker with rich bass, 12-hour battery life, and splash resistance.",
                    Price = 79.99m,
                    ImageUrl = "https://images.unsplash.com/photo-1518441312507-8d0ec0b7c5f3?auto=format&fit=crop&w=900&q=80",
                    CategoryId = ElectronicsId,
                    StockQuantity = 24,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 0, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Name = "Minimalist Office Desk",
                    Description = "Compact wooden workstation with a cable-friendly design and matte finish.",
                    Price = 199.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
                    CategoryId = FurnitureId,
                    StockQuantity = 12,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 5, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 5, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Name = "Family Size Air Fryer",
                    Description = "Large capacity air fryer with presets for fries, chicken, vegetables, and desserts.",
                    Price = 129.50m,
                    ImageUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
                    CategoryId = AppliancesId,
                    StockQuantity = 18,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 10, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 10, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Name = "Cordless Drill Kit",
                    Description = "Reliable drill kit with multiple bits, LED light, and two rechargeable batteries.",
                    Price = 89.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
                    CategoryId = ToolsId,
                    StockQuantity = 30,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 15, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 15, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                    Name = "Compact Electric Scooter",
                    Description = "Foldable urban scooter with long-range battery, front light, and dual braking.",
                    Price = 499.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=80",
                    CategoryId = VehiclesId,
                    StockQuantity = 6,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 20, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 20, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    Name = "Noise Cancelling Headphones",
                    Description = "Over-ear headphones with adaptive noise cancelling and premium audio tuning.",
                    Price = 149.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1518441902117-f0f0f8d0f1dd?auto=format&fit=crop&w=900&q=80",
                    CategoryId = ElectronicsId,
                    StockQuantity = 20,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 25, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 25, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("12121212-1212-1212-1212-121212121212"),
                    Name = "Upholstered Dining Chair Set",
                    Description = "Set of two cushioned chairs designed for comfort, durability, and a clean silhouette.",
                    Price = 299.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
                    CategoryId = FurnitureId,
                    StockQuantity = 14,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 30, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 30, 0, DateTimeKind.Utc)
                },
                new Product
                {
                    Id = Guid.Parse("34343434-3434-3434-3434-343434343434"),
                    Name = "Pressure Washer",
                    Description = "High-pressure cleaner for patios, cars, and outdoor furniture with adjustable spray modes.",
                    Price = 219.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
                    CategoryId = ToolsId,
                    StockQuantity = 9,
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 7, 18, 0, 35, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2026, 7, 18, 0, 35, 0, DateTimeKind.Utc)
                }
            );
        }

        await db.SaveChangesAsync();
    }
}