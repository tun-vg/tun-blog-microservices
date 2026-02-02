namespace comment_service.IntegrationEvents;

public class CommentLikedEvent
{
    public Guid CommentId { get; set; }
    
    public Guid PostId { get; set; }
    
    public Guid UserId { get; set; }
    
    public Guid AuthorId { get; set; }
}