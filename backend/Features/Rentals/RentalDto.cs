using backend.Features.Rentals.Enums;
using backend.Features.Rentals;
namespace backend.Features.Rentals;

public class RentalDto
{
    public Guid Id { get; set; }

    public string OrderNumber { get; set; } = "";

    public Guid CustomerId { get; set; }

    public string CustomerName { get; set; } = "";

    public Guid VendorId { get; set; }

    public string VendorName { get; set; } = "";

    public RentalStatus Status { get; set; }

    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public decimal SubTotal { get; set; }

    public decimal Deposit { get; set; }

    public decimal LateFee { get; set; }

    public decimal TotalAmount { get; set; }

    public List<RentalItemDto> Items { get; set; } = [];
}