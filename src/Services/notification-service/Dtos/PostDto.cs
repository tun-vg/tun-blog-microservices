namespace NotificationService.Dtos;

public class PostDto
{
    public Guid PostId { get; set; } = Guid.Empty;

    public Guid AuthorId { get; set; } = Guid.Empty;
    
    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;
}
