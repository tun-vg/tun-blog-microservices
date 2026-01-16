namespace FileService.Repository;

public interface IFileRepository
{
    Task SaveFile(Entities.File file);
}
