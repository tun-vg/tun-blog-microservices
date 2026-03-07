using Hangfire;
using Hangfire.MySql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NotificationService;
using NotificationService.Commons;
using NotificationService.Consumers;
using NotificationService.Grpc;
using NotificationService.Hubs;
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

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration.GetValue<string>("Keycloak:Authority");
        options.Audience = builder.Configuration.GetValue<string>("Keycloak:Audience");
        options.MetadataAddress = builder.Configuration.GetValue<string>("Keycloak:MetadataAddress");
        options.RequireHttpsMetadata = builder.Configuration.GetValue<bool>("Keycloak:RequireHttps");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Keycloak:Authority"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && 
                    path.StartsWithSegments("/notificationHub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddSingleton<RabbitMqConfig>(sp =>
{
    var rabbitMqConnection = new RabbitMqConnection()
    {
        HostName = builder.Configuration.GetValue<string>("RabbitMQ:Connection:HostName"),
        Port = builder.Configuration.GetValue<int>("RabbitMQ:Connection:Port"),
        UserName = builder.Configuration.GetValue<string>("RabbitMQ:Connection:UserName"),
        Password = builder.Configuration.GetValue<string>("RabbitMQ:Connection:Password")
    };

    var rabbitMqExchange = new RabbitMqExchange()
    {
        Content = builder.Configuration.GetValue<string>("RabbitMQ:Exchanges:Content"),
        Notification = builder.Configuration.GetValue<string>("RabbitMQ:Exchanges:Notification")
    };

    var rabbitMqConfig = new RabbitMqConfig()
    {
        RabbitMqConnection = rabbitMqConnection,
        RabbitMqExchange = rabbitMqExchange
    };
    return rabbitMqConfig;
});

builder.Services.AddScoped<INotificationService, NotificationService.Services.NotificationService>();
builder.Services.AddHostedService<CommentCreatedConsumer>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IPostService, PostGrpcClient>();
builder.Services.AddScoped<IUserService, UserGrpcClient>();
builder.Services.AddSingleton<IUserIdProvider, KeycloakUserIdProvider>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<IUserSubscriptionService, UserSubscriptionService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<IRabbitMqProducer, RabbitMqProducer>();
builder.Services.AddTransient<IEmailService, EmailService>();
var hangfireConnectionString =  builder.Configuration.GetConnectionString("HangfireConnection");
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseStorage(new MySqlStorage(hangfireConnectionString, new MySqlStorageOptions
    {
        // Recommended options for standard production environments
        TransactionIsolationLevel = System.Transactions.IsolationLevel.ReadCommitted,
        QueuePollInterval = TimeSpan.FromSeconds(15),
        JobExpirationCheckInterval = TimeSpan.FromHours(1),
        CountersAggregateInterval = TimeSpan.FromMinutes(5),
        PrepareSchemaIfNecessary = true,
        DashboardJobListLimit = 50000,
        TransactionTimeout = TimeSpan.FromMinutes(1),
        TablesPrefix = "Hangfire"
    })));
builder.Services.AddHangfireServer();

builder.Services.AddSingleton<MailSettings>(cf =>
{
    var MailSettings = new MailSettings()
    {
        Mail = builder.Configuration.GetValue<string>("MailSettings:Mail"),
        DisplayName = builder.Configuration.GetValue<string>("MailSettings:DisplayName"),
        Password = builder.Configuration.GetValue<string>("MailSettings:Password"),
        Host = builder.Configuration.GetValue<string>("MailSettings:Host"),
        Port = builder.Configuration.GetValue<int>("MailSettings:Port")
    };
    return MailSettings;
});
builder.Services.AddHostedService<SendEmailWeeklyConsumer>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:5000")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
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

app.UseAuthentication();

app.UseAuthorization();

app.UseHangfireDashboard();

RecurringJob.AddOrUpdate<IEmailService>(
    "send-weekly-newletter",
    service => service.PublishMessageEmailAsync(),
    Cron.Weekly(DayOfWeek.Saturday, 9, 0)
    );

app.MapControllers();

app.MapHub<NotificationHub>("/notificationHub");

app.Run();
