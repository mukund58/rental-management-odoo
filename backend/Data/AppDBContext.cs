namespace backend.Data;

using Microsoft.EntityFrameworkCore;
using backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Core constraints
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

        // Floor -> Tables (Cascade)

        // --- USER VALIDATIONS ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.Property(u => u.ProfileImagePath).HasMaxLength(500);
            entity.HasIndex(u => u.Email).IsUnique();
        });



    }
}
