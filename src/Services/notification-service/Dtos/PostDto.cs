namespace NotificationService.Dtos;

public class PostDto
{
    public Guid PostId { get; set; }

    public Guid AuthorId { get; set; }

    public string Slug { get; set; } = string.Empty;
}
