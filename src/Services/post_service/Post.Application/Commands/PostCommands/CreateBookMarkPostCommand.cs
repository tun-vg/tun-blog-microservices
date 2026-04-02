using MediatR;

namespace Post.Application.Commands.PostCommands;

public class CreateBookMarkPostCommand : IRequest<bool>
{
    public Guid PostId { get; set; }
    
    public Guid UserId { get; set; }
}