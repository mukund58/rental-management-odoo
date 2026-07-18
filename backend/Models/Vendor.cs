namespace backend.Models;
using backend.Models;

public class Vendor
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; } = default!;

    public string CompanyName { get; set; } = string.Empty;

    public string GstNumber { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }

    public Category Category { get; set; } = default!;

    public bool IsApproved { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
