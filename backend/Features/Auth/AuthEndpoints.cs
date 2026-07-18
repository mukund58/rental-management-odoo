using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using backend.Constants;
namespace backend.Features.Auth;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth").WithTags("Authentication");

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
