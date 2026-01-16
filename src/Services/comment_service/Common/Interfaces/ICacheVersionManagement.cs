namespace comment_service.Common.Interfaces
{
    public interface ICacheVersionManagement
    {
        Task<string> GetCacheVersionAsync(string cacheKeyPrefix);

        Task BumpCacheVersionAsync(string cacheKeyPrefix);
    }
}
