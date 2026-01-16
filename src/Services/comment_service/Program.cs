using comment_service;
using comment_service.Behaviors;
using comment_service.Common.Interfaces;
using comment_service.Dispatcher;
using comment_service.Messaging.RabbitMQ;
using comment_service.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    );
});

builder.Services.AddScoped<ICommandDispatcher, CommandDispatcher>();
builder.Services.AddScoped<IQueryDispatcher, QueryDispatcher>();
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = builder.Configuration.GetValue<string>("Redis:Configuration");
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddScoped<ICacheService, RedisCacheService>();
builder.Services.AddScoped<ICacheVersionManagement, RedisCacheVersionManager>();
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));
builder.Services.AddScoped<IRabbitMqProducer, RabbitMqProducer>();
builder.Services.AddSingleton<RabbitMqConfig>(sp =>
{
    var config = new RabbitMqConfig
    {
        HostName = builder.Configuration.GetValue<string>("RabbitMQ:HostName"),
        UserName = builder.Configuration.GetValue<string>("RabbitMQ:UserName"),
        Password = builder.Configuration.GetValue<string>("RabbitMQ:Password"),
        Port = builder.Configuration.GetValue<int>("RabbitMQ:Port"),
        ExchangeName = builder.Configuration.GetValue<string>("RabbitMQ:ExchangeName")
    };
    return config;
});

var assembly = typeof(Program).Assembly;

builder.Services.Scan(scan => scan
    .FromAssemblies(assembly)
    .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)))
    .AsImplementedInterfaces()
    .WithScopedLifetime()
    .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)))
    .AsImplementedInterfaces()
    .WithScopedLifetime());

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
