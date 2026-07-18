namespace backend.Features.Rentals;

public class CreateRentalRequestDto
{
    public Guid CustomerId { get; set; }

    public Guid VendorId { get; set; }

    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public string? Notes { get; set; }

    public List<RentalItemRequestDto> Items { get; set; } = [];
}