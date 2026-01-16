using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Abstractions;

public class Error
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static readonly Error NullValue = new("Error.NullValue", "");

    public string Code { get; set; }

    public string Message { get; set; }

    public Error (string code, string message)    {
        Code = code;
        Message = message;
    }

    public bool Equals(Error? other)
    {
        return ((IEquatable<Error>)None).Equals(other);
    }
}
