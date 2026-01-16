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

namespace Post.Application.Queries.PostQueries
{
    public class GetPostsTrendingQueryHandler : IRequestHandler<GetPostsTrendingQuery, PagedResult<PostDto>>
    {
        private readonly IPostRepository _postRepository;

        private readonly IMapper _mapper;

        public GetPostsTrendingQueryHandler(IPostRepository postRepository, IMapper mapper)
        {
            _postRepository = postRepository;
            _mapper = mapper;
        }


        public async Task<PagedResult<PostDto>> Handle(GetPostsTrendingQuery request, CancellationToken cancellationToken)
        {
            var posts = await _postRepository.GetPostsTrending(request.Month, request.Year, request.Size);
            var postDtos = _mapper.Map<List<PostDto>>(posts);
            return PagedResult<PostDto>.Create(postDtos, request.Size);
        }
    }
}
