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

namespace Post.Application.Queries.TagQueries;

public class GetTagsByCategoryIdQueryHandler : IRequestHandler<GetTagsByCategoryIdQuery, PagedResult<TagDto>>
{
    private readonly ITagRepository _tagRepository;
    private readonly IMapper _mapper;

    public GetTagsByCategoryIdQueryHandler(ITagRepository tagRepository, IMapper mapper)
    {
        _tagRepository = tagRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<TagDto>> Handle(GetTagsByCategoryIdQuery query, CancellationToken cancellationToken)
    {
        var (tagList, count) = await _tagRepository.GetTagsByCategoryId(query.CategoryId ?? Guid.Empty);
        var tagListDto = _mapper.Map<List<TagDto>>(tagList);
        return PagedResult<TagDto>.Create(tagListDto, count);
    }
}
