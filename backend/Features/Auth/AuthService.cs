using System.Security.Claims;
using backend.Data;
using backend.Constants;
using backend.Models;
using Microsoft.EntityFrameworkCore;
namespace backend.Features.Auth;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        AppDbContext db,
        JwtService jwt,
        ILogger<AuthService> logger)
    {
        _db = db;
        _jwt = jwt;
        _logger = logger;
    }

    public async Task<IResult> Register(
        RegisterRequestDto request,
        HttpContext context)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await _db.Users.AnyAsync(x => x.Email == email))
            return Results.BadRequest("Email already exists");

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Customer
        };

        var accessToken = _jwt.GenerateToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        CookieHelper.SetTokens(context, accessToken, refreshToken);

        return Results.Ok(new AuthResponseDto
        {
            User = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        });
    }

    public async Task<IResult> Login(
        LoginRequestDto request,
        HttpContext context)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == email);

        if (user is null)
            return Results.Unauthorized();

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Results.Unauthorized();

        var accessToken = _jwt.GenerateToken(user);
        var refreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _db.SaveChangesAsync();

        CookieHelper.SetTokens(context, accessToken, refreshToken);

        return Results.Ok(new AuthResponseDto
        {
            User = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        });
    }

    public async Task<IResult> Refresh(HttpContext context)
    {
        var refreshToken = context.Request.Cookies["refreshToken"];

        if (string.IsNullOrWhiteSpace(refreshToken))
            return Results.Unauthorized();

        var user = await _db.Users
            .SingleOrDefaultAsync(x => x.RefreshToken == refreshToken);

        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return Results.Unauthorized();

        var accessToken = _jwt.GenerateToken(user);
        var newRefreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _db.SaveChangesAsync();

        CookieHelper.SetTokens(context, accessToken, newRefreshToken);

        return Results.Ok();
    }

    public async Task<IResult> Logout(
        HttpContext context,
        ClaimsPrincipal claims)
    {
        var id = GetUserId(claims);

        if (id != null)
        {
            var user = await _db.Users.FindAsync(id);

            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;

                await _db.SaveChangesAsync();
            }
        }

        CookieHelper.Clear(context);

        return Results.Ok(new
        {
            message = "Logged out successfully"
        });
    }

    public async Task<IResult> Me(ClaimsPrincipal claims)
    {
        var id = GetUserId(claims);

        if (id == null)
            return Results.Unauthorized();

        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user is null)
            return Results.Unauthorized();

        return Results.Ok(new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.ToString()
        });
    }

    public async Task<IResult> RegisterVendor(
        VendorRegisterRequestDto request,
        HttpContext context)
    {
        // implement later
        return Results.Ok();
    }

    public async Task<IResult> ForgotPassword(
        ForgotPasswordRequestDto request)
    {
        return Results.Ok(new
        {
            message = "Password reset link sent."
        });
    }

    private static Guid? GetUserId(ClaimsPrincipal claims)
    {
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(userId, out var id) ? id : null;
    }
}
