using Grpc.Core;
using NotificationService.Protos;

namespace NotificationService.Services;

public interface IUserService
{
    Task<GetUserResponse> GetUserAsync(string userId);
}