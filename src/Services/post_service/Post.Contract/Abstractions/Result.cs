using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Abstractions;

public class Result
{
    public Result () { }

    public Result(object value, bool isSuccess, Error error) {
        Value = value;
        IsSuccess = isSuccess;
        Error = error;
    }

    public Result(bool isSuccess, Error error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public object? Value { get; set; }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;

    public Error Error { get; } = Error.None;

    public static Result Success() => new(true, Error.None);

    public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None);

    public static Result Failure(Error error) => new(false, error);

    public static Result<TValue> Failure<TValue>(Error error) => new(default, false, error);

    public static Result<TValue> Create<TValue>(TValue? value) => value is not null ? Success(value) : Failure<TValue>(Error.NullValue);
}

//public class Result
//{
//    protected internal Result(bool isSuccess, Error error)
//    {
//        if (isSuccess && error != Error.None)
//        {
//            throw new InvalidOperationException();
//        }

//        if (!isSuccess && error == Error.None)
//        {
//            throw new InvalidOperationException();
//        }

//        IsSuccess = isSuccess;
//        Error = error;
//    }

//    public bool IsSuccess { get; }

//    public bool IsFailure => !IsSuccess;

//    public Error Error { get; }

//    public static Result Success() => new(true, Error.None);

//    public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None);

//    public static Result Failure(Error error) => new(false, error);

//    public static Result<TValue> Failure<TValue>(Error error) => new(default, false, error);

//    public static Result<TValue> Create<TValue>(TValue? value) => value is not null ? Success(value) : Failure<TValue>(Error.NullValue);
//}   