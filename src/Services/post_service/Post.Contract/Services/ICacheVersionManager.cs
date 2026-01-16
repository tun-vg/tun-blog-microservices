using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Services;

public interface ICacheVersionManager
{
    Task<string> GetVersionAsync(string domain);

    Task BumpVersionAsync(string domain);
}
