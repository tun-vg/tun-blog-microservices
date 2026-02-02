using Microsoft.EntityFrameworkCore;
using NotificationService.Entities;

namespace NotificationService.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly ApplicationDBContext _context;

    public NotificationRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<bool> DeleteNotificationByNotificationId(Guid notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            _context.Notifications.Remove(notification);
            var rowDeleted = await _context.SaveChangesAsync();
            return rowDeleted == 1;
        }
        else
            throw new Exception($"Couldn't found notification by id: {notificationId}");
    }

    public async Task<bool> DeleteNotificationsByUserId(Guid userId)
    {
        var notifications = _context.Notifications.Where(n => n.UserId == userId);
        _context.Notifications.RemoveRange(notifications);
        var rowDeleted = await _context.SaveChangesAsync();
        return rowDeleted > 0;
    }

    public async Task<(List<Notification>, int, int)> GetNotificationsByUserId(Guid userId, int page, int pageSize)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
        int totalCount = await _context.Notifications.CountAsync(n => n.UserId == userId);
        int countUnreadNotifications = await _context.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId && n.Status == false && n.Disable == false)
            .CountAsync();
        return (notifications, totalCount, countUnreadNotifications);
    }

    public async Task SaveNotificationAsync(Notification notification)
    {
        await _context.Notifications.AddAsync(notification);
        await _context.SaveChangesAsync();
    }
}
