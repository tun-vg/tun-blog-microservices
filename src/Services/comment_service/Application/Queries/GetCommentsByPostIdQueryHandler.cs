using comment_service.Common.Interfaces;
using comment_service.Entities;
using Microsoft.EntityFrameworkCore;

namespace comment_service.Application.Queries;

public class GetCommentsByPostIdQueryHandler : IQueryHandler<GetCommentsByPostIdQuery, List<Comment>>
{
    private readonly ApplicationDBContext _context;
    
    public GetCommentsByPostIdQueryHandler(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<List<Comment>> Handle(GetCommentsByPostIdQuery query, CancellationToken cancellationToken)
    {
        var commentQuery = _context.Comments.Where(c => c.PostId == query.PostId && c.UpperCommentId == null).AsQueryable();
        if (query.Hot)
        {
            commentQuery = commentQuery.OrderByDescending(c => c.LikedCount).ThenByDescending(c => c.CreatedAt);
        } else commentQuery = commentQuery.OrderByDescending(c => c.CreatedAt);

        var comments = await commentQuery.ToListAsync(cancellationToken);

        foreach (var c in comments)
        {
            var commentReaction = await _context.CommentReactions.Where(e => e.CommentId == c.CommentId).ToListAsync();
            c.CommentReactions = commentReaction;
        }
        return comments;
    }
}