using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;

namespace Post.Application.Commands.TagCommands
{
    public class UpdateTagCommand : IRequest<Result>
    {
        public Guid TagId { get; set; } = Guid.Empty;

        public string Name { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public UpdateTagCommand(Guid tagId, string name, string slug)
        {
            TagId = tagId;
            Name = name;
            Slug = slug;
        }
    }
}
