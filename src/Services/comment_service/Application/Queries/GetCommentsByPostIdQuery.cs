using comment_service.Common.Attributes;
using comment_service.Common.Interfaces;
using comment_service.Entities;

namespace comment_service.Application.Queries;

[Cached("comments:post={PostId}", 600)]
public class GetCommentsByPostIdQuery : IQuery<List<Comment>>
{
    public Guid PostId { get; set; }

    public bool Hot { get; set; }
    
    public GetCommentsByPostIdQuery(Guid postId, bool hot)
    {
        PostId = postId;
        Hot = hot;
    }
}