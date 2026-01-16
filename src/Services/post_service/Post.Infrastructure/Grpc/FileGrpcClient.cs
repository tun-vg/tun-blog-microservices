using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Grpc.Net.Client;
using Microsoft.Extensions.Configuration;
using Post.Contract.Services;
using Post.Infrastructure.Protos;

namespace Post.Infrastructure.Grpc
{
    public class FileGrpcClient : IFileGrpcClient
    {
        private readonly FileService.FileServiceClient _client;

        public FileGrpcClient(IConfiguration configuration)
        {
            var channel = GrpcChannel.ForAddress(configuration["GrpcSettings:FileServiceUrl"]);
            _client = new FileService.FileServiceClient(channel);
        }

        public async Task<string> UploadAsync(byte[] fileData, string fileName, string folder, string groupId)
        {
            var request = new UploadFileRequest
            {
                FileData = Google.Protobuf.ByteString.CopyFrom(fileData),
                FileName = fileName,
                Folder = folder,
                GroupId = groupId
            };

            var response = await _client.UploadFileAsync(request);
            return response.Url;
        }

        public async Task<bool> DeleteAsync(string publicId)
        {
            var response = await _client.DeleteFileAsync(new DeleteFileRequest { PublicId = publicId });

            return response.Success;
        }
    }
}
