using Microsoft.EntityFrameworkCore;
using UserService.Entities;

namespace UserService.Services;

public class UserProfileService : IUserProfileService
{
    private readonly ApplicationDbContext _dbContext;
    
    public UserProfileService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserProfileExtend?> GetUserProfileExtend(string userId)
    {
        var userProfileExtend = await _dbContext.UserProfileExtends
            .AsNoTracking()
            .Where(u => u.UserId == userId)
            .FirstOrDefaultAsync();
        
        return userProfileExtend;
        
    }

    public async Task<UserProfileExtend> AddUserProfileExtend(UserProfileExtend userProfileExtend)
    {
        await _dbContext.UserProfileExtends.AddAsync(userProfileExtend);
        await _dbContext.SaveChangesAsync();
        return userProfileExtend;
    }

    public async Task<UserProfileExtend> UpdateUserProfileExtend(UserProfileExtend userProfileExtend)
    {
        var userProfile = await _dbContext.UserProfileExtends
            .Where(u => u.UserId == userProfileExtend.UserId)
            .FirstOrDefaultAsync();

        if (userProfile != null)
        {
            userProfile.AvatarUrl = userProfileExtend.AvatarUrl;

            await _dbContext.SaveChangesAsync();
        }
        else
        {
            userProfile = new UserProfileExtend
            {
                UserId = userProfileExtend.UserId,
                FollowersCount = 0,
                FollowingCount = 0,
                AvatarUrl = string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            await _dbContext.UserProfileExtends.AddAsync(userProfile);
            await _dbContext.SaveChangesAsync();
        }
        
        return userProfile;
    }
}