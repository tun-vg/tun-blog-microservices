using Grpc.Net.Client;
using Microsoft.Extensions.Configuration;
using Post.Contract.Services;
using Post.Infrastructure.Protos;

namespace Post.Infrastructure.Grpc;

public class UserGrpcClient : IUserGrpcClient
{
    private readonly UserService.UserServiceClient _client;

    public UserGrpcClient(IConfiguration configuration)
    {
        var channel = GrpcChannel.ForAddress(configuration["GrpcSettings:UserServiceUrl"]!);
        _client = new UserService.UserServiceClient(channel);
    }
    
    public async Task<object> SearchUsers(string name)
    {
        var request = new SearchUsersRequest
        {
            Name = name
        };
        
        SearchUsersResponse response = await _client.SearchUsersAsync(request);
        return (object)response;
    }
}