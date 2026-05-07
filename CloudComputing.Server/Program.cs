using BCrypt.Net;
using CloudComputing.Data;
using CloudComputing.Data.Models;
using CloudComputing.Server;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Connect db
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = false;

        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
                
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.FromMinutes(1),
        };

        //Read token from cookie instead of header
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["jwt"];
                return Task.CompletedTask;
            },

            OnChallenge = async context =>
            {
                // Prevent default behavior
                context.HandleResponse();

                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";

                var error = new ApiError(
                    ErrorCodes.Unauthorized,
                    "Access token is missing or invalid"
                );

                await context.Response.WriteAsJsonAsync(error);
            },

            OnForbidden = async context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";

                var error = new ApiError(
                    ErrorCodes.OperationForbiden,
                    "You do not have permission to access this resource"
                );

                await context.Response.WriteAsJsonAsync(error);
            }
        };
    }
);

builder.Services.AddAuthorization();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();   
}

//Run migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    
    //Apply migrations
    db.Database.Migrate();

    //Get config for creating default admin
    var shouldCreateAdmin = config.GetValue<bool>("Admin:ShouldCreate");
    var adminUsername = config["Admin:Username"];
    var adminPassword = config["Admin:Password"];

    if (shouldCreateAdmin && 
        !string.IsNullOrEmpty(adminUsername) && 
        !string.IsNullOrEmpty(adminPassword))
    {
        //Create if not exist
        if (!await db.Users.AnyAsync(u => u.Username == adminUsername))
        {
            db.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = adminUsername,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                Role = UserRoles.Admin
            });

            await db.SaveChangesAsync();
            Console.WriteLine($"Admin user '{adminUsername}' created.");
        }
    }

}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
