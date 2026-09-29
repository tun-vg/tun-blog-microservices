using Keycloak.AuthServices.Sdk.Admin;
using Keycloak.AuthServices.Sdk.Admin.Models;
using Keycloak.AuthServices.Sdk.Admin.Requests.Users;
using Microsoft.Extensions.Options;
using Shared.BuildingBlocks.Exceptions;
using UserService.Commons;
using UserService.Dtos;
using UserService.Entities;
using UserService.Messages;
using UserService.RabbitMQ;

namespace UserService.Services;

public class KeycloakUserService : IKeycloakUserService
{
    private readonly IKeycloakClient _keycloakClient;
    private readonly KeycloakConfiguration _keycloakConfiguration;
    private readonly IUserProfileService _userProfileService;
    private readonly IUserFollowService _userFollowService;
    private readonly IRabbitMqProducer _rabbitMqProducer;

    public KeycloakUserService(
        IKeycloakClient keycloakClient, 
        IOptions<KeycloakConfiguration> keycloakConfiguration, 
        IUserProfileService userProfileService, 
        IUserFollowService userFollowService,
        IRabbitMqProducer rabbitMqProducer)
    {
        _keycloakClient = keycloakClient;
        _keycloakConfiguration = keycloakConfiguration.Value;
        _userProfileService = userProfileService;
        _userFollowService = userFollowService;
        _rabbitMqProducer = rabbitMqProducer;
    }

    public async Task<UserDto> GetUserByUserNameAsync(string username)
    {
        string realm = _keycloakConfiguration.Realm;
        GetUsersRequestParameters parameters = new()
        {
            Username = username
        };
        var users = await _keycloakClient.GetUsersAsync(realm, parameters);
        var user = users.FirstOrDefault();
        if (user == null) 
            throw new NotFoundException($"User {username} not found");
        
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

    public async Task<UserDto> GetUserByIdAsync(string userId)
    {
        string realm = _keycloakConfiguration.Realm;
        var user = await _keycloakClient.GetUserAsync(realm, userId);
        
        if (user == null) 
            throw new NotFoundException($"User not found with id: {userId}");
        
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

    public async Task<UserDto> UpdateUserAsync(UserDto userDto)
    {
        string realm = _keycloakConfiguration.Realm;
        var userRepresentation = UserMappingExtensions.ToUserRepresontation(userDto);
        var result = await _keycloakClient.UpdateUserWithResponseAsync(realm, userDto.UserId, userRepresentation);
        
        if (!result.IsSuccessStatusCode)
        {
            var errorContent = await result.Content.ReadAsStringAsync();
            throw new BadRequestException($"Failed to update user: {result.StatusCode} - {errorContent}");
        }
        
        var userProfileExtend = await _userProfileService.GetUserProfileExtend(userDto.UserId);
        if (userProfileExtend == null)
        {
            UserProfileExtend userProfile = new UserProfileExtend
            {
                UserId = userDto.UserId,
                FollowersCount = 0,
                FollowingCount = 0,
                AvatarUrl = string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            await _userProfileService.AddUserProfileExtend(userProfile);
        }
        
        userProfileExtend = await _userProfileService.UpdateUserProfileExtend(new UserProfileExtend()
        {
            UserId = userDto.UserId,
            AvatarUrl = userDto.AvatarUrl,
            UpdatedAt = DateTime.UtcNow
        });
        
        var userFollowsDtos = await _userFollowService.GetFollowersAsync(userDto.UserId);

        var updatedUserEvent = new UpdatedUserEvent()
        {
            UserId = userDto.UserId,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Email = userDto.Email,
            AvatarUrl = userDto.AvatarUrl
        };
        await _rabbitMqProducer.PublishAsync("updated_user", System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(updatedUserEvent));
        
        return UserMappingExtensions.ToUserDto(userRepresentation, userProfileExtend, userFollowsDtos);
    }

    public async Task CreateUserAsync(CreateUserRequest createUserRequest)
    {
        string realm = _keycloakConfiguration.Realm;
        var userRepresentation = new UserRepresentation()
        {
            Username = createUserRequest.UserName,
            FirstName = createUserRequest.FirstName,
            LastName = createUserRequest.LastName,
            Email = createUserRequest.Email,
            Enabled = true,
            Credentials = new List<CredentialRepresentation>()
            {
                new CredentialRepresentation()
                {
                    Type = "password",
                    Value = createUserRequest.Password,
                    Temporary = false
                }
            }
        };
        var result = await _keycloakClient.CreateUserWithResponseAsync(realm, userRepresentation);
        
        if (!result.IsSuccessStatusCode)
        {
            var errorContent = await result.Content.ReadAsStringAsync();
            throw new BadRequestException($"Failed to create user: {result.StatusCode} - {errorContent}");
        }
    }

    public async Task<List<UserDto>> GetFollowersAsync(string userId)
    {
        string realm = _keycloakConfiguration.Realm;
        var userFollowsDtos = await _userFollowService.GetFollowersAsync(userId);
        var searchQuery = "id:";
        searchQuery += string.Join(" ", userFollowsDtos.Select(u => u.FollowerId));
        var users = await _keycloakClient.GetUsersAsync(realm, new GetUsersRequestParameters()
        {
            Search = searchQuery
        });
        
        var userProfiles = await _userProfileService.GetUserProfilesByIdsAsync(userFollowsDtos.Select(u => u.FollowerId).ToList());
        var userDtos = UserMappingExtensions.ToUserDtos(users, userProfiles, null);
        return userDtos;
    }

    public async Task<List<UserDto>> GetFollowingAsync(string userId)
    {
        string realm = _keycloakConfiguration.Realm;
        var userFollowingDtos = await _userFollowService.GetFollowingsAsync(userId);
        var searchQuery = "id:";
        searchQuery += string.Join(" ", userFollowingDtos.Select(u => u.FollowingId));
        var users = await _keycloakClient.GetUsersAsync(realm, new GetUsersRequestParameters()
        {
            Search = searchQuery
        });
        
        var userProfiles = await _userProfileService.GetUserProfilesByIdsAsync(userFollowingDtos.Select(u => u.FollowingId).ToList());
        var userDtos = UserMappingExtensions.ToUserDtos(users, userProfiles, null);
        return userDtos;
    }
}
