using comment_service.Common.Interfaces;

namespace comment_service.Application.Commands;

public class LikeCommentCommand : ICommand<bool>
{
    public Guid CommentId { get; set; }
    
    public Guid UserId { get; set; }
    
    public LikeCommentCommand(Guid commentId, Guid userId)
    {
        CommentId = commentId;
        UserId = userId;
    }
}
