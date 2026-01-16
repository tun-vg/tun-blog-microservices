using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Post.Contract.Abstractions;
using Post.Contract.Attributes;
using Post.Contract.Services;

namespace Post.Contract.Behaviors;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICacheService _cacheServive;
    private readonly ICacheVersionManager _cacheVersionManager;

    public CachingBehavior(ICacheService cacheServive, ICacheVersionManager cacheVersionManager)
    {
        _cacheServive = cacheServive;
        _cacheVersionManager = cacheVersionManager;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var cachedAttr = typeof(TRequest).GetCustomAttribute<CachedAttribute>();
        if (cachedAttr is null)
        {
            return await next();
        }

        string cacheKey = await GenerateCacheKeyAsync(cachedAttr.CacheKeyTemplate, request);
        var cachedData = await _cacheServive.GetAsync<TResponse>(cacheKey);
        if (cachedData is not null)
        {
            return cachedData;
        }

        var response = await next();
        //object? valueToCache = ExtractValueToCache(response);
        await _cacheServive.SetAsync(cacheKey, response, TimeSpan.FromSeconds(cachedAttr.ExpirationSeconds));
        return response;
    }

    private async Task<string> GenerateCacheKeyAsync(string template, TRequest request)
    {
        var domain = typeof(TRequest).Name.Split("Query")[0].ToLower();
        var version = await _cacheVersionManager.GetVersionAsync(domain);

        template = $"{template}:v={version}";

        foreach (var prop in request!.GetType().GetProperties())
        {
            var placeholder = $"{{{prop.Name}}}";
            if (template.Contains(placeholder))
            {
                var value = prop.GetValue(request)?.ToString() ?? "";
                template = template.Replace(placeholder, value);
            }
        }
        return template;
    }

    private object? ExtractValueToCache(object response)
    {
        var responseType = response.GetType();

        if (responseType.IsGenericType && responseType.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var isSuccessProp = responseType.GetProperty("IsSuccess")?.GetValue(response);
            if (isSuccessProp is true)
            {
                var valueProp = responseType.GetProperty("Value");
                return valueProp?.GetValue(response);
            }
            else
            {
                // Do not cache failed Result
                return null;
            }
        }
        else if (responseType.IsGenericType && responseType.GetGenericTypeDefinition() == typeof(PagedResult<>))
        {
            var valueProp = responseType.GetProperty("Items");
            return valueProp?.GetValue(response);
        }
        return response;
    }
}
