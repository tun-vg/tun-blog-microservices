using UserService.Dtos;
using UserService.Protos;

namespace UserService.Services;

public interface IUserFollowService
{
    Task FollowUserAsync(UserFollowDto userFollowDto);
    
    Task UnfollowUserAsync(UserFollowDto userFollowDto);
    
    Task<List<UserFollowDto>> GetFollowersAsync(string userId);
    
    Task<List<UserFollowDto>> GetFollowingsAsync(string userId);
}