using UserService.Dtos;
using UserService.Protos;

namespace UserService.Services;

public interface IUserFollowService
{
    Task FollowUserAsync(UserFollowDto userFollowDto);
    
    Task UnfollowUserAsync(UserFollowDto userFollowDto);
    
    Task<IEnumerable<UserFollowDto>> GetFollowersAsync(string userId);
}