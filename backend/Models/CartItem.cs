namespace backend.Models;

public class CartItem
{
    public Guid Id { get; set; }

    public Guid CartId { get; set; }

    public Cart Cart { get; set; } = default!;

    public Guid ProductId { get; set; }

    public Product Product { get; set; } = default!;

    public int Quantity { get; set; }

    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }
}