using Microsoft.AspNetCore.Mvc;
using UserService.Dtos;
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
        var userDto = await _keycloakUserService.GetUserByUserNameAsync(username);
        return Ok(userDto);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById([FromRoute] string userId)
    {
        var userDto = await _keycloakUserService.GetUserByIdAsync(userId);
        return Ok(userDto);
    }

    [HttpPut("update-user")]
    public async Task<IActionResult> UpdateUser([FromBody] UserDto userDto)
    {
        var result = await _keycloakUserService.UpdateUserAsync(userDto);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] CreateUserRequest createUserRequest)
    {
        await _keycloakUserService.CreateUserAsync(createUserRequest);
        return Ok();
    }
}
