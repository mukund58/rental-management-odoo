using FluentValidation;

namespace backend.Features.Cart.Validators;

public class AddToCartValidator
    : AbstractValidator<AddToCartRequest>
{
    public AddToCartValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty();

        RuleFor(x => x.Quantity)
            .GreaterThan(0);

        RuleFor(x => x.PickupDate)
            .GreaterThan(DateTime.UtcNow);

        RuleFor(x => x.ReturnDate)
            .GreaterThan(x => x.PickupDate);
    }
}