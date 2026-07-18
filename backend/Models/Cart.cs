namespace backend.Models;

public class Cart
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = default!;

    public DateTime CreatedAt { get; set; }

    public ICollection<CartItem> Items { get; set; }
        = new List<CartItem>();

}