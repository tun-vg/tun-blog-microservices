using Microsoft.AspNetCore.Mvc;
using NotificationService.Services;

namespace NotificationService.Controllers;

[ApiController]
[Route("[controller]")]
public class SubscriptionController : ControllerBase
{
    private readonly IUserSubscriptionService _userSubscriptionService;
    
    public SubscriptionController(IUserSubscriptionService userSubscriptionService)
    {
        _userSubscriptionService = userSubscriptionService;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe(string email)
    {
        var isSubscribed = await _userSubscriptionService.IsSubscribed(email);
        if (!isSubscribed)
        {
            await _userSubscriptionService.Subscribe(email);
            return Ok();
        }
        else
        {
            var result = new
            {
                StatusCode = StatusCodes.Status409Conflict,
                Message = "You are exits Subscribed"
            };
            return Conflict(result);
        }
    }

    [HttpPost("unsubscribe")]
    public async Task<IActionResult> Unsubscribe(string email)
    {
        await  _userSubscriptionService.Unsubscribe(email);
        return Ok();
    }
}