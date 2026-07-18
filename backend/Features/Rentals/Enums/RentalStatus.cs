
namespace backend.Features.Rentals.Enums;

public enum RentalStatus
{
    Draft = 1, // Added for Quotation
    QuotationSent = 2,
    Reserved = 3,
    PickedUp = 4,
    Returned = 5,
    Cancelled = 6,
    Late = 7,
    Active = 8
}