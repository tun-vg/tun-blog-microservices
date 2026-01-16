using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Services;

public interface IFileGrpcClient
{
    Task<string> UploadAsync(byte[] fileData, string fileName, string folder, string groupId);

    Task<bool> DeleteAsync(string publicId);
}
