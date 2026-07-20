using BCrypt.Net;
using backend.Models;
using backend.Constants;
using backend.Features.Rentals.Enums;

namespace backend.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (!db.Users.Any())
        {

        // ── Users ──────────────────────────────────────────────
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

        var customers = new List<User>
        {
            new() { Id = Guid.NewGuid(), FirstName = "Aarav",  LastName = "Sharma",  Email = "aarav@test.com",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
            new() { Id = Guid.NewGuid(), FirstName = "Ishaan", LastName = "Patel",   Email = "ishaan@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
            new() { Id = Guid.NewGuid(), FirstName = "Ananya", LastName = "Rao",     Email = "ananya@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
            new() { Id = Guid.NewGuid(), FirstName = "Kabir",  LastName = "Mehta",   Email = "kabir@test.com",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
            new() { Id = Guid.NewGuid(), FirstName = "Diya",   LastName = "Sen",     Email = "diya@test.com",   PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
            new() { Id = Guid.NewGuid(), FirstName = "Nisha",  LastName = "Gill",    Email = "nisha@test.com",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
            new() { Id = Guid.NewGuid(), FirstName = "Rohan",  LastName = "Shah",    Email = "rohan@test.com",  PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"), Role = UserRole.Customer },
        };

        db.Users.AddRange(admin, vendor1, vendor2);
        db.Users.AddRange(customers);

        // ── Categories ─────────────────────────────────────────
        var categories = new List<Category>
        {
            new() { Id = Guid.NewGuid(), Name = "Cameras" },
            new() { Id = Guid.NewGuid(), Name = "Laptops" },
            new() { Id = Guid.NewGuid(), Name = "Speakers" },
            new() { Id = Guid.NewGuid(), Name = "Projectors" },
            new() { Id = Guid.NewGuid(), Name = "Tools" },
            new() { Id = Guid.NewGuid(), Name = "Furniture" },
            new() { Id = Guid.NewGuid(), Name = "Gaming" },
            new() { Id = Guid.NewGuid(), Name = "Sports" },
            new() { Id = Guid.NewGuid(), Name = "Electronics" },
            new() { Id = Guid.NewGuid(), Name = "Bikes" },
        };
        db.Categories.AddRange(categories);

        var camCat  = categories.First(x => x.Name == "Cameras");
        var laptopCat = categories.First(x => x.Name == "Laptops");
        var projCat = categories.First(x => x.Name == "Projectors");
        var gameCat = categories.First(x => x.Name == "Gaming");
        var bikeCat = categories.First(x => x.Name == "Bikes");
        var elecCat = categories.First(x => x.Name == "Electronics");
        var sporCat = categories.First(x => x.Name == "Sports");

        // ── Products ───────────────────────────────────────────
        var products = new List<Product>
        {
            new() { Id = Guid.NewGuid(), Name = "Canon EOS R50",            Description = "24.2 MP mirrorless camera, great for weddings and events.",       CategoryId = camCat.Id,   Price = 1500, Deposit = 5000, StockQuantity = 4,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Sony A6400",               Description = "Fast autofocus APS-C mirrorless, ideal for videography.",          CategoryId = camCat.Id,   Price = 1800, Deposit = 6000, StockQuantity = 3,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400" },
            new() { Id = Guid.NewGuid(), Name = "MacBook Pro 14\"",          Description = "Apple M3 chip, 16 GB RAM, perfect for developers & designers.",    CategoryId = laptopCat.Id, Price = 2200, Deposit = 8000, StockQuantity = 5, IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Dell XPS 15",              Description = "Intel Core i7, 16 GB RAM, 4K OLED display.",                       CategoryId = laptopCat.Id, Price = 1900, Deposit = 7000, StockQuantity = 4, IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Portable Projector BenQ",  Description = "Full HD 3500-lumen portable projector with carry bag.",             CategoryId = projCat.Id,  Price = 800,  Deposit = 3000, StockQuantity = 6,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400" },
            new() { Id = Guid.NewGuid(), Name = "PS5 Console Bundle",       Description = "Sony PlayStation 5 with 2 controllers and 3 game titles.",          CategoryId = gameCat.Id,  Price = 600,  Deposit = 4000, StockQuantity = 8,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Mountain Bike Trek",       Description = "Trek Marlin 7, 29 inch trail hardtail mountain bike.",               CategoryId = bikeCat.Id,  Price = 350,  Deposit = 2000, StockQuantity = 10, IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Bose SoundLink Speaker",   Description = "360° surround sound portable Bluetooth speaker.",                   CategoryId = elecCat.Id,  Price = 400,  Deposit = 1500, StockQuantity = 7,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Camping Tent 4-Person",    Description = "Waterproof 4-person dome tent with rain fly and gear loft.",        CategoryId = sporCat.Id,  Price = 250,  Deposit = 1000, StockQuantity = 12, IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400" },
            new() { Id = Guid.NewGuid(), Name = "DJI Gimbal Stabilizer",    Description = "3-axis motorized gimbal for smooth video recording with any phone.",CategoryId = camCat.Id,   Price = 700,  Deposit = 2500, StockQuantity = 5,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Pressure Washer 2000W",    Description = "High-pressure electric washer, ideal for cars, patios, and walls.",  CategoryId = elecCat.Id,  Price = 219,  Deposit = 800,  StockQuantity = 9,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400" },
            new() { Id = Guid.NewGuid(), Name = "Compact Electric Scooter", Description = "Xiaomi Mi Electric Scooter 3 — 25 km range, portable.",             CategoryId = elecCat.Id,  Price = 499,  Deposit = 3500, StockQuantity = 6,  IsActive = true, ImageUrl = "https://images.unsplash.com/photo-1590673349374-da74af41b53a?w=400" },
        };
        db.Products.AddRange(products);

        // ── Rental Orders ──────────────────────────────────────
        // Helper to create an order with items
        var now = DateTime.UtcNow;
        var orderNumber = 1;

        RentalOrder MakeOrder(User customer, User vendor, Product product, int qty,
            int daysAgo, int durationDays, RentalStatus status, bool isLate = false)
        {
            var pickup  = now.AddDays(-daysAgo);
            var @return = pickup.AddDays(durationDays);
            var unit    = product.Price * qty;
            var dep     = product.Deposit * qty;
            var late    = isLate ? 350m : 0m;
            var item = new RentalItem
            {
                Id = Guid.NewGuid(), ProductId = product.Id, Quantity = qty,
                UnitPrice = product.Price, Deposit = dep, TotalPrice = unit
            };
            return new RentalOrder
            {
                Id            = Guid.NewGuid(),
                OrderNumber   = $"RNT-{orderNumber++:D6}",
                InvoiceNumber = $"INV-{orderNumber:D6}",
                CustomerId    = customer.Id,
                VendorId      = vendor.Id,
                PickupDate    = pickup,
                ReturnDate    = @return,
                Status        = status,
                SubTotal      = unit,
                Deposit       = dep,
                LateFee       = late,
                TotalAmount   = unit + dep + late,
                IsPaid        = true,
                PaymentMethod = "Card",
                DeliveryMethod = "Standard",
                CreatedAt     = pickup.AddHours(-2),
                UpdatedAt     = now,
                Items         = new List<RentalItem> { item }
            };
        }

        var orders = new List<RentalOrder>
        {
            MakeOrder(customers[0], vendor1, products[0],  1, 5,  7, RentalStatus.PickedUp),
            MakeOrder(customers[1], vendor1, products[6],  1, 8,  7, RentalStatus.Returned),
            MakeOrder(customers[2], vendor1, products[5],  1, 2,  5, RentalStatus.Reserved),
            MakeOrder(customers[3], vendor1, products[4],  1, 15, 7, RentalStatus.Returned),
            MakeOrder(customers[4], vendor2, products[8],  1, 3,  6, RentalStatus.PickedUp),
            MakeOrder(customers[5], vendor2, products[9],  1, 10, 4, RentalStatus.Late, isLate: true),
            MakeOrder(customers[6], vendor2, products[2],  1, 1,  5, RentalStatus.Reserved),
            MakeOrder(customers[0], vendor1, products[3],  1, 20, 7, RentalStatus.Returned),
            MakeOrder(customers[1], vendor1, products[10], 1, 0,  3, RentalStatus.Reserved),
            MakeOrder(customers[2], vendor2, products[11], 1, 6,  5, RentalStatus.PickedUp),
            MakeOrder(customers[3], vendor1, products[1],  1, 30, 7, RentalStatus.Returned),
            MakeOrder(customers[4], vendor2, products[7],  1, 12, 4, RentalStatus.Cancelled),
        };

        db.RentalOrders.AddRange(orders);

        await db.SaveChangesAsync();
        } // End of if (!db.Users.Any())

        // ── 2026 Schedule Calendar Seed Data ──────────────────────
        if (!db.RentalOrders.Any(o => o.OrderNumber.StartsWith("SCHED-26")))
        {
            var customer = db.Users.FirstOrDefault(u => u.Role == UserRole.Customer);
            var vendor = db.Users.FirstOrDefault(u => u.Role == UserRole.Vendor);
            var p1 = db.Products.FirstOrDefault();
            var p2 = db.Products.Skip(1).FirstOrDefault();
            var p3 = db.Products.Skip(2).FirstOrDefault();

            if (customer != null && vendor != null && p1 != null && p2 != null && p3 != null)
            {
                var schedOrders = new List<RentalOrder>
                {
                    // Jan 5th, 2026
                    new RentalOrder
                    {
                        Id = Guid.NewGuid(), OrderNumber = "SCHED-26-001", InvoiceNumber = "INV-SCHED-01",
                        CustomerId = customer.Id, VendorId = vendor.Id,
                        PickupDate = new DateTime(2026, 1, 5, 10, 0, 0, DateTimeKind.Utc),
                        ReturnDate = new DateTime(2026, 1, 10, 18, 0, 0, DateTimeKind.Utc),
                        Status = RentalStatus.PickedUp,
                        SubTotal = p1.Price, Deposit = p1.Deposit, TotalAmount = p1.Price + p1.Deposit,
                        IsPaid = true, PaymentMethod = "Card", DeliveryMethod = "Standard",
                        CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
                        Items = new List<RentalItem> { new RentalItem { Id = Guid.NewGuid(), ProductId = p1.Id, Quantity = 1, UnitPrice = p1.Price, Deposit = p1.Deposit, TotalPrice = p1.Price } }
                    },
                    // Jan 6th, 2026
                    new RentalOrder
                    {
                        Id = Guid.NewGuid(), OrderNumber = "SCHED-26-002", InvoiceNumber = "INV-SCHED-02",
                        CustomerId = customer.Id, VendorId = vendor.Id,
                        PickupDate = new DateTime(2026, 1, 6, 10, 0, 0, DateTimeKind.Utc),
                        ReturnDate = new DateTime(2026, 1, 8, 18, 0, 0, DateTimeKind.Utc),
                        Status = RentalStatus.Reserved,
                        SubTotal = p2.Price, Deposit = p2.Deposit, TotalAmount = p2.Price + p2.Deposit,
                        IsPaid = true, PaymentMethod = "Card", DeliveryMethod = "Standard",
                        CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
                        Items = new List<RentalItem> { new RentalItem { Id = Guid.NewGuid(), ProductId = p2.Id, Quantity = 1, UnitPrice = p2.Price, Deposit = p2.Deposit, TotalPrice = p2.Price } }
                    },
                    // Jan 28th, 2026
                    new RentalOrder
                    {
                        Id = Guid.NewGuid(), OrderNumber = "SCHED-26-003", InvoiceNumber = "INV-SCHED-03",
                        CustomerId = customer.Id, VendorId = vendor.Id,
                        PickupDate = new DateTime(2026, 1, 25, 10, 0, 0, DateTimeKind.Utc),
                        ReturnDate = new DateTime(2026, 1, 28, 18, 0, 0, DateTimeKind.Utc),
                        Status = RentalStatus.Late, LateFee = 50,
                        SubTotal = p3.Price, Deposit = p3.Deposit, TotalAmount = p3.Price + p3.Deposit + 50,
                        IsPaid = true, PaymentMethod = "Card", DeliveryMethod = "Standard",
                        CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
                        Items = new List<RentalItem> { new RentalItem { Id = Guid.NewGuid(), ProductId = p3.Id, Quantity = 1, UnitPrice = p3.Price, Deposit = p3.Deposit, TotalPrice = p3.Price } }
                    }
                };

                db.RentalOrders.AddRange(schedOrders);
                await db.SaveChangesAsync();
            }
        }
    }
}