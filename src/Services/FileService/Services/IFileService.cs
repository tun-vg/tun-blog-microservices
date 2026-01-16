using FileService.Entities;

namespace FileService.Services;

public interface IFileService
{
    Task<string> UploadAsync(IFormFile file, string folder);

    Task DeleteAsync(string publicId);

    Task SaveFile(Entities.File file);
}
