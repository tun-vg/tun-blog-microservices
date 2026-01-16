using Duende.AccessTokenManagement;
using Keycloak.AuthServices.Common;
using Keycloak.AuthServices.Sdk;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Post.Contract.Provider;
using Post.Contract.Services;
using Post.Infrastructure.Grpc;

//using Post.Infrastructure.Provider;
using Post.Infrastructure.Services;
using StackExchange.Redis;

namespace Post.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IConnectionMultiplexer>(sp =>
            ConnectionMultiplexer.Connect(configuration.GetConnectionString("Redis")));

        services.AddScoped<ICacheService, RedisCacheService>();
        //services.AddSingleton<IJsonSerializerOptionsProvider, JsonSerializerOptionsProvider>();
        services.AddSingleton<ICacheVersionManager, RedisCacheVersionManager>();
        services.AddScoped<IFileGrpcClient, FileGrpcClient>();

        // Keycloak Admin Client Configuration
        var options = configuration.GetKeycloakOptions<KeycloakAdminClientOptions>()!;
        var tokenClientName = ClientCredentialsClientName.Parse("post-service-client");
        services.AddDistributedMemoryCache();
        services
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
        services
            .AddKeycloakAdminHttpClient(configuration)
            .AddClientCredentialsTokenHandler(tokenClientName);
        services.AddScoped<IKeycloakService, KeycloakService>();
        services.AddKeycloakAdminHttpClient(configuration);

        return services;
    }
}
