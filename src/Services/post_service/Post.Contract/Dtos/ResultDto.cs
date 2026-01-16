using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Post.Contract.Abstractions;

namespace Post.Contract.Dtos
{
    public class ResultDto<T>
    {
        public bool IsSuccess { get; set; }

        public Error Error { get; set; } = Error.None;

        public T? Value { get; set; }

        
    }
}
