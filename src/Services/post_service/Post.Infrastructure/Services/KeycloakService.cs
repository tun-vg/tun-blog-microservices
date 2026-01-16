using Keycloak.AuthServices.Sdk.Admin;
using Keycloak.AuthServices.Sdk.Admin.Models;
using Keycloak.AuthServices.Sdk.Admin.Requests.Users;
using Microsoft.Extensions.Configuration;
using Post.Contract.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Infrastructure.Services;

public class KeycloakService : IKeycloakService
{
    private readonly IKeycloakClient _keycloakClient;
    private readonly IConfiguration _configuration;

    public KeycloakService(IKeycloakClient keycloakClient, IConfiguration configuration)
    {
        _keycloakClient = keycloakClient;
        _configuration = configuration;
    }

    public async Task<T> GetUserByUsername<T>(string username)
    {
        string realm = _configuration["Keycloak:realm"];
        GetUsersRequestParameters getUsersRequestParameters = new GetUsersRequestParameters
        {
            Username = username
        };
        var users = await _keycloakClient.GetUsersAsync(realm, getUsersRequestParameters);
        var user = users.FirstOrDefault();
        
        return (T)(object)user;
    }
}
