
using NotificationService.Commons;
using NotificationService.Constants;
using NotificationService.Dtos;
using NotificationService.Entities;
using NotificationService.Messages;
using NotificationService.Repositories;

namespace NotificationService.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IPostService _postService;

    public NotificationService(INotificationRepository notificationRepository, IPostService postService)
    {
        _notificationRepository = notificationRepository;
        _postService = postService;
    }

    public async Task SendNotificationAsync(CommentCreatedEvent commentCreatedEvent)
    {
        // Implementation for sending notification
        //var properties = commentCreatedEvent.GetType().GetProperties();
        //foreach (var e in properties)
        //{
        //    var propName = e.Name;
        //    var propValue = e.GetValue(commentCreatedEvent);
        //    System.Diagnostics.Debug.WriteLine($"{propName}: {propValue}");
        //}

        //System.Diagnostics.Debug.WriteLine("");

        // step 1: call user service to get user info by gRPC
        // step 2: call post service to get post info by gRPC
        // step 3: create object Notification
        // step 4: save to database
        // step 5: push to websocket



        var post = await _postService.GetPostAsync(commentCreatedEvent.PostId);

        var notification = new Notification
        {
            UserId = post.AuthorId,
            ContentVi = NotificationMessages.CommentCreated_Vi,
            ContentEn = NotificationMessages.CommentCreated_En,
            CreatedAt = DateTime.UtcNow,
            Link = $"/bai-dang/{post.PostId}/{post.Slug}"
        };

        await _notificationRepository.SaveNotificationAsync(notification);
    }

    public async Task<PagedResult<Notification>> GetNotificationsAsync(Guid userId, int pageNumber, int pageSize)
    {
        var (notifications, totalCount) = await _notificationRepository.GetNotificationsByUserId(userId, pageNumber, pageSize);
    
        return PagedResult<Notification>.Create(pageNumber, pageSize, totalCount, notifications);
    }
}
