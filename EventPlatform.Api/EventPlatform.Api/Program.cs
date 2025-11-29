using EventPlatform.Api.Models;
using EventPlatform.Api.Repositories;
using EventPlatform.Api.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// --------------------
//  MONGO SETTINGS
// --------------------
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("MongoDB"));

builder.Services.AddSingleton<DatabaseSettings>(sp =>
    sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);

// Main Mongo Client
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<DatabaseSettings>();
    return new MongoClient(settings.ConnectionString);
});

// Database Instance
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var settings = sp.GetRequiredService<DatabaseSettings>();
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});

// --------------------
//   REPOSITORIES
// --------------------
builder.Services.AddScoped<EventPlatform.Api.Repositories.Interfaces.IEventTypeRepository, EventTypeRepository>();
builder.Services.AddScoped<EventPlatform.Api.Repositories.Interfaces.IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IPersonalEventRepository, PersonalEventRepository>();
builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<ICustomEventRepository, CustomEventRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// --------------------
//   CORS CONFIG
// --------------------
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(origin => true)
              .SetPreflightMaxAge(TimeSpan.FromSeconds(86400));
    });
});

// --------------------
//   MVC + SWAGGER
// --------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EventPlatform API", Version = "v1" });
});

// Build App
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS should be early
app.UseCors();

app.UseHttpsRedirection();

// No authentication or authorization

app.MapControllers();

app.Run();
