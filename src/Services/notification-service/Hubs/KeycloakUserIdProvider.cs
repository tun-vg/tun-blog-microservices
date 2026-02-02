using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace NotificationService.Hubs;

public class KeycloakUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext context)
    {
        return context.User.FindFirst("sub")?.Value
            ?? context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}