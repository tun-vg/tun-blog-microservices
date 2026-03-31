using UserService.Dtos;

namespace UserService.Services;

public interface IKeycloakUserService
{
    Task<UserDto> GetUserByUserNameAsync(string username);
    
    Task<UserDto> GetUserByIdAsync(string userId);
}
