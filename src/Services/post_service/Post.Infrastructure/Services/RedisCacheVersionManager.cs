using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Post.Contract.Services;
using StackExchange.Redis;

namespace Post.Infrastructure.Services;

public class RedisCacheVersionManager : ICacheVersionManager
{
    private readonly IDatabase _db;

    public RedisCacheVersionManager(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task<string> GetVersionAsync(string domain)
    {
        var version = await _db.StringGetAsync(GetKey(domain));
        if (version.IsNullOrEmpty)
        {
            version = "v1";
            await _db.StringSetAsync(GetKey(domain), version);
        }

        return version!;
    }

    public async Task BumpVersionAsync(string domain)
    {
        var current = await GetVersionAsync(domain);
        var next = $"v{int.Parse(current[1..]) + 1}";
        await _db.StringSetAsync(GetKey(domain), next);
    }

    private string GetKey(string domain) => $"cache-version:{domain}";
}
