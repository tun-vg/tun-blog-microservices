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
        try
        {
            var userDto = await _keycloakUserService.GetUserByUserNameAsync(username);

            return Ok(userDto);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById([FromRoute] string userId)
    {
        try
        {
            var userDto = await _keycloakUserService.GetUserByIdAsync(userId);
            
            return Ok(userDto);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpPut("update-user")]
    public async Task<IActionResult> UpdateUser([FromBody] UserDto userDto)
    {
        try
        {
            var result = await _keycloakUserService.UpdateUserAsync(userDto);
            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
