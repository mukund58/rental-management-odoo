using backend.Constants;
using backend.Features.Rentals.Enums;


namespace backend.Models;

public class RentalOrder
{
    public Guid Id { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    // Customer
    public Guid CustomerId { get; set; }
    public User Customer { get; set; } = default!;

    // Vendor
    public Guid VendorId { get; set; }
    public User Vendor { get; set; } = default!;

    // Dates
    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public DateTime? ActualReturnDate { get; set; }

    // Money
    public decimal SubTotal { get; set; }

    public decimal Deposit { get; set; }

    public decimal LateFee { get; set; }

    public decimal TotalAmount { get; set; }

    // Status
    public RentalStatus Status { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Navigation
    public ICollection<RentalItem> Items { get; set; }
        = new List<RentalItem>();
}