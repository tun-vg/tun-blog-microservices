using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using NotificationService.Services;

namespace NotificationService.Controllers;

[ApiController]
[Route("[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetNotifications(  [FromQuery] Guid userId,
                                                        [FromQuery] int pageNumber = 1,
                                                        [FromQuery] int pageSize = 10)
    {
        var notifications = await _notificationService.GetNotificationsAsync(userId, pageNumber, pageSize);
        return Ok(notifications);
    }
}