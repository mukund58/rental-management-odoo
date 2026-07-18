namespace backend.Features.Dashboard;

public class DashboardDto
{
    public int TotalProducts { get; set; }

    public int ActiveProducts { get; set; }

    public int TotalCustomers { get; set; }

    public int TotalVendors { get; set; }

    public int ActiveRentals { get; set; }

    public int TodayPickups { get; set; }

    public int TodayReturns { get; set; }

    public int LateRentals { get; set; }

    public decimal TotalRevenue { get; set; }

    public decimal TotalDeposit { get; set; }

    public decimal TotalLateFees { get; set; }
}