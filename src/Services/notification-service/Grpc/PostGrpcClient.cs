using Grpc.Net.Client;
using NotificationService.Dtos;
using NotificationService.Protos;
using NotificationService.Services;

namespace NotificationService.Grpc;

public class PostGrpcClient : IPostService
{
    private readonly PostService.PostServiceClient _postServiceClient;

    public PostGrpcClient(IConfiguration configuration)
    {
        var channel = GrpcChannel.ForAddress(configuration.GetValue<string>("GrpcSettings:PostServiceUrl"));
        _postServiceClient = new PostService.PostServiceClient(channel);
    }

    public async Task<PostDto> GetPostAsync(Guid postId)
    {
        var request = new GetPostRequest
        {
            PostId = postId.ToString()
        };
        var response = await _postServiceClient.GetPostAsync(request);
        var postDto = new PostDto
        {
            PostId = Guid.Parse(response.PostId),
            AuthorId = Guid.Parse(response.AuthorId),
            Slug = response.Slug
        };
        return postDto;
    }

}