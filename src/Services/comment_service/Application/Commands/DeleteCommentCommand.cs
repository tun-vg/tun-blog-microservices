using comment_service.Common.Interfaces;

namespace comment_service.Application.Commands;

public class DeleteCommentCommand : ICommand<bool>
{
    public Guid CommentId { get; set; }
    
    public DeleteCommentCommand(Guid commentId)
    {
      CommentId = commentId;
    }
}