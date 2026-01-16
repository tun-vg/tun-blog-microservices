using NotificationService.Dtos;

namespace NotificationService.Services;

public interface IPostService
{
    Task<PostDto> GetPostAsync(Guid postId);
}
