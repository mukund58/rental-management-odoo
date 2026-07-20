namespace backend.Features.Cart;

public record AddToCartRequest(
    Guid ProductId,
    int Quantity,
    DateTime PickupDate,
    DateTime ReturnDate);

public record UpdateCartRequest(
    int Quantity);

public sealed record CartItemDto(
    Guid Id,
    Guid ProductId,
    int Quantity,
    DateTime RentalStart,
    DateTime RentalEnd,
    decimal PricePerUnit,
    string Name,
    string? ImageUrl,
    int RentalDurationDays);

public record CartDto(
    Guid CartId,
    List<CartItemDto> Items,
    decimal Subtotal,
    decimal Deposit,
    decimal Total);

public sealed record AddCartItemRequest(
    Guid ProductId,
    int Quantity,
    DateTime RentalStart,
    DateTime RentalEnd,
    decimal PricePerUnit);