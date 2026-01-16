using FileService;
using FileService.Repository;
using FileService.Services;
using FileService.Services.Config;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings")
);

builder.Services.AddGrpc();
builder.Services.AddScoped<IFileService, FileService.Services.FileService>();
builder.Services.AddScoped<IFileRepository, FileRepository>();

var app = builder.Build();

app.MapGrpcService<FileGrpcService>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => "This is gRPC FileService");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
