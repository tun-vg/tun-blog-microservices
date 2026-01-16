//using System.Text.Json;
//using System.Text.Json.Serialization;
//using Post.Contract.Abstractions;
//using Post.Contract.Dtos;

//public class ResultJsonConverterFactory : JsonConverterFactory
//{
//    public override bool CanConvert(Type typeToConvert)
//        => typeToConvert.IsGenericType && typeToConvert.GetGenericTypeDefinition() == typeof(Result<>);

//    public override JsonConverter? CreateConverter(Type type, JsonSerializerOptions options)
//    {
//        var innerType = type.GetGenericArguments()[0];
//        var converterType = typeof(ResultJsonConverter<>).MakeGenericType(innerType);
//        return (JsonConverter?)Activator.CreateInstance(converterType);
//    }
//}

//public class ResultJsonConverter<T> : JsonConverter<Result<T>>
//{
//    public override Result<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
//    {
//        var dto = JsonSerializer.Deserialize<ResultDto<T>>(ref reader, options)!;
//        return dto.IsSuccess
//            ? Result.Success(dto.Value)
//            : Result.Failure<T>(dto.Error);
//    }

//    public override void Write(Utf8JsonWriter writer, Result<T> value, JsonSerializerOptions options)
//    {
//        var dto = new ResultDto<T>
//        {
//            IsSuccess = value.IsSuccess,
//            Error = value.Error,
//            Value = value.IsSuccess ? value.Value : default
//        };
//        JsonSerializer.Serialize(writer, dto, options);
//    }
//}
