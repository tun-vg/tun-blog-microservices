using Grpc.Core;
using Keycloak.AuthServices.Sdk.Admin;
using Keycloak.AuthServices.Sdk.Admin.Requests.Users;
using Microsoft.Extensions.Options;
using UserService.Commons;
using UserService.Protos;

namespace UserService.Services;

public class UserGrpcService : Protos.UserService.UserServiceBase
{
    private readonly IKeycloakClient _keycloakClient;
    private readonly KeycloakConfiguration _keycloakConfiguration;

    public UserGrpcService(IKeycloakClient keycloakClient, IOptions<KeycloakConfiguration> keycloakConfiguration)
    {
        _keycloakClient = keycloakClient;
        _keycloakConfiguration = keycloakConfiguration.Value;
    }
    
    public override async Task<SearchUsersResponse> SearchUsers(SearchUsersRequest request, ServerCallContext context)
    {
        string realm = _keycloakConfiguration.Realm;
        GetUsersRequestParameters requestParameters = new GetUsersRequestParameters
        {
            Search = request.Name
        };
        var users = await _keycloakClient.GetUsersAsync(realm, requestParameters);

        SearchUsersResponse usersResponse = new SearchUsersResponse();
        usersResponse.Users.AddRange(users.Select(u => new User
        {
            UserId = u.Id,
            UserName = u.Username,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Avatar = string.Empty
        }));
        
        return usersResponse;
    }

    public override async Task<GetUserResponse> GetUser(GetUserRequest request, ServerCallContext context)
    {
        string realm = _keycloakConfiguration.Realm;
        var userRepresentation = await _keycloakClient.GetUserAsync(realm, request.UserId);
        if (userRepresentation.Id != null)
        {
            GetUserResponse userResponse = new GetUserResponse
            {
                UserId = userRepresentation.Id,
                UserName = userRepresentation.Username,
                FirstName = userRepresentation.FirstName,
                LastName = userRepresentation.LastName
            };
            return userResponse;
        } 
        else return new GetUserResponse();
    }
}