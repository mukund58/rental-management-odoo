using Microsoft.AspNetCore.Authorization;

namespace backend.Features.Rentals;

public static class RentalEndpoints
{
    public static void MapRentalEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/rentals")
            .RequireAuthorization().WithTags("Rentals"); ;

        group.MapPost("/",
            async (
                CreateRentalRequestDto dto,
                RentalService service) =>
                await service.CreateRental(dto));

        group.MapGet("/",
            async (
                RentalService service) =>
                await service.GetAllRentals());

        group.MapGet("/{id:guid}",
            async (
                Guid id,
                RentalService service) =>
                await service.GetRental(id));

        group.MapPatch("/{id:guid}/status",
            async (
                Guid id,
                UpdateRentalStatusDto dto,
                RentalService service) =>
                await service.UpdateStatus(id, dto));

        group.MapPatch("/{id:guid}/return",
            async (
                Guid id,
                RentalService service) =>
                await service.ReturnRental(id));

        group.MapDelete("/{id:guid}",
            async (
                Guid id,
                RentalService service) =>
                await service.DeleteRental(id));
    }
}