using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Post.Domain.Entities;
[Table("post_tag")]
public class PostTag
{
    [Key]
    public Guid PostTagId { get; set; }

    public Guid PostId { get; set; }

    [JsonIgnore]
    public Post? Post { get; set; }

    public Guid TagId { get; set; }

    [JsonIgnore]
    public Tag? Tag { get; set; }

    [NotMapped]
    public string TagName { get; set; } = string.Empty;
}
