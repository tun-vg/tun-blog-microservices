using comment_service.Common.Interfaces;

namespace comment_service.Application.Commands;

public class UnLikeCommentCommand : ICommand<bool>
{
    public Guid CommentId { get; set; }

    public Guid UserId { get; set; }

}
