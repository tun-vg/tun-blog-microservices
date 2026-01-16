using comment_service.Common.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace comment_service.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDatabase _cache;

    public RedisCacheService(IConnectionMultiplexer redis)
    {
        _cache = redis.GetDatabase();
    }

    public Task ClearCacheAsync()
    {
        throw new NotImplementedException();
    }

    public Task<bool> ExistsAsync(string key)
    {
        //throw new NotImplementedException();
        return _cache.KeyExistsAsync(key);
    }

    public async Task<T> GetAsync<T>(string key)
    {
        var value = await _cache.StringGetAsync(key);
        if (value.IsNullOrEmpty)
        {
            return default;
        }
        var result = JsonSerializer.Deserialize<T>(value);
        return result;
    }

    public async Task RemoveAsync(string key)
    {
        await _cache.KeyDeleteAsync(key);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var json = JsonSerializer.Serialize(value);
        await _cache.StringSetAsync(key, json, expiration, When.Always);
    }
}
