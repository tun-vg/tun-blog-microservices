using comment_service.Common.Interfaces;
using comment_service.Entities;
using Microsoft.EntityFrameworkCore;

namespace comment_service.Application.Queries;

public class GetCommentRepliesByCommentIdQueryHandler : IQueryHandler<GetCommentRepliesByCommentIdQuery, IEnumerable<Comment>>
{
    private readonly ApplicationDBContext _context;
    
    public GetCommentRepliesByCommentIdQueryHandler(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Comment>> Handle(GetCommentRepliesByCommentIdQuery query, CancellationToken cancellationToken)
    {
        var commentReplies = _context.Comments.Where(c => c.UpperCommentId == query.CommentId).OrderByDescending(c => c.CreatedAt).ToListAsync();
        return await commentReplies;
    }
}
