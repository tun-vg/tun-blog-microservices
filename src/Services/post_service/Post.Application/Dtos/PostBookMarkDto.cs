namespace Post.Application.Dtos;

public class PostBookMarkDto
{
    public Guid PostId { get; set; } = Guid.Empty;
    
    public Guid UserId { get; set; } = Guid.Empty;
    
    public DateTime CreateAt { get; set; } = DateTime.UtcNow;
}