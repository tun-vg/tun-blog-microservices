using Duende.AccessTokenManagement;
using Keycloak.AuthServices.Common;
using Keycloak.AuthServices.Sdk;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using UserService;
using UserService.Commons;
using UserService.RabbitMQ;
using UserService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//DI

// builder.Services.AddSingleton<KeycloakConfiguration>(sp =>
// {
//     var config = new KeycloakConfiguration
//     {
//         Realm = builder.Configuration.GetValue<string>("Keycloak:realm")
//     };
//     return config;
// });

// builder.Services.Configure<KeycloakConfiguration>(
//     builder.Configuration.GetSection(KeycloakConfiguration.SectionName));

builder.Services
    .AddOptions<KeycloakConfiguration>()
    .BindConfiguration(KeycloakConfiguration.SectionName)
    .ValidateDataAnnotations()
    .ValidateOnStart();

var options = builder.Configuration.GetKeycloakOptions<KeycloakAdminClientOptions>()!;
var tokenClientName = ClientCredentialsClientName.Parse("KeycloakAdminClient");
builder.Services.AddDistributedMemoryCache();
builder.Services
    .AddClientCredentialsTokenManagement()
    .AddClient(
        tokenClientName,
        client =>
        {
            client.ClientId = ClientId.Parse(options.Resource);
            client.ClientSecret = ClientSecret.Parse(options.Credentials.Secret);
            client.TokenEndpoint = new Uri(options.KeycloakTokenEndpoint);
        }
    );
builder.Services
    .AddKeycloakAdminHttpClient(builder.Configuration)
    .AddClientCredentialsTokenHandler(tokenClientName);
builder.Services.AddScoped<IKeycloakUserService, KeycloakUserService>();
builder.Services.AddKeycloakAdminHttpClient(builder.Configuration);
builder.Services.AddGrpc();

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

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IUserFollowService, UserFollowService>();

builder.Services.AddSingleton<RabbitMqConfig>(cfg =>
{
    var config = new RabbitMqConfig()
    {
        HostName = builder.Configuration.GetValue<string>("RabbitMQ:HostName"),
        Port = builder.Configuration.GetValue<int>("RabbitMQ:Port"),
        UserName = builder.Configuration.GetValue<string>("RabbitMQ:UserName"),
        Password = builder.Configuration.GetValue<string>("RabbitMQ:Password"),
        ExchangeName = builder.Configuration.GetValue<string>("RabbitMQ:ExchangeName")
    };
    return config;
});
builder.Services.AddScoped<IRabbitMqProducer, RabbitMqProducer>();

builder.Services.AddAutoMapper(typeof(ProfileMapper));

var app = builder.Build();

app.MapGrpcService<UserGrpcService>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");

app.MapGet("/", () => "This is gRPC UserService");

// Note: UseHttpsRedirection removed to allow gRPC over plain HTTP on port 7083

app.UseAuthorization();

app.MapControllers();

app.Run();
