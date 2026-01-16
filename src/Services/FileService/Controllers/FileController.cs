using FileService.Services;
using Microsoft.AspNetCore.Mvc;

namespace FileService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly IFileService _fileService;

    public FileController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromQuery] string folder = "default")
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is missing.");

        var url = await _fileService.UploadAsync(file, folder);
        return Ok(new { Url = url });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete([FromQuery] string publicId)
    {
        if (string.IsNullOrEmpty(publicId))
            return BadRequest("Public ID is required.");

        await _fileService.DeleteAsync(publicId);
        return NoContent();
    }
}
