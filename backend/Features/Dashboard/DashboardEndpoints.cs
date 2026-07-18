using Microsoft.AspNetCore.Authorization;

namespace backend.Features.Dashboard;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard")
            .RequireAuthorization();

        group.MapGet("/",
            async (
                DashboardService service) =>
                await service.GetDashboard());

        group.MapGet("/revenue",
            async (
                DashboardService service) =>
                await service.GetRevenueChart());
    }
}