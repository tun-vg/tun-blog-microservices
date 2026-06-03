namespace Post.Contract.Repositories;

public interface IPostBookMarkRepository
{
    Task<bool> AddBookMarkPost(Guid postId, Guid userId);
    
    Task<bool> RemoveBookMarkPost(Guid postId, Guid userId);
    
    Task<bool> CheckUserBookMarkPost(Guid postId, Guid userId);
    
    Task<(List<Post.Domain.Entities.Post>, int)> GetBookMarkPostsByUserId(int page, int pageSize, Guid userId);
    
    Task DeleteBookMarkByPostId(Guid postId);
}