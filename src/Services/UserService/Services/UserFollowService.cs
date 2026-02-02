using AutoMapper;
using Microsoft.EntityFrameworkCore;
using UserService.Dtos;
using UserService.Entities;

namespace UserService.Services;

public class UserFollowService : IUserFollowService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    
    public UserFollowService(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task FollowUserAsync(UserFollowDto userFollowDto)
    {
        var userFollowing = await _dbContext.UserProfileExtends
            .Where(u => u.UserId == userFollowDto.FollowingId)
            .FirstOrDefaultAsync();
        
        var userFollower = await _dbContext.UserProfileExtends
            .Where(u => u.UserId == userFollowDto.FollowerId)
            .FirstOrDefaultAsync();

        UserFollow userFollow = new UserFollow
        {
            FollowerId = userFollowDto.FollowerId,
            FollowingId = userFollowDto.FollowingId,
            CreatedAt = DateTime.Now
        };
        
        await _dbContext.UserFollows.AddAsync(userFollow);

        userFollowing.FollowersCount += 1;
        userFollower.FollowingCount += 1;
        
        await _dbContext.SaveChangesAsync();
    }

    public async Task UnfollowUserAsync(UserFollowDto userFollowDto)
    {
        var userFollowing = await _dbContext.UserProfileExtends
            .Where(u => u.UserId == userFollowDto.FollowingId)
            .FirstOrDefaultAsync();
        
        var userFollower = await _dbContext.UserProfileExtends
            .Where(u => u.UserId == userFollowDto.FollowerId)
            .FirstOrDefaultAsync();
        
        var userFollow = await _dbContext.UserFollows
            .Where(u => u.FollowerId == userFollowDto.FollowerId)
            .FirstOrDefaultAsync();
        
        _dbContext.UserFollows.Remove(userFollow);
        
        userFollowing.FollowersCount -= 1;
        userFollower.FollowingCount -= 1;
        
        await _dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<UserFollowDto>> GetFollowersAsync(string userId)
    {
        var userFollows = await _dbContext.UserFollows
            .Where(u => u.FollowingId == userId)
            .ToListAsync();

        var userFollowDtos = _mapper.Map<IEnumerable<UserFollowDto>>(userFollows);
        
        return userFollowDtos;
    }
}