namespace backend.Features.Invoice;

public class InvoiceDto
{
    public string InvoiceNumber { get; set; } = "";

    public string OrderNumber { get; set; } = "";

    public string Customer { get; set; } = "";

    public string Vendor { get; set; } = "";

    public DateTime PickupDate { get; set; }

    public DateTime ReturnDate { get; set; }

    public decimal SubTotal { get; set; }

    public decimal Deposit { get; set; }

    public decimal LateFee { get; set; }

    public decimal Total { get; set; }

    public string PaymentMethod { get; set; } = "";

    public string PaymentStatus { get; set; } = "";

    public List<InvoiceItemDto> Items { get; set; } = [];
}

public class InvoiceItemDto
{
    public string ProductName { get; set; } = "";

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public decimal Deposit { get; set; }

    public decimal Total { get; set; }
}