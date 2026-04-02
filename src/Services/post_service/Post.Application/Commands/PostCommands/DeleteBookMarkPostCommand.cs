using MediatR;

namespace Post.Application.Commands.PostCommands;

public class DeleteBookMarkPostCommand : IRequest<bool>
{
    public Guid PostId { get; set; }
    
    public Guid UserId { get; set; }
}