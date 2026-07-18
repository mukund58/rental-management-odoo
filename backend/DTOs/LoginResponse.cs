namespace backend.DTOs;

public record AuthResponse(
    string Token,
    string Name,
    string Email,
    string Role
);
