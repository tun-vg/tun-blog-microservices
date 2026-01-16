using comment_service.Common.Interfaces;
using comment_service.Entities;

namespace comment_service.Application.Commands;

public class UpdateCommentCommandHandler : ICommandHandler<UpdateCommentCommand, Comment>
{
    private readonly ApplicationDBContext _context;
    private readonly ICacheVersionManagement _cacheVersionManagement;

    public UpdateCommentCommandHandler(ApplicationDBContext context, ICacheVersionManagement cacheVersionManagement)
    {
        _context = context;
        _cacheVersionManagement = cacheVersionManagement;
    }

    public async Task<Comment> Handle(UpdateCommentCommand command, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments.FindAsync(command.CommentId, cancellationToken);
        if (comment != null)
        {
            comment.Content = command.Content;
            comment.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            if (comment.UpperCommentId == null)
            {
                await _cacheVersionManagement.BumpCacheVersionAsync($"GetCommentsByPostId:Post={comment.PostId}");
            } else
            {
                await _cacheVersionManagement.BumpCacheVersionAsync($"GetCommentRepliesByCommentId:Comment={comment.UpperCommentId}");
            }

            return comment;
        }
        else
        {
            throw new Exception("Comment not found");
        }
    }
}