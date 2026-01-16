using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Post.Contract.Provider;

public interface IJsonSerializerOptionsProvider
{
    JsonSerializerOptions Options { get; }
}
