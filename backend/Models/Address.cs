namespace backend.Models;


public class Address
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = default!;

    public string FullName { get; set; } = "";

    public string Phone { get; set; } = "";

    public string AddressLine1 { get; set; } = "";

    public string AddressLine2 { get; set; } = "";

    public string City { get; set; } = "";

    public string State { get; set; } = "";

    public string PostalCode { get; set; } = "";

    public bool IsDefault { get; set; }
}