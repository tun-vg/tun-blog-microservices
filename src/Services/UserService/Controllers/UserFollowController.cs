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

    public UserFollowController(IUserFollowService userFollowService)
    {
        _userFollowService = userFollowService;
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
}