using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

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

        // UPLOAD IMAGE
        group.MapPost("/upload-image",
            async (
                [FromForm] IFormFile file,
                IWebHostEnvironment env) =>
            {
                try
                {
                    if (file == null || file.Length == 0)
                    {
                        return Results.BadRequest("No file uploaded.");
                    }

                    var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
                    var uploadsFolder = Path.Combine(webRoot, "images", "products");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    var fileUrl = $"/images/products/{uniqueFileName}";
                    return Results.Ok(new { url = fileUrl });
                }
                catch (Exception ex)
                {
                    return Results.Problem(ex.ToString());
                }
            })
            .RequireAuthorization()
            .DisableAntiforgery();

        return group;
    }
}