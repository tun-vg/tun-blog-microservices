using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Repositories;

public interface IPostRepository
{

    Task<(List<Post.Domain.Entities.Post>, int)> GetPostByPage(int page, int pageSize, string? search, string? sortBy, bool isDescending);

    Task<Post.Domain.Entities.Post> GetPostById(Guid postId);

    Task SavePost(Post.Domain.Entities.Post post);

    Task UpdatePost(Post.Domain.Entities.Post post);

    Task<bool> DeletePost(Guid postId);

    Task<List<Post.Domain.Entities.Post>> GetPostsTrending(int month, int year, int size);

    Task<(List<Post.Domain.Entities.Post>, int)> GetPostsByUserId(int page, int pageSize, string userId);

    Task<(List<Post.Domain.Entities.Post>, int)> SearchPost(string search, string type, int page, int pageSize);
}
