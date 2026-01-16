using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FileService.Entities;

[Table("file")]
public class File
{
    [Key]
    public Guid FileId { get; set; } = Guid.NewGuid();

    public string FileName { get; set; } = string.Empty;

    public string GroupId { get; set; } = string.Empty;

    public string SaveLink { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
