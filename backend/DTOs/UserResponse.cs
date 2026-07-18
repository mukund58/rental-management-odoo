namespace backend.DTOs;
using backend.Constants;
using System.ComponentModel.DataAnnotations;

public record UserResponse(
    Guid Id,
    string Name,
    string Email,
    UserRole Role,
    string? ProfileImagePath,
    DateTime CreatedAt
);

public record CreateUserRequestDto(
    [Required, StringLength(100, MinimumLength = 2)] string Name,
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required, StringLength(100, MinimumLength = 6)] string Password,
    [Required] UserRole Role
);


public record CustomerRequestDto(
    [Required, StringLength(100)] string Name,
    [EmailAddress, StringLength(256)] string? Email,
    [Phone, StringLength(20)] string? Phone
);
