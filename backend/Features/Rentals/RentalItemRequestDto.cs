namespace backend.Features.Rentals;

public class RentalItemRequestDto
{
    public Guid ProductId { get; set; }

    public int Quantity { get; set; }
}