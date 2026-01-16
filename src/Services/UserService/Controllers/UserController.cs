using Microsoft.AspNetCore.Mvc;
using UserService.Services;

namespace UserService.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IKeycloakService _keycloakService;

    public UserController(IKeycloakService keycloakService)
    {
        _keycloakService = keycloakService;
    }

    [HttpGet("get-user")]
    public async Task<IActionResult> GetUser([FromQuery] string username)
    {
        var user = await _keycloakService.GetUserAsync<object>(username);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
}
