using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Post.Contract.Provider;
using Post.Contract.Services;
using StackExchange.Redis;

namespace Post.Infrastructure.Services;

public class RedisCacheService : ICacheService
{
    private static readonly JsonSerializerOptions CacheJsonOptions =
    new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };


    private readonly IDatabase _cache;
    //private readonly JsonSerializerOptions _jsonSerializerOptions;

    public RedisCacheService(IConnectionMultiplexer redis)
    {
        _cache = redis.GetDatabase();
        //_jsonSerializerOptions = jsonSerializerOptions.Options;
    }

    public async Task<T> GetAsync<T>(string key)
    {
        var value = await _cache.StringGetAsync(key);
        if (value.IsNullOrEmpty)
        {
            return default;
        }
        var result = JsonSerializer.Deserialize<T>(value, CacheJsonOptions);
        return result;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var json = JsonSerializer.Serialize(value, CacheJsonOptions);
        await _cache.StringSetAsync(key, json, expiration);
    }

    public async Task RemoveAsync(string key)
    {
        await _cache.KeyDeleteAsync(key);
    }

    public Task ClearCacheAsync()
    {
        // Implementation for clearing the entire Redis cache
        throw new NotImplementedException();
    }

    public Task<bool> ExistsAsync(string key)
    {
        // Implementation for checking if a key exists in Redis cache
        throw new NotImplementedException();
    }
}
