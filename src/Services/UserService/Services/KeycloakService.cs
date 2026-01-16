using Keycloak.AuthServices.Sdk.Admin;
using Keycloak.AuthServices.Sdk.Admin.Requests.Users;
using UserService.Commons;

namespace UserService.Services;

public class KeycloakService : IKeycloakService
{
    private readonly IKeycloakClient _keycloakClient;
    private readonly KeycloakConfiguration _keycloakConfiguration;

    public KeycloakService(IKeycloakClient keycloakClient, KeycloakConfiguration keycloakConfiguration)
    {
        _keycloakClient = keycloakClient;
        _keycloakConfiguration = keycloakConfiguration;
    }

    public async Task<T> GetUserAsync<T>(string username)
    {
        string realm = _keycloakConfiguration.Realm;
        GetUsersRequestParameters parameters = new()
        {
            Username = username
        };
        var users = await _keycloakClient.GetUsersAsync(realm, parameters);
        var user = users.FirstOrDefault();

        return (T)(object)user;
    }
}
