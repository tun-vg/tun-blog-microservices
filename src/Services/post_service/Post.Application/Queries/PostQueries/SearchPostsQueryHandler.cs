using AutoMapper;
using MediatR;
using Post.Application.Dtos;
using Post.Contract.Abstractions;
using Post.Contract.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Post.Contract.Services;

namespace Post.Application.Queries.PostQueries;

public class SearchPostsQueryHandler : IRequestHandler<SearchPostsQuery, PagedResult<Object>>
{
    private readonly IPostRepository _postRepository;
    private readonly IMapper _mapper;
    private readonly IUserGrpcClient _userGrpcClient;

    public SearchPostsQueryHandler(IPostRepository postRepository, IMapper mapper, IUserGrpcClient userGrpcClient)
    {
        _postRepository = postRepository;
        _mapper = mapper;
        _userGrpcClient = userGrpcClient;
    }

    public async Task<PagedResult<Object>> Handle(SearchPostsQuery query, CancellationToken cancellationToken)
    {
        if (query.Type.ToLower() == "post" || query.Type.ToLower() == "tag")
        {
            var (posts, count) = await _postRepository.SearchPost(query.Search, query.Type, query.Page, query.PageSize);
            var postDtos = _mapper.Map<List<Object>>(posts);
            return PagedResult<Object>.Create(postDtos, query.Page, query.PageSize, count);
        }
        else if (query.Type.ToLower() == "user")
        {
            // call to user service to search users by grpc
            //throw new NotImplementedException("User search is not implemented.");
            var users = await _userGrpcClient.SearchUsers(query.Search);
            var userDtos = _mapper.Map<List<Object>>(users.GetType().GetProperty("Users").GetValue(users));
            return PagedResult<Object>.Create(_mapper.Map<List<object>>(userDtos), 0);
        }
        else
        {
            throw new Exception("Invalid type search");
        }
    }
}