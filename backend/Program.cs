
using backend.Data;
using backend.Features.Auth;
using backend.Features.Auth.Validators;
using backend.Features.Products;
using backend.Features.Cart;
using backend.Extensions;
using System.Text;
using backend.Configurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using backend.Features.Rentals.Validators;
using backend.Features.Rentals;
using backend.Features.Dashboard;
using backend.Features.Products.Validators;
using backend.Features.Checkout.Validators;
using backend.Features.Checkout;
using backend.Features.Invoice;
//using backend.Features.Invoice.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSwaggerDocumentation();

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
    builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    var jwt = builder.Configuration
        .GetSection("Jwt")
        .Get<JwtOptions>()!;

    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwt.Key))
        };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["accessToken"];
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://10.206.143.170:5173",
                "http://10.206.143.170:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateRentalValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<ProductUpsertValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CheckoutValidator>();
builder.Services.AddScoped<RentalService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CheckoutService>();
builder.Services.AddScoped<CheckoutService>();
builder.Services.AddScoped<InvoiceService>();

var app = builder.Build();
app.UseCors();
app.UseHttpsRedirection();

// Enable Swagger UI in development mode

    app.UseSwagger();
    app.UseSwaggerUI();


app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapProductEndpoints();
app.MapCartEndpoints();
app.MapRentalEndpoints();
app.MapDashboardEndpoints();
app.MapCheckoutEndpoints();
app.MapInvoiceEndpoints();

// auto migration 
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await db.Database.MigrateAsync();
    await CatalogSeeder.SeedAsync(db);
}
app.Run();
