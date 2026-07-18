using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore.Metadata;

namespace backend.Features.Auth;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth");

        group.MapPost("/register", Register);

        group.MapPost("/login", Login);

        group.MapPost("/refresh", Refresh);
        
        group.MapPost("/logout", Logout);

        group.MapGet("/me", (
            ClaimsPrincipal user,
            AppDbContext db) =>
        {
            return GetCurrentUser(user, db);
        })
        .RequireAuthorization();

        group.MapGet("/admin", () =>
        {
            return Results.Ok("Admin only");
        })
        .RequireAuthorization(policy =>
            policy.RequireRole("admin"));

        return group;
    }

    private static void SetTokenCookies(HttpContext context, string accessToken, string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Enforce HTTPS
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };
        context.Response.Cookies.Append("accessToken", accessToken, cookieOptions);

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Enforce HTTPS
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        context.Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);
    }

    private static async Task<IResult> GetCurrentUser(
        ClaimsPrincipal user,
        AppDbContext db)
    {
        if (!Guid.TryParse(
                user.FindFirstValue(
                    ClaimTypes.NameIdentifier),
                out var userId))
        {
            return Results.Unauthorized();
        }

        var currentUser = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (currentUser is null)
            return Results.Unauthorized();

        return Results.Ok(new UserResponse(
            currentUser.Id,
            currentUser.Name,
            currentUser.Email,
            currentUser.Role,
            currentUser.ProfileImagePath,
            currentUser.CreatedAt
            ));
    }

    private static async Task<IResult> Register(
        RegisterRequest request,
        AppDbContext db,
        JwtService jwtService,
        HttpContext context)
    {
        var exists = await db.Users
            .AnyAsync(x => x.Email == request.Email);

        if (exists)
        {
            Console.WriteLine($"[SECURITY WARN] Anomalous activity: Registration attempt with existing email: {request.Email}");
            return Results.BadRequest("Email already exists");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    request.Password)
        };

        var token = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        SetTokenCookies(context, token, refreshToken);

        return Results.Ok(
            new AuthResponse(
                string.Empty,
                user.Name,
                user.Email,
                user.Role.ToString()));
    }

    private static async Task<IResult> Login(
        LoginRequest request,
        AppDbContext db,
        JwtService jwtService,
        HttpContext context)
    {
        var user = await db.Users
            .FirstOrDefaultAsync(
                x => x.Email == request.Email);

        if (user is null)
        {
            Console.WriteLine($"[SECURITY WARN] Anomalous activity: Failed login attempt (user not found) for email: {request.Email}");
            return Results.Unauthorized();
        }

        var valid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

        if (!valid)
        {
            Console.WriteLine($"[SECURITY WARN] Anomalous activity: Failed login attempt (invalid password) for email: {request.Email}");
            return Results.Unauthorized();
        }

        var token = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await db.SaveChangesAsync();

        SetTokenCookies(context, token, refreshToken);

        return Results.Ok(
            new AuthResponse(
                string.Empty,
                user.Name,
                user.Email,
                user.Role.ToString()));
    }

    private static async Task<IResult> Refresh(
        HttpContext context,
        AppDbContext db,
        JwtService jwtService)
    {
        var refreshToken = context.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            Console.WriteLine("[SECURITY WARN] Anomalous activity: Refresh requested but refresh token is missing.");
            return Results.Unauthorized();
        }

        var user = await db.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            Console.WriteLine($"[SECURITY WARN] Anomalous activity: Invalid/expired refresh token reuse attempt. User exists: {user != null}");
            return Results.Unauthorized();
        }

        var newAccessToken = jwtService.GenerateToken(user);
        var newRefreshToken = jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await db.SaveChangesAsync();

        SetTokenCookies(context, newAccessToken, newRefreshToken);

        return Results.Ok(
            new AuthResponse(
                string.Empty,
                user.Name,
                user.Email,
                user.Role.ToString()));
    }

    private static async Task<IResult> Logout(
        HttpContext context,
        ClaimsPrincipal claimsPrincipal,
        AppDbContext db)
    {
        if (Guid.TryParse(claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            var user = await db.Users.FindAsync(userId);
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await db.SaveChangesAsync();
            }
        }

        context.Response.Cookies.Delete("accessToken", new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });
        context.Response.Cookies.Delete("refreshToken", new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });

        return Results.Ok(new { message = "Logged out successfully" });
    }
}
