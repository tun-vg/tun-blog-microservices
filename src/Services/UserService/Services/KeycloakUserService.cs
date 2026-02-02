using Keycloak.AuthServices.Sdk.Admin;
using Keycloak.AuthServices.Sdk.Admin.Requests.Users;
using Microsoft.Extensions.Options;
using UserService.Commons;
using UserService.Dtos;
using UserService.Entities;

namespace UserService.Services;

public class KeycloakUserService : IKeycloakUserService
{
    private readonly IKeycloakClient _keycloakClient;
    private readonly KeycloakConfiguration _keycloakConfiguration;
    private readonly IUserProfileService _userProfileService;
    private readonly IUserFollowService _userFollowService;

    public KeycloakUserService(
        IKeycloakClient keycloakClient, 
        IOptions<KeycloakConfiguration> keycloakConfiguration, 
        IUserProfileService userProfileService, 
        IUserFollowService userFollowService)
    {
        _keycloakClient = keycloakClient;
        _keycloakConfiguration = keycloakConfiguration.Value;
        _userProfileService = userProfileService;
        _userFollowService = userFollowService;
    }

    public async Task<UserDto> GetUserAsync(string username)
    {
        string realm = _keycloakConfiguration.Realm;
        GetUsersRequestParameters parameters = new()
        {
            Username = username
        };
        var users = await _keycloakClient.GetUsersAsync(realm, parameters);
        var user = users.FirstOrDefault();
        if (user == null) 
            throw new Exception($"User {username} not found");
        
        var userProfileExtend = await _userProfileService.GetUserProfileExtend(user.Id);

        if (userProfileExtend == null)
        {
            UserProfileExtend userProfile = new UserProfileExtend
            {
                UserId = user.Id,
                FollowersCount = 0,
                FollowingCount = 0,
                AvatarUrl = string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            userProfileExtend = await _userProfileService.AddUserProfileExtend(userProfile);
        }
        
        var userFollowsDtos = await _userFollowService.GetFollowersAsync(user.Id);

        var userDto = UserMappingExtensions.ToUserDto(user, userProfileExtend, userFollowsDtos);

        return userDto;
    }
}
