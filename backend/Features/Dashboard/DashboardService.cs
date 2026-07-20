using backend.Data;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using backend.Constants;
namespace backend.Features.Dashboard;

public class DashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IResult> GetDashboard()
    {
        var today = DateTime.UtcNow.Date;

        var dashboard = new DashboardDto
        {
            TotalProducts = await _db.Products.CountAsync(),

            ActiveProducts = await _db.Products
                .CountAsync(x => x.IsActive),

            TotalCustomers = await _db.Users
                .CountAsync(x => x.Role == UserRole.Customer),

            TotalVendors = await _db.Users
                .CountAsync(x => x.Role == UserRole.Vendor),

                ActiveRentals = await _db.RentalOrders
                    .CountAsync(x =>
                        x.Status == backend.Features.Rentals.Enums.RentalStatus.Reserved ||
                        x.Status == backend.Features.Rentals.Enums.RentalStatus.PickedUp),

            TodayPickups = await _db.RentalOrders
                .CountAsync(x =>
                    x.PickupDate.Date == today),

            TodayReturns = await _db.RentalOrders
                .CountAsync(x =>
                    x.ReturnDate.Date == today),

            LateRentals = await _db.RentalOrders
                .CountAsync(x =>
                    x.Status == backend.Features.Rentals.Enums.RentalStatus.Late),

            TotalRevenue = await _db.RentalOrders
                .SumAsync(x => (decimal?)x.SubTotal) ?? 0,

            TotalDeposit = await _db.RentalOrders
                .SumAsync(x => (decimal?)x.Deposit) ?? 0,

            TotalLateFees = await _db.RentalOrders
                .SumAsync(x => (decimal?)x.LateFee) ?? 0
        };

        return Results.Ok(dashboard);


    }
    public async Task<IResult> GetRevenueChart()
    {
        var rawData = await _db.RentalOrders
            .GroupBy(x => new
            {
                x.CreatedAt.Year,
                x.CreatedAt.Month
            })
            .Select(x => new
            {
                x.Key.Month,
                x.Key.Year,
                Revenue = x.Sum(r => r.TotalAmount)
            })
            .ToListAsync();

        var data = rawData
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .Select(x => new RevenueChartDto
            {
                Month = $"{x.Month}/{x.Year}",
                Revenue = x.Revenue
            })
            .ToList();

        return Results.Ok(data);
    }
};
