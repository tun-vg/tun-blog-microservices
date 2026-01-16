using comment_service.Common.Attributes;
using comment_service.Common.Interfaces;
using comment_service.Entities;

namespace comment_service.Application.Queries;

[Cached("comments-replies:comment={CommentId}", 600)]
public class GetCommentRepliesByCommentIdQuery : IQuery<IEnumerable<Comment>>
{
    public Guid CommentId { get; set; }

    public GetCommentRepliesByCommentIdQuery(Guid commentId)
    {
        CommentId = commentId;
    }
}
