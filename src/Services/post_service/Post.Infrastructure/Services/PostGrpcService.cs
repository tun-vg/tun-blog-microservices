using Grpc.Core;
using Microsoft.Extensions.Logging;
using Post.Contract.Repositories;
using Post.Infrastructure.Protos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Infrastructure.Services;

public class PostGrpcService : PostService.PostServiceBase
{
    private readonly IPostRepository _postRepository;
    private readonly ILogger<PostGrpcService> _logger;

    public PostGrpcService(IPostRepository postRepository, ILogger<PostGrpcService> logger)
    {
        _postRepository = postRepository;
        _logger = logger;
    }

    public override async Task<GetPostResponse> GetPost(GetPostRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Received GetPost request for PostId: {PostId}", request.PostId);

        var post = await _postRepository.GetPostById(new Guid(request.PostId));
        if (post == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, "Post not found"));
        }
        var response = new GetPostResponse
        {

            PostId = post.PostId.ToString(),
            AuthorId = post.AuthorId.ToString(),
            Slug = post.Slug
        };
        return response;
    }
}
