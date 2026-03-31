using MediatR;
using Post.Application.Dtos;

namespace Post.Application.Commands.PostCommands;

public class UpVotePostCommand : IRequest<VotePostResponse>
{
    public Guid PostId { get; set; } = Guid.Empty;

    public Guid UserId { get; set; } = Guid.Empty;
}