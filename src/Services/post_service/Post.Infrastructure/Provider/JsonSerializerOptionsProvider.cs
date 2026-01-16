//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;
//using Post.Contract.Provider;

//namespace Post.Infrastructure.Provider;

//public class JsonSerializerOptionsProvider : IJsonSerializerOptionsProvider
//{
//    public JsonSerializerOptions Options { get; }

//    public JsonSerializerOptionsProvider()
//    {
//        Options = new JsonSerializerOptions
//        {
//            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
//            WriteIndented = false
//        };

//        Options.Converters.Add(new ResultJsonConverterFactory());
        
//    }
//}
