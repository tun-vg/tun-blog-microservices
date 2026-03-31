using MediatR;

namespace Post.Application.Commands.PostCommands;

public class ViewPostCommand : IRequest
{
    public Guid PostId { get; set; }
    
    public ViewPostCommand(Guid postId)
    {
        PostId = postId;
    }
}