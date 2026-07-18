using FluentValidation;

namespace backend.Features.Rentals.Validators;

public class CreateRentalValidator
    : AbstractValidator<CreateRentalRequestDto>
{
    public CreateRentalValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty();

        RuleFor(x => x.VendorId)
            .NotEmpty();

        RuleFor(x => x.PickupDate)
            .GreaterThan(DateTime.UtcNow);

        RuleFor(x => x.ReturnDate)
            .GreaterThan(x => x.PickupDate);

        RuleFor(x => x.Items)
            .NotEmpty();

        RuleForEach(x => x.Items)
            .ChildRules(item =>
            {
                item.RuleFor(x => x.ProductId)
                    .NotEmpty();

                item.RuleFor(x => x.Quantity)
                    .GreaterThan(0);
            });
    }
}