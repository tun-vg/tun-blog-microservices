using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;

namespace Post.Application.Queries.PostQueries;

//[Cached("post:{PostId}", 600)]
public class GetPostByIdQuery : IRequest<Result>
{
    public Guid PostId { get; set; } = Guid.Empty;

    public GetPostByIdQuery(Guid postId)
    {
        PostId = postId;
    }
}
