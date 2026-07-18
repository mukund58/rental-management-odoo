using FluentValidation;

namespace backend.Features.Checkout.Validators;

public class CheckoutValidator
    : AbstractValidator<CheckoutRequestDto>
{
    public CheckoutValidator()
    {


        RuleFor(x => x.VendorId)
            .NotEmpty();

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

        RuleFor(x => x.PickupDate)
            .GreaterThan(DateTime.UtcNow);

        RuleFor(x => x.ReturnDate)
            .GreaterThan(x => x.PickupDate);
    }
}