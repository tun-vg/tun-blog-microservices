using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Queries.TagQueries
{
    public class GetTagsQueryHandler : IRequestHandler<GetTagsQuery, PagedResult<TagDto>>
    {
        private readonly ITagRepository _tagRepository;

        private readonly IMapper _mapper;

        public GetTagsQueryHandler(ITagRepository tagRepository, IMapper mapper)
        {
            _tagRepository = tagRepository;
            _mapper = mapper;
        }

        public async Task<PagedResult<TagDto>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
        {
            int page = request.Page <= 0 ? 1 : request.Page;
            int pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

            var (tags, totalCount) = await _tagRepository.GetTags(
                page,
                pageSize,
                request.Search,
                request.SortBy,
                request.IsDescending
            );
            var tagsDto = _mapper.Map<List<TagDto>>(tags);
            return PagedResult<TagDto>.Create(
                tagsDto,
                page,
                pageSize,
                totalCount
            );
        }
    }
}
