using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace Post.Application.Commands.PostCommands;

public class DeletePostCommand : IRequest<bool>
{
    public Guid PostId { get; set; } = Guid.Empty;

    public DeletePostCommand(Guid postId)
    {
        PostId = postId;
    }
}
