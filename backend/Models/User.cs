namespace backend.Models;
using backend.Constants;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Name => $"{FirstName} {LastName}";

   
    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Customer;

    public string PasswordHash { get; set; } = string.Empty;

    public bool EmailVerified { get; set; } = false;

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiryTime { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RentalOrder> CustomerRentals { get; set; }
    = new List<RentalOrder>();

    public ICollection<RentalOrder> VendorRentals { get; set; }
        = new List<RentalOrder>();
    public ICollection<CartItem> CartItems { get; set; }
    = new List<CartItem>();
    public Cart? Cart { get; set; }
}
