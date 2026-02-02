namespace NotificationService.Messages;

public class CommentLikedEvent
{
    public Guid CommentId { get; set; }
    
    public Guid PostId { get; set; }
    
    public string UserId { get; set; }
    
    public string AuthorId { get; set; }
}