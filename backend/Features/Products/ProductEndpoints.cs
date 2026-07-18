using Microsoft.AspNetCore.Authorization;

namespace backend.Features.Products;

public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Products");

        // GET ALL
        group.MapGet("/",
            async (
                [AsParameters] ProductFilterRequest filter,
                ProductService service) =>
            {
                return await service.GetAll(filter);
            });

        // GET BY ID
        group.MapGet("/{id:guid}",
            async (
                Guid id,
                ProductService service) =>
            {
                return await service.Get(id);
            });

        // CREATE
        group.MapPost("/",
            async (
                ProductUpsertRequest request,
                ProductService service) =>
            {
                return await service.Create(request);
            })
            .RequireAuthorization();

        // UPDATE
        group.MapPut("/{id:guid}",
            async (
                Guid id,
                ProductUpsertRequest request,
                ProductService service) =>
            {
                return await service.Update(id, request);
            })
            .RequireAuthorization();

        // DELETE
        group.MapDelete("/{id:guid}",
            async (
                Guid id,
                ProductService service) =>
            {
                return await service.Delete(id);
            })
            .RequireAuthorization();

        return group;
    }
}