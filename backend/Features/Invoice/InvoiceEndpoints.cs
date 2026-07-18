using Microsoft.AspNetCore.Authorization;

namespace backend.Features.Invoice;

public static class InvoiceEndpoints
{
    public static RouteGroupBuilder MapInvoiceEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/invoices")
            .RequireAuthorization().WithTags("Invoices"); ;

        group.MapGet("/{orderId:guid}",
        async (
            Guid orderId,
            InvoiceService service) =>
        {
            return await service.GetInvoice(orderId);
        });

        return group;
    }
}