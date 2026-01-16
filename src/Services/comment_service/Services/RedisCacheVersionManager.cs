using comment_service.Common.Interfaces;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace comment_service.Services;

public class RedisCacheVersionManager : ICacheVersionManagement
{
    private readonly ICacheService _cacheService;
    private int GlobalExpirationSeconds = 3600;

    public RedisCacheVersionManager(ICacheService cacheService)
    {
        _cacheService = cacheService;
    }

    public async Task<string> GetCacheVersionAsync(string cacheKeyPrefix)
    {
        string lowerCacheKey = cacheKeyPrefix.ToLower();
        var version = await _cacheService.GetAsync<string>(GenerateCacheKeyVersion(lowerCacheKey));
        if (string.IsNullOrEmpty(version))
        {
            version = "v1";
            await _cacheService.SetAsync<string>(GenerateCacheKeyVersion(lowerCacheKey), version, TimeSpan.FromSeconds(GlobalExpirationSeconds));
        }
        return version;
    }
    public async Task BumpCacheVersionAsync(string cacheKeyPrefix)
    {
        string lowerCacheKey = cacheKeyPrefix.ToLower();
        var currentVersion = await _cacheService.GetAsync<string>(GenerateCacheKeyVersion(lowerCacheKey));
        if (!string.IsNullOrEmpty(currentVersion))
        {
            var newVersion = $"v{(int.Parse(currentVersion[1..]) + 1).ToString()}";
            await _cacheService.SetAsync<string>(GenerateCacheKeyVersion(lowerCacheKey), newVersion, TimeSpan.FromSeconds(GlobalExpirationSeconds));
        }
    }

    private string GenerateCacheKeyVersion(string cacheKeyPrefix)
    {
        return $"cache-version:{cacheKeyPrefix}";
    }
}
