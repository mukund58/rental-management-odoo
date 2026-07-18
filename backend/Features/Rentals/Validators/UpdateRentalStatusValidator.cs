using FluentValidation;

namespace backend.Features.Rentals.Validators;

public class UpdateRentalStatusValidator
    : AbstractValidator<UpdateRentalStatusDto>
{
    public UpdateRentalStatusValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum();
    }
}