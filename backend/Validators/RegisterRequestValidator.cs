using FluentValidation;

namespace backend.Features.Auth.Validators;

public class RegisterRequestValidator
    : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(20)
            .Matches("[A-Z]")
                .WithMessage("Password must contain one uppercase letter.")
            .Matches("[a-z]")
                .WithMessage("Password must contain one lowercase letter.")
            .Matches("[0-9]")
                .WithMessage("Password must contain one number.")
            .Matches("[^a-zA-Z0-9]")
                .WithMessage("Password must contain one special character.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Passwords do not match.");
    }
}