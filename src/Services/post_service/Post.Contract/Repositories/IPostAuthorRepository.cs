using Post.Domain.Entities;

namespace Post.Contract.Repositories;

public interface IPostAuthorRepository
{
    Task<PostAuthor> GetPostAuthorByUserId(string userId);
    
    Task CreatePostAuthor(PostAuthor postAuthor);
    
    Task UpdatePostAuthor(PostAuthor postAuthor);
}