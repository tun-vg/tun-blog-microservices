namespace FileService.Repository;

public class FileRepository : IFileRepository
{
    private readonly ApplicationDBContext _context;
    public FileRepository(ApplicationDBContext context)
    {
        _context = context;
    }
    public async Task SaveFile(Entities.File file)
    {
        await _context.Files.AddAsync(file);
        await _context.SaveChangesAsync();
    }

}
