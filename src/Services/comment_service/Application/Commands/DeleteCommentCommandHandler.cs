using comment_service.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace comment_service.Application.Commands;

public class DeleteCommentCommandHandler : ICommandHandler<DeleteCommentCommand, bool>
{
    private readonly ApplicationDBContext _context;
    private readonly ICacheService _cacheService;
    private readonly ICacheVersionManagement _cacheVersionManagement;
    
    public DeleteCommentCommandHandler(ApplicationDBContext context, ICacheService cacheService, ICacheVersionManagement cacheVersionManagement)
    {
        _context = context;
        _cacheService = cacheService;
        _cacheVersionManagement = cacheVersionManagement;
    }

    public async Task<bool> Handle(DeleteCommentCommand command, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments.Where(x => x.CommentId == command.CommentId)
            .FirstOrDefaultAsync(cancellationToken);

        if (comment != null)
        {
            var commentReplies = await _context.Comments.Where(c => c.UpperCommentId == command.CommentId).ToListAsync();
            _context.Comments.RemoveRange(commentReplies);

            _context.Comments.Remove(comment);
            var rowChanged = await _context.SaveChangesAsync(cancellationToken);

            await _cacheVersionManagement.BumpCacheVersionAsync($"GetCommentsByPostId:Post={comment.PostId}");

            await _cacheService.RemoveAsync($"GetCommentRepliesByCommentId:Comment={command.CommentId}");

            return rowChanged == 1;
        }
        else throw new Exception("Comment not found");
    }
}