using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Application.Queries.PostQueries;

public class GetPostsByUserIdQueryHandler : IRequestHandler<GetPostsByUserIdQuery, PagedResult<PostDto>>
{
    private readonly IPostRepository _postRepository;
    private readonly IMapper _mapper;

    public GetPostsByUserIdQueryHandler(IPostRepository postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<PostDto>> Handle(GetPostsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var (posts, count) = await _postRepository.GetPostsByUserId(request.Page, request.PageSize, request.UserId);
        var postDtos = _mapper.Map<List<PostDto>>(posts);
        return PagedResult<PostDto>.Create(postDtos, request.Page, request.PageSize, count);
    }
}
