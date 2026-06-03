using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using UserService.Dtos;
using UserService.Services;

namespace UserService.Controllers;

[ApiController]
[Route("user-follow")]
public class UserFollowController : ControllerBase
{
    private readonly IUserFollowService _userFollowService;
    private readonly IKeycloakUserService _keycloakUserService;

    public UserFollowController(IUserFollowService userFollowService, IKeycloakUserService keycloakUserService)
    {
        _userFollowService = userFollowService;
        _keycloakUserService = keycloakUserService;
    }
    
    [HttpPost("follow")]
    public async Task<IActionResult> FollowUser(UserFollowDto userFollowDto)
    {
        await _userFollowService.FollowUserAsync(userFollowDto);
        return Ok();
    }

    [HttpPost("unfollow")]
    public async Task<IActionResult> UnfollowUser(UserFollowDto userFollowDto)
    {
        await _userFollowService.UnfollowUserAsync(userFollowDto);
        return Ok();
    }
    
    

    [HttpGet("get-followers/{userId}")]
    public async Task<IActionResult> GetFollowers([FromRoute] string userId)
    {
        try
        {
            var followers = await _keycloakUserService.GetFollowersAsync(userId);
            return Ok(followers);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }

    [HttpGet("get-followings/{userId}")]
    public async Task<IActionResult> GetFollowings([FromRoute] string userId)
    {
        try
        {
            var followings = await _keycloakUserService.GetFollowingAsync(userId);
            return Ok(followings);
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}