using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;

namespace Post.Application.Commands.TagCommands;

public class DeleteTagCommand : IRequest<Result>
{
    public Guid TagId { get; set; } = Guid.Empty;

    public DeleteTagCommand(Guid tagId)
    {
        TagId = tagId;
    }
}
