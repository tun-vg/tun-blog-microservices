using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Post.Domain.Entities;

namespace Post.Contract.Repositories;

public interface IPostTagRepository
{
    Task SavePostTag(List<PostTag> postTags);

    Task<List<PostTag>> GetPostTagsByPostId(Guid postId);
}
