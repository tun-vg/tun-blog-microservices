using NotificationService.Commons;
using NotificationService.Dtos;
using NotificationService.Entities;
using NotificationService.Messages;

namespace NotificationService.Services;

public interface INotificationService
{
    Task SendNotificationAsync(CommentCreatedEvent commentCreatedEvent);

    Task SendNotificationAsync(CommentLikedEvent commentCreatedEvent);

    Task<PagedResult<Notification>> GetNotificationsAsync(Guid userId, int pageNumber, int pageSize);
}
