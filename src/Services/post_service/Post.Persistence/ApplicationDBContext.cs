using Microsoft.EntityFrameworkCore;
using Post.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Post.Persistence;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // If not exists config db in startup Post.API use this config
            optionsBuilder.UseMySql("Server=mysql;Database=post_service;User=tun;password=123456789;ConvertZeroDateTime=True;",
                new MySqlServerVersion(new Version(8, 0, 23)));
        }
    }

    public DbSet<Category> Categories { get; set; }
    
    public DbSet<Post.Domain.Entities.Post> Posts { get; set; }

    public DbSet<PostTag> PostTags { get; set; }

    public DbSet<Tag> Tags { get; set; }
    
    public DbSet<PostVote> PostVotes { get; set; }
    
    public DbSet<PostBookMark> PostBookMarks { get; set; }
    
    public DbSet<PostAuthor> PostAuthors { get; set; }
}
