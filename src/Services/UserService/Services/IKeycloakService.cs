namespace UserService.Services;

public interface IKeycloakService
{
    Task<T> GetUserAsync<T>(string username);

}
