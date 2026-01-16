namespace comment_service.Common.Attributes;

[AttributeUsage(AttributeTargets.Class, Inherited = false)]
public class CachedAttribute : Attribute
{
    public string CacheKeyTemplate { get; }

    public int ExpirationSeconds { get; }

    public CachedAttribute(string cacheKeyTemplate, int expirationSeconds = 60)
    {
        CacheKeyTemplate = cacheKeyTemplate;
        ExpirationSeconds = expirationSeconds;
    }
}
