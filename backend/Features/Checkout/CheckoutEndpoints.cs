using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Features.Checkout;

public static class CheckoutEndpoints
{
    public static RouteGroupBuilder MapCheckoutEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/checkout")
            .WithTags("Checkout")
            .RequireAuthorization();

        group.MapPost("/",
            async (ClaimsPrincipal user,
                CheckoutRequestDto request,
                CheckoutService service) =>
            {
                return await service.Checkout(request,user);
            });
        group.MapGet("/orders",
            async (
                ClaimsPrincipal user,
                CheckoutService service) =>
            {
                return await service.GetOrders(user);
            });

        group.MapGet("/orders/{id:guid}",
            async (
                Guid id,
                ClaimsPrincipal user,
                CheckoutService service) =>
            {
                return await service.GetOrder(id, user);
            });

        group.MapPatch("/orders/{id:guid}/cancel",
            async (
                Guid id,
                CheckoutService service) =>
            {
                return await service.CancelOrder(id);
            });

        group.MapPatch("/orders/{id:guid}/status",
            async (
                Guid id,
                UpdateOrderStatusDto request,
                CheckoutService service) =>
            {
                return await service.UpdateOrderStatus(id, request.Status);
            });

        return group;
    }

}