using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;

namespace Post.Application.Queries.PostQueries;

public class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, PagedResult<PostDto>>
{
    private readonly IPostRepository _postRepository;
    private readonly IMapper _mapper;

    public GetPostsQueryHandler(IPostRepository postRepository, IMapper mapper)
    {
        _postRepository = postRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<PostDto>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
    {
        int page = request.Page <= 0 ? 1 : request.Page;
        int pageSize = request.PageSize <= 0 ? 10 : request.PageSize;
        var (posts, totalCount) = await _postRepository.GetPostByPage(
            page, 
            pageSize, 
            request.Search, 
            request.SortBy, 
            request.IsDescending
        );
        var postDtos = _mapper.Map<List<PostDto>>(posts);
        return PagedResult<PostDto>.Create(postDtos, page, pageSize, totalCount);
    }
}
