namespace comment_service.IntegrationEvents;

public class CommentCreatedEvent
{
    public Guid CommentId { get; set; }

    public Guid PostId { get; set; }

    public Guid UserId { get; set; }

    public Guid AuthorId { get; set; }

    public DateTime CreatedAt { get; set; }
}
