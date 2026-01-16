using Duende.AccessTokenManagement;
using Keycloak.AuthServices.Common;
using Keycloak.AuthServices.Sdk;
using UserService.Commons;
using UserService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//DI
builder.Services.AddSingleton<KeycloakConfiguration>(sp =>
{
    var config = new KeycloakConfiguration
    {
        Realm = builder.Configuration.GetValue<string>("Keycloak:realm")
    };
    return config;
});

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
builder.Services.AddScoped<IKeycloakService, KeycloakService>();
builder.Services.AddKeycloakAdminHttpClient(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
