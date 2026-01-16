using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;

namespace Post.Application.Queries.TagQueries
{
    public class GetTagQuery : IRequest<Result>
    {
        public Guid TagId { get; set; } = Guid.Empty;
        
        public GetTagQuery(Guid tagId)
        {
            TagId = tagId;
        }
    }
}
