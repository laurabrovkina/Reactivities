using API.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services
    .AddApiServices()
    .AddApplicationServices(builder.Configuration)
    .AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseErrorHandling();

if (app.Environment.IsDevelopment())
{
    // Add development-specific middleware here if needed
}

// Configure API middleware pipeline
app.UseApiConfiguration();

// Initialize and seed database
try
{
    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.InitializeDatabaseAsync();
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during application startup");
    throw; // Rethrow to prevent application startup if database initialization fails
}

await app.RunAsync();
