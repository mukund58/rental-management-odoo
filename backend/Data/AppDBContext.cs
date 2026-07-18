namespace backend.Data;

using Microsoft.EntityFrameworkCore;
using backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<RentalOrder> RentalOrders => Set<RentalOrder>();
    public DbSet<RentalItem> RentalItems => Set<RentalItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(u => u.Email).IsUnique();
        });
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(category => category.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(category => category.Name).IsUnique();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(product => product.Name).IsRequired().HasMaxLength(150);
            entity.Property(product => product.Description).IsRequired().HasMaxLength(1000);
            entity.Property(product => product.ImageUrl).HasMaxLength(500);
            entity.Property(product => product.Price).HasPrecision(10, 2);
            entity.HasOne(product => product.Category)
                .WithMany(category => category.Products)
                .HasForeignKey(product => product.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.Property(x => x.Deposit)
                  .HasPrecision(10, 2);
        });

        modelBuilder.Entity<RentalOrder>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.OrderNumber)
                .HasMaxLength(30)
                .IsRequired();

            entity.HasIndex(x => x.OrderNumber)
                .IsUnique();

            entity.Property(x => x.SubTotal)
                .HasPrecision(10, 2);

            entity.Property(x => x.Deposit)
                .HasPrecision(10, 2);

            entity.Property(x => x.LateFee)
                .HasPrecision(10, 2);

            entity.Property(x => x.TotalAmount)
                .HasPrecision(10, 2);

            entity.HasIndex(x => x.Status);

            entity.HasIndex(x => x.CustomerId);

            entity.HasIndex(x => x.VendorId);

            entity.HasIndex(x => x.PickupDate);

            entity.HasIndex(x => x.ReturnDate);

            entity.HasOne(x => x.Customer)
                .WithMany(x => x.CustomerRentals)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Vendor)
                .WithMany(x => x.VendorRentals)
                .HasForeignKey(x => x.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(x => x.Items)
                .WithOne(x => x.RentalOrder)
                .HasForeignKey(x => x.RentalOrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RentalItem>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.UnitPrice)
                .HasPrecision(10, 2);

            entity.Property(x => x.Deposit)
                .HasPrecision(10, 2);

            entity.Property(x => x.TotalPrice)
                .HasPrecision(10, 2);

            entity.HasIndex(x => x.ProductId);

            entity.HasOne(x => x.Product)
                .WithMany(x => x.RentalItems)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

    }
}
