using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileService.Repository;
using FileService.Services.Config;
using Microsoft.Extensions.Options;

namespace FileService.Services;

public class FileService : IFileService
{
    private readonly Cloudinary _cloudinary;
    
    private readonly IFileRepository _fileRepository;

    public FileService(IOptions<CloudinarySettings> cloudinarySettings, IFileRepository fileRepository)
    {
        var account = new Account(
            cloudinarySettings.Value.CloudName,
            cloudinarySettings.Value.ApiKey,
            cloudinarySettings.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);

        _fileRepository = fileRepository;
    }

    public async Task<string> UploadAsync(IFormFile file, string folder)
    {
        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder,
            UseFilename = true,
            UniqueFilename = false,
            Overwrite = true
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.ToString();
    }

    public async Task DeleteAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }

    public async Task SaveFile(Entities.File file)
    {
        await _fileRepository.SaveFile(file);
    }
}
