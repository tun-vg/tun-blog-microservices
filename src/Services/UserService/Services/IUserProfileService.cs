using UserService.Entities;

namespace UserService.Services;

public interface IUserProfileService
{
    Task<UserProfileExtend?> GetUserProfileExtend(string userId);
    
    Task<UserProfileExtend> AddUserProfileExtend(UserProfileExtend userProfileExtend);
    
    Task<UserProfileExtend> UpdateUserProfileExtend(UserProfileExtend userProfileExtend);
}