RuleFor(x => x.GstNumber)
    .NotEmpty()
    .Matches(@"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$")
    .WithMessage("Invalid GST Number.");