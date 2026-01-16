using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Persistence.Repositories;

public class TagRepository : ITagRepository
{
    private readonly ApplicationDBContext _context;

    public  TagRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<(List<Tag>, int)> GetTags(int page, int pageSize, string? search, string? sortBy, bool isDescending)
    {
        var query = _context.Tags
            .Include(t => t.Category)
            .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query.Where(e => e.Name.Contains(search));
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrEmpty(sortBy))
        {
            var propertyInfo = typeof(Tag).GetProperty(sortBy);
            if (propertyInfo != null)
            {
                query = isDescending
                    ? query.OrderByDescending(e => EF.Property<object>(e, sortBy))
                    : query.OrderBy(e => EF.Property<object>(e, sortBy));
            }
        }
        else
        {
            query = query.OrderBy(e => e.TagId);
        }

        var data = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new Tag 
            {
                TagId = t.TagId,
                Name = t.Name,
                Slug = t.Slug,
                CategoryId = t.CategoryId,
                CategoryName = t.Category.Name
            })
            .ToListAsync();

        return (data, totalCount);
    }

    public async Task<Tag?> GetTagById(Guid tagId)
    {
        return await _context.Tags.Where(t => t.TagId == tagId).FirstOrDefaultAsync();
    }

    public async Task SaveTag(Tag tag)
    {
        await _context.Tags.AddAsync(tag);
        await _context.SaveChangesAsync();
    }

    public async Task SaveTags(List<Tag> tags)
    {
        await _context.Tags.AddRangeAsync(tags);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateTag(Tag tag)
    {
        _context.Tags.Update(tag);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTag(Guid tagId)
    {
        var tag = await _context.Tags.FindAsync(tagId);
        if (tag != null)
        {
            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<(List<Tag>, int)> GetTagsByCategoryId(Guid categoryId)
    {
        var tags = await _context.Tags.Where(x => x.CategoryId == categoryId).ToListAsync();
        return (tags, tags.Count);
    }
}
