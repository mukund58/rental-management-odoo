using BCrypt.Net;
using backend.Models;
using backend.Constants;
using backend.Features.Rentals.Enums;
namespace backend.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Users.Any())
            return;

        var admin = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "System",
            LastName = "Admin",
            Email = "admin@rentpro.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin
        };

        var vendor1 = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Raj",
            LastName = "Rental",
            Email = "vendor1@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
            Role = UserRole.Vendor
        };

        var vendor2 = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Priya",
            LastName = "Equipment",
            Email = "vendor2@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
            Role = UserRole.Vendor
        };
        var categories = new List<Category>
        {
            new() { Id=Guid.NewGuid(), Name="Cameras" },
            new() { Id=Guid.NewGuid(), Name="Laptops" },
            new() { Id=Guid.NewGuid(), Name="Speakers" },
            new() { Id=Guid.NewGuid(), Name="Projectors" },
            new() { Id=Guid.NewGuid(), Name="Tools" },
            new() { Id=Guid.NewGuid(), Name="Furniture" },
            new() { Id=Guid.NewGuid(), Name="Gaming" },
            new() { Id=Guid.NewGuid(), Name="Sports" }
        };

        var cameraCategory = categories.First(x => x.Name == "Cameras");

        db.Products.AddRange(
        new Product
        {
            Id = Guid.NewGuid(),
            Name = "Canon EOS R50",
            Description = "Mirrorless Camera",
            CategoryId = cameraCategory.Id,
            Price = 1500,
            Deposit = 5000,
            StockQuantity = 4,
            IsActive = true
        },
        new Product
        {
            Id = Guid.NewGuid(),
            Name = "Sony A6400",
            Description = "Mirrorless Camera",
            CategoryId = cameraCategory.Id,
            Price = 1800,
            Deposit = 6000,
            StockQuantity = 3,
            IsActive = true
        });
        var customers = new List<User>();

        for (int i = 1; i <= 5; i++)
        {
            customers.Add(new User
            {
                Id = Guid.NewGuid(),
                FirstName = $"Customer{i}",
                LastName = "Demo",
                Email = $"customer{i}@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                Role = UserRole.Customer
            });
        }
        var order = new RentalOrder
        {
            Id = Guid.NewGuid(),
            OrderNumber = "RNT-000001",
            InvoiceNumber = "INV-000001",
            CustomerId = customers[0].Id,
            VendorId = vendor1.Id,
            PickupDate = DateTime.UtcNow,
            ReturnDate = DateTime.UtcNow.AddDays(3),
            Status = RentalStatus.Returned,
            SubTotal = 3000,
            Deposit = 5000,
            TotalAmount = 8000,
            IsPaid = true
        };

        db.RentalOrders.Add(order);
        db.Users.AddRange(customers);
        
        db.Categories.AddRange(categories);

        db.Users.AddRange(admin, vendor1, vendor2);

        await db.SaveChangesAsync();
    }
}