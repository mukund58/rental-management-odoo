namespace backend.Features.Checkout;

public class CheckoutRequestDto
{
    //public Guid CustomerId { get; set; }
    public Guid VendorId { get; set; }


    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public List<CheckoutItemDto> Items { get; set; }
        = new();
}

public class CheckoutItemDto
{
    public Guid ProductId { get; set; }

    public int Quantity { get; set; }
}

public class CheckoutResponseDto
{
    public Guid OrderId { get; set; }

    public string OrderNumber { get; set; } = "";

    public string InvoiceNumber { get; set; } = "";

    public Guid PaymentId { get; set; }

    public decimal TotalAmount { get; set; }

    public PaymentStatus PaymentStatus { get; set; }
}