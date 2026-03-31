using Microsoft.EntityFrameworkCore;
using Post.Application;
using Post.Contract;
using Post.Contract.Repositories;
using Post.Infrastructure;
using Post.Infrastructure.Services;
using Post.Persistence;
using Post.Persistence.Repositories;

// Enable HTTP/2 unencrypted support for gRPC calls over plain HTTP (required for development)
AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    b => b.MigrationsAssembly("Post.Persistence"));
});

// config MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Post.Application.AssemblyReference).Assembly);
});

// config DI
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IPostTagRepository, PostTagRepository>();
builder.Services.AddScoped<IPostVoteRepository, PostVoteRepository>();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddContract();

// config AutoMapper
builder.Services.AddAutoMapper(typeof(ProfileMapper));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
builder.Services.AddGrpc();


var app = builder.Build();

app.MapGrpcService<PostGrpcService>();
app.MapGet("/", () => "This is gRPC PostService");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
