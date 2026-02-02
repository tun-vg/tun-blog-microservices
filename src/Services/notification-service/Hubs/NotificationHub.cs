using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Entities;

namespace NotificationService.Hubs;

public interface INotificationClient
{
    Task ReceiveNotification(Notification notification);
}

[Authorize]
public class NotificationHub : Hub<INotificationClient>
{
    
}