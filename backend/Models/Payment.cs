using backend.Features.Checkout;

namespace backend.Models;

public class Payment
{
    public Guid Id { get; set; }

    public Guid RentalOrderId { get; set; }

    public RentalOrder RentalOrder { get; set; } = default!;

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public PaymentStatus Status { get; set; }

    public string TransactionId { get; set; } = string.Empty;

    public DateTime PaidAt { get; set; }
}