using Microsoft.EntityFrameworkCore;
using NotificationService;
using NotificationService.Consumers;
using NotificationService.Grpc;
using NotificationService.RabbitMQ;
using NotificationService.Repositories;
using NotificationService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

builder.Services.AddSingleton<RabbitMqConfig>(sp =>
{
    var config = new RabbitMqConfig
    {
        HostName = builder.Configuration.GetValue<string>("RabbitMQ:HostName"),
        Port = builder.Configuration.GetValue<int>("RabbitMQ:Port"),
        UserName = builder.Configuration.GetValue<string>("RabbitMQ:UserName"),
        Password = builder.Configuration.GetValue<string>("RabbitMQ:Password"),
        ExchangeName = builder.Configuration.GetValue<string>("RabbitMQ:ExchangeName")
    };
    return config;
});

builder.Services.AddScoped<INotificationService, NotificationService.Services.NotificationService>();
builder.Services.AddHostedService<CommentCreatedConsumer>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IPostService, PostGrpcClient>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
