using UserService.Dtos;

namespace UserService.Services;

public interface IKeycloakUserService
{
    Task<UserDto> GetUserByUserNameAsync(string username);
    
    Task<UserDto> GetUserByIdAsync(string userId);
    
    Task<UserDto> UpdateUserAsync(UserDto user);
    
    Task CreateUserAsync(CreateUserRequest createUserRequest);
    
    Task<List<UserDto>> GetFollowersAsync(string userId);
    
    Task<List<UserDto>> GetFollowingAsync(string userId);
}
