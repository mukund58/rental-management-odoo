namespace backend.Features.Checkout;

public class CheckoutRequestDto
{
    //public Guid CustomerId { get; set; }
    public Guid VendorId { get; set; }


    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public AddressDto? DeliveryAddress { get; set; }

    public AddressDto? BillingAddress { get; set; }

    public CardDetailsDto? CardDetails { get; set; }

    public List<CheckoutItemDto> Items { get; set; } = new();
}

public class AddressDto
{
    public string FullName { get; set; } = "";
    public string Phone { get; set; } = "";
    public string AddressLine1 { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public string Country { get; set; } = "";
}

public class CardDetailsDto
{
    public string CardHolderName { get; set; } = "";
    public string CardNumber { get; set; } = ""; // Note: Real apps shouldn't store this, but we parse it here
    public string ExpiryDate { get; set; } = "";
    public string Cvv { get; set; } = "";
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

public class UpdateOrderStatusDto
{
    public backend.Features.Rentals.Enums.RentalStatus Status { get; set; }
}