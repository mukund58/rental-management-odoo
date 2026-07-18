namespace backend.Features.Rentals;

public class RentalItemDto
{
    public Guid ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Deposit { get; set; }

    public decimal TotalPrice { get; set; }
}