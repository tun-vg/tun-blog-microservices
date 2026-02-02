using NotificationService.Entities;

namespace NotificationService.Repositories;

public interface INotificationRepository
{

    Task SaveNotificationAsync(Notification notification);

    Task<bool> DeleteNotificationByNotificationId(Guid notificationId);

    Task<bool> DeleteNotificationsByUserId(Guid userId);

    Task<(List<Notification>, int, int)> GetNotificationsByUserId(Guid userId, int page, int pageSize);
}
