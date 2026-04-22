using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Post.Domain.Entities;

namespace Post.Contract.Repositories;

public interface IPostRepository
{
    #region Queries Post

    Task<(List<Post.Domain.Entities.Post>, int)> GetPosts(int page, int pageSize, string? search, string? sortBy, bool isDescending);

    Task<Post.Domain.Entities.Post> GetPostById(Guid postId);
    
    Task<List<Post.Domain.Entities.Post>> GetTrendingPostsWithTime(int month, int year, int size);

    Task<(List<Post.Domain.Entities.Post>, int)> GetPostsByUserId(int page, int pageSize, string userId);

    Task<(List<Post.Domain.Entities.Post>, int)> SearchPost(string search, string type, int page, int pageSize);
    
    Task<List<Post.Domain.Entities.Post>> GetTrendingPosts(int size);
    
    Task<List<Post.Domain.Entities.Post>> GetTopPosts(int size);

    #endregion Queries Post
    
    #region Commands Post

    Task SavePost(Post.Domain.Entities.Post post);

    Task UpdatePost(Post.Domain.Entities.Post post);

    Task<bool> DeletePost(Guid postId);

    #endregion Commands Post
    
    #region Actions Post
    
    Task ViewPost(Guid postId);
    
    Task<(int, int)> UpVotePost(Guid postId, Guid userId, int action);
    
    Task<(int, int)> DownVotePost(Guid postId, Guid userId, int action);
    
    Task<bool> AddBookMarkPost(Guid postId, Guid userId);
    
    Task<bool> RemoveBookMarkPost(Guid postId, Guid userId);
    
    Task<bool> CheckUserBookMarkPost(Guid postId, Guid userId);
    
    Task<(List<Post.Domain.Entities.Post>, int)> GetBookMarkPostsByUserId(int page, int pageSize, Guid userId);
    
    #endregion Actions Post
}
