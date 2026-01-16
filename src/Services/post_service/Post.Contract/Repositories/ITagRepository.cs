using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Post.Domain.Entities;

namespace Post.Contract.Repositories;

public interface ITagRepository
{
    Task<(List<Tag>, int)> GetTags(int page, int pageSize, string? search, string? sortBy, bool isDescending);
    
    Task<Tag?> GetTagById(Guid tagId);

    Task SaveTag(Tag tag);
    
    Task SaveTags(List<Tag> tags);

    Task UpdateTag(Tag tag);

    Task DeleteTag(Guid tagId);

    Task<(List<Tag>, int)> GetTagsByCategoryId(Guid categoryId);
}
