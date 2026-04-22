using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Persistence.Repositories;

public class PostRepository : IPostRepository
{
    private readonly ApplicationDBContext _context;
    private readonly IPostVoteRepository _postVoteRepository;

    public PostRepository(ApplicationDBContext context, IPostVoteRepository postVoteRepository)
    {
        _context = context;
        _postVoteRepository = postVoteRepository;
    }

    #region Queries Post

    public async Task<(List<Post.Domain.Entities.Post>, int)> GetPosts(int page, int pageSize, string? search, string? sortBy, bool isDescending)
    {
        var query = _context.Posts
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Title.Contains(search));
        }

        int totalCount = await query.CountAsync();

        if (!string.IsNullOrEmpty(sortBy))
        {
            var propertyInfo = typeof(Post.Domain.Entities.Post).GetProperty(
                sortBy,
                System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance
            );
            if (propertyInfo != null)
            {
                query = isDescending
                    ? query.OrderByDescending(e => EF.Property<object>(e, sortBy))
                    : query.OrderBy(e => EF.Property<object>(e, sortBy));
            }
        }
        else
        {
            query = query.OrderBy(e => e.CreatedAt);
        }

        var result = await query
            .Include(c => c.Category)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Join(
                _context.PostAuthors,
                post => post.AuthorId,
                author => author.AuthorId,
                (post, author) => new Post.Domain.Entities.Post()
                {
                    PostId = post.PostId,
                    Title = post.Title,
                    Slug = post.Slug,
                    Content = post.Content,
                    AuthorId = post.AuthorId,
                    CategoryId = post.CategoryId,
                    Approved = post.Approved,
                    Point = post.Point,
                    UpPoint = post.UpPoint,
                    DownPoint = post.DownPoint,
                    ViewCount = post.ViewCount,
                    ReadingTime = post.ReadingTime,
                    Status = post.Status,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    CommentCount = post.CommentCount,
                    Author = author,
                    Category = post.Category
                }
            )
            .ToListAsync();
        return (result, totalCount);
    }

    public async Task<Post.Domain.Entities.Post> GetPostById(Guid id)
    {
        // var result = await _context.Posts.FindAsync(id);
        var result = await _context.Posts
            .AsNoTracking()
            .Where(p => p.PostId == id)
            .Select(p => new Post.Domain.Entities.Post
            {
                PostId = p.PostId,
                Title = p.Title,
                Slug = p.Slug,
                Content = p.Content,
                AuthorId = p.AuthorId,
                CategoryId = p.CategoryId,
                Category = p.Category,
                Approved = p.Approved,
                Point = p.Point,
                UpPoint = p.UpPoint,
                DownPoint = p.DownPoint,
                ViewCount = p.ViewCount,
                ReadingTime = p.ReadingTime,
                Status = p.Status
            })
            .FirstOrDefaultAsync();
        if (result != null)
        {
            return result;
        }
        else throw new Exception($"Couldn't found post by id: {id}");
    }

    public async Task<List<Post.Domain.Entities.Post>> GetTrendingPostsWithTime(int month, int year, int size)
    {
        var posts = await GetTrendingPosts(size);
        return posts;
    }

    public async Task<(List<Post.Domain.Entities.Post>, int)> GetPostsByUserId(int page, int pageSize, string userId)
    {
        var posts = await _context.Posts
            .Where(p => p.AuthorId.ToString() == userId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        var totalCount = await _context.Posts.CountAsync(p => p.AuthorId.ToString() == userId);
        return (posts, totalCount);
    }

    public async Task<(List<Post.Domain.Entities.Post>, int)> SearchPost(string search, string type, int page, int pageSize)
    {
        if (type == "post")
        {
            var posts = await _context.Posts
                .Where(p => p.Title.Contains(search))
                .AsNoTracking()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalCount = await _context.Posts.AsNoTracking().CountAsync(p => p.Title.Contains(search));
            return (posts, totalCount);
        } 
        else
        {
            var query = from p in _context.Posts
                    join pt in _context.PostTags on p.PostId equals pt.PostId
                    join t in _context.Tags on pt.TagId equals t.TagId
                    where t.Name.Contains(search)
                    select new Post.Domain.Entities.Post
                    {
                        PostId = p.PostId,
                        Title = p.Title,
                        Slug = p.Slug,
                        Content = p.Content,
                        AuthorId = p.AuthorId,
                        CategoryId = p.CategoryId,
                        Approved = p.Approved,
                        Point = p.Point,
                        UpPoint = p.UpPoint,
                        DownPoint = p.DownPoint,
                        ViewCount = p.ViewCount,
                        ReadingTime = p.ReadingTime,
                        Status = p.Status,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt
                    };

            var result = await query
                .AsNoTracking()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            int totalCount = await query.AsNoTracking().CountAsync();

            return (result, totalCount);
        }
    }

    public async Task<List<Post.Domain.Entities.Post>> GetTrendingPosts(int size)
    {
        int TARGET_COUNT = size;
        var oneWeekAgo = DateTime.UtcNow.AddDays(-7);

        var query = _context.Posts
            .AsNoTracking()
            .Include(c => c.Category)
            .Join(
                _context.PostAuthors,
                post => post.AuthorId,
                author => author.AuthorId,
                (post, author) => new Post.Domain.Entities.Post()
                {
                    PostId = post.PostId,
                    Title = post.Title,
                    Slug = post.Slug,
                    Content = post.Content,
                    AuthorId = post.AuthorId,
                    CategoryId = post.CategoryId,
                    Approved = post.Approved,
                    Point = post.Point,
                    UpPoint = post.UpPoint,
                    DownPoint = post.DownPoint,
                    ViewCount = post.ViewCount,
                    ReadingTime = post.ReadingTime,
                    Status = post.Status,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    CommentCount = post.CommentCount,
                    Author = author,
                    Category = post.Category
                }
            ).AsQueryable();
        
        var trendingPosts = await query
            .Where(p => p.CreatedAt >= oneWeekAgo)
            .OrderByDescending(p => (p.UpPoint - p.DownPoint) * 10 + p.ViewCount)
            .Take(TARGET_COUNT)
            .ToListAsync();

        if (trendingPosts.Count < TARGET_COUNT)
        {
            var missingCount = TARGET_COUNT - trendingPosts.Count;

            var olderPosts = await query
                .Where(p => p.CreatedAt < oneWeekAgo)
                .OrderByDescending(p => (p.UpPoint - p.DownPoint) * 10 + p.ViewCount)
                .Take(missingCount)
                .ToListAsync();
            
            trendingPosts.AddRange(olderPosts);
        }

        return trendingPosts;
    }

    public async Task<List<Post.Domain.Entities.Post>> GetTopPosts(int size)
    {
        var topPosts = await _context.Posts
            .AsNoTracking()
            .Include(c => c.Category)
            .Join(
                _context.PostAuthors,
                post => post.AuthorId,
                author => author.AuthorId,
                (post, author) => new Post.Domain.Entities.Post()
                {
                    PostId = post.PostId,
                    Title = post.Title,
                    Slug = post.Slug,
                    Content = post.Content,
                    AuthorId = post.AuthorId,
                    CategoryId = post.CategoryId,
                    Approved = post.Approved,
                    Point = post.Point,
                    UpPoint = post.UpPoint,
                    DownPoint = post.DownPoint,
                    ViewCount = post.ViewCount,
                    ReadingTime = post.ReadingTime,
                    Status = post.Status,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    CommentCount = post.CommentCount,
                    Author = author,
                    Category = post.Category
                }
            )
            .OrderByDescending(p => (p.UpPoint - p.DownPoint) * 10 + p.ViewCount)
            .Take(size)
            .ToListAsync();
        return topPosts;
    }
    
    #endregion Queries Post

    #region Commands Post

    public async Task<bool> DeletePost(Guid id)
    {
        var entity = await _context.Posts.FindAsync(id);
        if (entity != null)
        {
            _context.Posts.Remove(entity);
            return await _context.SaveChangesAsync() > 0 ? true : false;
        }
        else throw new Exception($"Coun't found post by id: {id}");
    }

    public async Task SavePost(Post.Domain.Entities.Post entity)
    {
        await _context.Posts.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePost(Post.Domain.Entities.Post post)
    {
        var entity = await _context.Posts.FindAsync(post.PostId);
        if (entity != null)
        {
            entity.Title = post.Title;
            entity.Slug = post.Slug;
            entity.Content = post.Content;
            entity.CategoryId = post.CategoryId;
            entity.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
        }
        else throw new Exception($"Coun't found post by id: {post.PostId}");
    }

    #endregion Commands Post

    #region Actions Post
    
    public async Task ViewPost(Guid postId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post != null)
        {
            post.ViewCount++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<(int, int)> UpVotePost(Guid postId, Guid userId, int action)
    {
        return await DoVotePost(postId, userId, action);
    }

    public async Task<(int, int)> DownVotePost(Guid postId, Guid userId, int action)
    {
        return await DoVotePost(postId, userId, action);
    }

    private async Task<(int, int)> DoVotePost(Guid postId, Guid userId, int action)
    {
        // 1 = up, 2 = down, 3 = un up, 4 = un down
        int point = 0;
        var post = await _context.Posts.FindAsync(postId);
        if (post != null)
        {
            
            if (action == 1)
            {
                var pv = await _postVoteRepository.GetPostVote(postId, userId, 0);
                if (pv != null)
                {
                    post.UpPoint++;
                    post.DownPoint--;
                    pv.TypeVote = 1;
                }
                else
                {
                    post.UpPoint++;
                    var postVote = new PostVote()
                    {
                        PostVoteId = new Guid(),
                        PostId = postId,
                        UserId = userId,
                        TypeVote = 1,
                        CreatedAt = DateTime.Now
                    };
                    await _context.PostVotes.AddAsync(postVote);
                }
            }

            if (action == 2)
            {
                var pv = await _postVoteRepository.GetPostVote(postId, userId, 1);
                if (pv != null)
                {
                    post.UpPoint--;
                    post.DownPoint++;
                    pv.TypeVote = 0;
                }
                else
                {
                    post.DownPoint++;
                    var postVote = new PostVote()
                    {
                        PostVoteId = new Guid(),
                        PostId = postId,
                        UserId = userId,
                        TypeVote = 0,
                        CreatedAt = DateTime.Now
                    };
                    await _context.PostVotes.AddAsync(postVote);
                }
            }

            if (action == 3)
            {
                post.UpPoint--;
                var postVost = await _postVoteRepository.GetPostVote(postId, userId, 1);
                if (postVost != null) _context.PostVotes.Remove(postVost);
            }

            if (action == 4)
            {
                post.DownPoint--;
                var postVost = await _postVoteRepository.GetPostVote(postId, userId, 0);
                if (postVost != null) _context.PostVotes.Remove(postVost);
            }

            post.Point = post.UpPoint - post.DownPoint;
            await _context.SaveChangesAsync();
            point = post.Point;
        }
        else throw new Exception("Post not found");
        
        return (point, action);
    }

    public async Task<bool> AddBookMarkPost(Guid postId, Guid userId)
    {
        var postBookMark = await _context.PostBookMarks
            .AsNoTracking()
            .Where(b => b.PostId == postId && b.UserId == userId)
            .FirstOrDefaultAsync();

        if (postBookMark == null)
        {
            var bookMark = new PostBookMark()
            {
                PostBookMarkId = Guid.NewGuid(),
                PostId = postId,
                UserId = userId,
                CreatedAt = DateTime.Now
            };
            await _context.PostBookMarks.AddAsync(bookMark);
            return await _context.SaveChangesAsync() > 0;
        }
        else return false;
    }

    public async Task<bool> RemoveBookMarkPost(Guid postId, Guid userId)
    {
        var postBookMark = await _context.PostBookMarks
            .Where(b => b.PostId == postId && b.UserId == userId)
            .FirstOrDefaultAsync();
        if (postBookMark != null)
        {
            _context.PostBookMarks.Remove(postBookMark);
            return await _context.SaveChangesAsync() > 0;
        }
        else return false;
    }

    public async Task<bool> CheckUserBookMarkPost(Guid postId, Guid userId)
    {
        var postBookMarks = await _context.PostBookMarks
            .AsNoTracking()
            .Where(b => b.PostId == postId && b.UserId == userId)
            .FirstOrDefaultAsync();
        return postBookMarks != null;
    }

    public async Task<(List<Post.Domain.Entities.Post>, int)> GetBookMarkPostsByUserId(int page, int pageSize,
        Guid userId)
    {
        var queryable = from pbm in _context.PostBookMarks
            join p in _context.Posts on pbm.PostId equals p.PostId
            where pbm.UserId == userId
            orderby pbm.CreatedAt descending
            select new Post.Domain.Entities.Post()
            {
                PostId = p.PostId,
                Title = p.Title,
                Slug = p.Slug,
                Content = p.Content,
                AuthorId = p.AuthorId,
                CategoryId = p.CategoryId,
                Category = p.Category,
                Approved = p.Approved,
                Point = p.Point,
                UpPoint = p.UpPoint,
                DownPoint = p.DownPoint,
                ViewCount = p.ViewCount,
                ReadingTime = p.ReadingTime,
                Status = p.Status
            };

        var posts = await queryable
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        int totalCount = await queryable.AsNoTracking().CountAsync();
        
        return (posts, totalCount);
    }
    
    #endregion Actions Post
    
}
