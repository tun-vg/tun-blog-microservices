
using Microsoft.AspNetCore.SignalR;
using NotificationService.Commons;
using NotificationService.Constants;
using NotificationService.Dtos;
using NotificationService.Entities;
using NotificationService.Hubs;
using NotificationService.Messages;
using NotificationService.Repositories;

namespace NotificationService.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IPostService _postService;
    private readonly IUserService _userService;
    private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;

    public NotificationService(
        INotificationRepository notificationRepository, 
        IPostService postService,
        IUserService userService,
        IHubContext<NotificationHub, INotificationClient> hubContext
        )
    {
        _notificationRepository = notificationRepository;
        _postService = postService;
        _userService = userService;
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(CommentCreatedEvent commentCreatedEvent)
    {
        // Implementation for sending notification

        // step 1: call user service to get user info by gRPC
        // step 2: call post service to get post info by gRPC
        // step 3: create object Notification
        // step 4: save to database
        // step 5: push to signalr
        
        var post = await _postService.GetPostAsync(commentCreatedEvent.PostId);
        var userCommented = await _userService.GetUserAsync(commentCreatedEvent.AuthorId);

        var notification = new Notification
        {
            UserId = post.AuthorId,
            ContentVi = string.Format(NotificationMessages.CommentCreatedVi, $"{userCommented.FirstName} {userCommented.LastName}"),
            ContentEn = string.Format(NotificationMessages.CommentCreatedEn, $"{userCommented.FirstName} {userCommented.LastName}"),
            CreatedAt = DateTime.UtcNow,
            Link = $"/post/{post.PostId}/{post.Slug}"
        };

        await _notificationRepository.SaveNotificationAsync(notification);
        await _hubContext.Clients.User(post.AuthorId.ToString()).ReceiveNotification(notification);
    }

    public async Task SendNotificationAsync(CommentLikedEvent commentCreatedEvent)
    {
        var post = await _postService.GetPostAsync(commentCreatedEvent.PostId);
        var userLiked = await _userService.GetUserAsync(commentCreatedEvent.UserId.ToString());

        var notification = new Notification
        {
            UserId = post.AuthorId,
            ContentVi = string.Format(NotificationMessages.CommentLikedVi, $"{userLiked.FirstName} {userLiked.LastName}"),
            ContentEn = string.Format(NotificationMessages.CommentLikedEn, $"{userLiked.FirstName} {userLiked.LastName}"),
            CreatedAt = DateTime.UtcNow,
            Link = $"/post/{post.PostId}/{post.Slug}"
        };

        await _notificationRepository.SaveNotificationAsync(notification);
        await _hubContext.Clients.User(post.AuthorId.ToString()).ReceiveNotification(notification);
    }

    public async Task<PagedResult<Notification>> GetNotificationsAsync(Guid userId, int pageNumber, int pageSize)
    {
        var (notifications, totalCount, countUnreadNotify) = await _notificationRepository.GetNotificationsByUserId(userId, pageNumber, pageSize);
    
        return PagedResult<Notification>.Create(pageNumber, pageSize, totalCount, notifications, countUnreadNotify);
    }
}
