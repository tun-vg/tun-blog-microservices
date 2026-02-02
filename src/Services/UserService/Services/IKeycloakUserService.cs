using UserService.Dtos;

namespace UserService.Services;

public interface IKeycloakUserService
{
    Task<UserDto> GetUserAsync(string username);

}
