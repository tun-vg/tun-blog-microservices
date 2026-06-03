using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Persistence.Repositories;

public class PostBookMarkRepository : IPostBookMarkRepository
{
    private readonly ApplicationDBContext _context;
    
    public PostBookMarkRepository(ApplicationDBContext context)
    {
        _context = context;
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

    public async Task DeleteBookMarkByPostId(Guid postId)
    {
        var bookmarks = await _context.PostBookMarks
            .Where(b => b.PostId == postId)
            .ToListAsync();
        _context.PostBookMarks.RemoveRange(bookmarks);
        await _context.SaveChangesAsync();
    }
}