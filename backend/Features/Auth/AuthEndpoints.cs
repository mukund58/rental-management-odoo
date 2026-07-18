using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Constants;
namespace backend.Features.Auth;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapGet("/categories", async (AppDbContext db) =>
        {
            var categories = await db.Categories
                .AsNoTracking()
                .OrderBy(category => category.Name)
                .Select(category => new
                {
                    id = category.Id,
                    name = category.Name
                })
                .ToListAsync();

            return Results.Ok(categories);
        });

        group.MapPost("/register", (RegisterRequestDto request, HttpContext context, AuthService authService) => authService.Register(request, context));

        group.MapPost("/register/vendor", (VendorRegisterRequestDto request, HttpContext context, AuthService authService) => authService.RegisterVendor(request, context));

        group.MapPost("/login", (LoginRequestDto request, HttpContext context, AuthService authService) => authService.Login(request, context));

        group.MapPost("/refresh", (HttpContext context, AuthService authService) => authService.Refresh(context));

        group.MapPost("/logout", (HttpContext context, ClaimsPrincipal claims, AuthService authService) => authService.Logout(context, claims))
            .RequireAuthorization();

        group.MapPost("/forgot-password", (ForgotPasswordRequestDto request, AuthService authService) => authService.ForgotPassword(request));

        group.MapGet("/me", (ClaimsPrincipal claims, AuthService authService) => authService.Me(claims))
            .RequireAuthorization();

        group.MapGet("/admin", () => Results.Ok("Admin only"))
            .RequireAuthorization(policy =>
                policy.RequireRole(UserRole.Admin.ToString()));

        return group;
    }
}
