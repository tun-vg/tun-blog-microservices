using comment_service.Common.Attributes;
using comment_service.Common.Interfaces;
using System.Reflection;

namespace comment_service.Behaviors;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    public string DefaultCacheVersion = "v1";
    private readonly IServiceProvider _serviceProvider;
    private readonly ICacheService _cacheService;
    private readonly ICacheVersionManagement _cacheVersionManagement;

    public CachingBehavior(IServiceProvider serviceProvider, ICacheService cacheService, ICacheVersionManagement cacheVersionManagement)
    {
        _serviceProvider = serviceProvider;
        _cacheService = cacheService;
        _cacheVersionManagement = cacheVersionManagement;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        // kiểm tra có attribute CachedAttribute không
        // nếu không có thì chạy next() luôn không làm gì về phần cache cả
        // nếu có thì lấy cache key và expiration từ attribute
        // lấy cache template từ attribute -> thực hiện cho vào hàm GenerateCacheKey để tạo thành cache key cụ thể
        // trong hàm GenerateCacheKey thì thực hiện format thành các dạng cache key có convention và lấy cache version để gán vào cache key

        var cacheAttribute = typeof(TRequest).GetCustomAttribute<CachedAttribute>();

        if (cacheAttribute is null)
        {
            return await next();
        }

        var cacheKey = await GenerateCacheKey(cacheAttribute.CacheKeyTemplate, request);
        var expirationSeconds = cacheAttribute.ExpirationSeconds;

        try
        {
            if (await _cacheService.ExistsAsync(cacheKey))
            {
                var valueCached = await _cacheService.GetAsync<TResponse>(cacheKey);
                if (valueCached is not null)
                {
                    return valueCached;
                }
            }
            else
            {
                var result = await next();
                await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromSeconds(expirationSeconds));
                return result;
            }
        }
        catch
        {
            return await next();
        }

        var response = await next();

        return response;
    }

    public async Task<string> GenerateCacheKey(string template, TRequest request)
    {
        var properties = typeof(TRequest).GetProperties();
        string key = typeof(TRequest).Name.Split("Query")[0].ToLower();
        foreach (var prop in properties)
        {
            var propValue = prop.GetValue(request)?.ToString() ?? string.Empty;
            template = template.Replace($"{{{prop.Name}}}", propValue);
            
        }

        string keyParameter = template.Substring(template.IndexOf(":"));
        var cacheVersion = await _cacheVersionManagement.GetCacheVersionAsync($"{key}{keyParameter}");
        return $"{template}:v={cacheVersion}";
    }

}
