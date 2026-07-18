namespace backend.Features.Cart;

public record AddToCartRequest(
    Guid ProductId,
    int Quantity,
    DateTime PickupDate,
    DateTime ReturnDate);

public record UpdateCartRequest(
    int Quantity);

public record CartItemDto(
    Guid CartItemId,
    Guid ProductId,
    string ProductName,
    string? ImageUrl,
    decimal Price,
    decimal Deposit,
    int Quantity,
    decimal LineTotal);

public record CartDto(
    Guid CartId,
    List<CartItemDto> Items,
    decimal Subtotal,
    decimal Deposit,
    decimal Total);