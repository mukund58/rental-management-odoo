using System.ComponentModel.DataAnnotations;

namespace backend.Features.Auth;

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}