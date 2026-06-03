using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Persistence.Repositories;

public class PostTagRepository : IPostTagRepository
{
    private readonly ApplicationDBContext _context;

    public PostTagRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task SavePostTag(List<PostTag> postTags)
    {
        await _context.PostTags.AddRangeAsync(postTags);
        await _context.SaveChangesAsync();
    }

    public async Task<List<PostTag>> GetPostTagsByPostId(Guid postId)
    {
        var query = from pt in _context.PostTags
                     join t in _context.Tags on pt.TagId equals t.TagId
                     where pt.PostId == postId
                     select new PostTag
                     {
                         PostTagId = pt.PostTagId,
                         TagId = t.TagId,
                         TagName = t.Name
                     };
        return await query.ToListAsync();
    }

    public async Task DeletePostTagByPostId(Guid postId)
    {
        var postTags =  await _context.PostTags.Where(p => p.PostId == postId).ToListAsync();
        _context.PostTags.RemoveRange(postTags);
        await _context.SaveChangesAsync();
    }

    public async Task DeletePostTagByTagId(Guid tagId)
    {
        var postTags = await _context.PostTags.Where(p => p.TagId == tagId).ToListAsync();
        _context.PostTags.RemoveRange(postTags);
        await _context.SaveChangesAsync();
    }
}
