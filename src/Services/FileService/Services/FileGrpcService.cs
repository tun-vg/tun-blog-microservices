using Grpc.Core;
using FileService.Protos;
using static FileService.Protos.FileService;
using FileService.Repository;
using FileService.Entities;

namespace FileService.Services;

public class FileGrpcService : FileServiceBase
{
    private readonly IFileService _fileService;
    private readonly IFileRepository _fileRepository;

    public FileGrpcService(IFileService fileService, IFileRepository fileRepository)
    {
        _fileService = fileService;
        _fileRepository = fileRepository;
    }

    public override async Task<UploadFileResponse> UploadFile(UploadFileRequest request, ServerCallContext context)
    {
        var stream = new MemoryStream(request.FileData.ToByteArray());
        var formFile = new FormFile(stream, 0, stream.Length, null, request.FileName);
        var url = await _fileService.UploadAsync(formFile, request.Folder);

        Entities.File file = new Entities.File();
        file.FileName = request.FileName;
        file.GroupId = request.GroupId;
        file.SaveLink = url;
        file.CreatedAt = DateTime.Now;

        await _fileRepository.SaveFile(file);

        return new UploadFileResponse { Url = url };
    }

    public override async Task<DeleteFileResponse> DeleteFile(DeleteFileRequest request, ServerCallContext context)
    {
        await _fileService.DeleteAsync(request.PublicId);
        return new DeleteFileResponse { Success = true };
    }
}
