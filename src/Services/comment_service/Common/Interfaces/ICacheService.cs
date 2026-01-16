namespace comment_service.Common.Interfaces;

public interface ICacheService
{
    Task<T> GetAsync<T>(string key);

    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);

    Task RemoveAsync(string key);

    Task ClearCacheAsync();

    Task<bool> ExistsAsync(string key);
}
