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

    public PostRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<(List<Post.Domain.Entities.Post>, int)> GetPostByPage(int page, int pageSize, string? search, string? sortBy, bool isDescending)
    {
        var query = _context.Posts.AsQueryable();

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
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new Post.Domain.Entities.Post
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
            })
            .ToListAsync();
        return (result, totalCount);
    }

    public async Task<Post.Domain.Entities.Post> GetPostById(Guid id)
    {
        var result = await _context.Posts.FindAsync(id);
        if (result != null)
        {
            return result;
        }
        else throw new Exception($"Coun't found post by id: {id}");
    }

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

    public async Task<List<Post.Domain.Entities.Post>> SearchPost(string searchText)
    {
        var posts = await _context.Posts
        .Where(p => p.Title.Contains(searchText))
        .Select(p => new Post.Domain.Entities.Post
        {
            PostId = p.PostId,
            Title = p.Title,
            Slug = p.Slug,
            Content = p.Content,
            AuthorId = p.AuthorId,
            CategoryId = p.CategoryId
        })
        .ToListAsync();

        var postIds = posts.Select(p => p.PostId).ToList();

        var postTags = await (from pt in _context.PostTags
                              join t in _context.Tags on pt.TagId equals t.TagId
                              where postIds.Contains(pt.PostId)
                              select new PostTag
                              {
                                  PostTagId = pt.PostTagId,
                                  PostId = pt.PostId,
                                  TagId = t.TagId,
                                  TagName = t.Name
                              }).ToListAsync();

        foreach (var post in posts)
        {
            post.PostTags = postTags.Where(pt => pt.PostId == post.PostId).ToList();
        }

        return posts;
    }

    public async Task<List<Post.Domain.Entities.Post>> GetPostsTrending(int month, int year, int size)
    {
        var posts = await _context.Posts.Take(size).ToListAsync();
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
}
