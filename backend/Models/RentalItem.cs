namespace backend.Models;

public class RentalItem
{
    public Guid Id { get; set; }

    public Guid RentalOrderId { get; set; }

    public RentalOrder RentalOrder { get; set; } = default!;

    public Guid ProductId { get; set; }

    public Product Product { get; set; } = default!;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Deposit { get; set; }

    public decimal TotalPrice { get; set; }
}