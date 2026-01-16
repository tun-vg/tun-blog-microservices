using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Queries.TagQueries
{
    public class GetTagQueryHandler : IRequestHandler<GetTagQuery, Result>
    {
        private readonly ITagRepository _tagRepository;
        public GetTagQueryHandler(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }
        public async Task<Result> Handle(GetTagQuery request, CancellationToken cancellationToken)
        {
            var tag = await _tagRepository.GetTagById(request.TagId);
            if (tag == null)
            {
                return Result.Failure(new Error("400", "Tag not found"));
            }
            return Result.Success(tag);
        }
    }
}
