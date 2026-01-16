using comment_service.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace comment_service.Application.Commands;

public class UnLikeCommentCommandHandler : ICommandHandler<UnLikeCommentCommand, bool>
{
    private readonly ApplicationDBContext _context;

    public UnLikeCommentCommandHandler(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UnLikeCommentCommand command, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments.FindAsync(command.CommentId);
        if (comment != null)
        {
            comment.LikedCount -= 1;
        }

        var reaction = await _context.CommentReactions.Where(e => e.CommentId == command.CommentId && e.UserId == command.UserId)
            .FirstOrDefaultAsync(cancellationToken);

        if (reaction != null)
        {
            _context.CommentReactions.Remove(reaction);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        return false;
    }
}
