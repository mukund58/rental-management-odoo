using System.ComponentModel.DataAnnotations;

namespace backend.Features.Auth;

public class ForgotPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}