using Microsoft.AspNetCore.Mvc;
using UserService.Services;

namespace UserService.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IKeycloakUserService _keycloakUserService;

    public UserController(IKeycloakUserService keycloakUserService)
    {
        _keycloakUserService = keycloakUserService;
    }

    [HttpGet("get-user")]
    public async Task<IActionResult> GetUser([FromQuery] string username)
    {
        try
        {
            var userDto = await _keycloakUserService.GetUserAsync(username);

            return Ok(userDto);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}
