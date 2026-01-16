using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Attributes;

[AttributeUsage(AttributeTargets.Class, Inherited = false)]
public class CachedAttribute : Attribute
{
    public string CacheKeyTemplate { get; }
    public int ExpirationSeconds { get; }

    public CachedAttribute(string cacheKeyTemplate, int expirationSeconds = 3600)
    {
        CacheKeyTemplate = cacheKeyTemplate;
        ExpirationSeconds = expirationSeconds;
    }
}
