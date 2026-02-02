using Grpc.Core;
using Grpc.Net.Client;
using NotificationService.Protos;
using NotificationService.Services;

namespace NotificationService.Grpc;

public class UserGrpcClient : IUserService
{
    private readonly UserService.UserServiceClient _userServiceClient;

    public UserGrpcClient(IConfiguration configuration)
    {
        var channel = GrpcChannel.ForAddress(configuration.GetValue<string>("GrpcSettings:UserServiceUrl"));
        _userServiceClient = new UserService.UserServiceClient(channel);
    }

    public async Task<GetUserResponse> GetUserAsync(string userId)
    {
        GetUserRequest request = new GetUserRequest
        {
            UserId = userId
        };
        var response = await _userServiceClient.GetUserAsync(request);
        return response;
    }
}