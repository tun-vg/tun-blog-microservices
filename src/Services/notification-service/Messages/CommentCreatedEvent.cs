namespace NotificationService.Messages;

public class CommentCreatedEvent
{
    public Guid CommentId { get; set; } = Guid.Empty;

    public Guid PostId { get; set; } = Guid.Empty;

    public string UserId { get; set; } = string.Empty;

    public string AuthorId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
