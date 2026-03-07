using NotificationService.Dtos;

namespace NotificationService.Messages;

public class EmailMessage
{
    public string? ToEmail {get; set;}
    
    public string? FromEmail {get; set;}
    
    public IEnumerable<PostDto>? Posts {get; set;}
}

public class PostInfo
{
    public string? PostId {get; set;}
    
    public string? Title {get; set;}
    
    public string? Slug {get; set;}
    
    public string? ImageUrl {get; set;}
}