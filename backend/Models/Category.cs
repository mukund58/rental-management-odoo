namespace backend.Models;
using backend.Models;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public ICollection<Vendor> Vendors { get; set; } = [];
}
