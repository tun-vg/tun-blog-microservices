using Keycloak.AuthServices.Sdk.Kiota.Admin.Models;
using UserService.Entities;
using UserRepresentation = Keycloak.AuthServices.Sdk.Admin.Models.UserRepresentation;

namespace UserService.Dtos;

public class UserDto
{
    public string? UserId { get; set; }
    
    public string? UserName { get; set; }
    
    public string? Email { get; set; }
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    // user service data
    
    public int FollowersCount { get; set; }
    
    public int FollowingCount { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public IFormFile? Image { get; set; }
    
    public IEnumerable<UserFollowDto>? Follows { get; set; }
}