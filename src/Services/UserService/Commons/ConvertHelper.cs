using Keycloak.AuthServices.Sdk.Admin.Models;
using UserService.Dtos;
using UserService.Entities;

namespace UserService.Commons;

public static class UserMappingExtensions
{
    public static UserRepresentation ToUserRepresontation(UserDto userDto)
    {
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.Id = userDto.UserId;
        userRepresentation.Username = userDto.UserName;
        userRepresentation.FirstName = userDto.FirstName;
        userRepresentation.LastName = userDto.LastName;
        userRepresentation.Email = userDto.Email;
        
        if (!string.IsNullOrEmpty(userDto.Description))
        {
            userRepresentation.Attributes = new Dictionary<string, ICollection<string>>
            {
                { "description", new List<string> { userDto.Description } }
            };
        }
        
        return userRepresentation;
    }

    public static UserDto ToUserDto(
        UserRepresentation userRepresentation, UserProfileExtend userProfileExtend, IEnumerable<UserFollowDto>? follows)
    {
        UserDto userDto = new UserDto();
        userDto.UserId = userRepresentation.Id;
        userDto.UserName = userRepresentation.Username;
        userDto.FirstName = userRepresentation.FirstName;
        userDto.LastName = userRepresentation.LastName;
        userDto.Email = userRepresentation.Email;
        userDto.FollowersCount = userProfileExtend.FollowersCount;
        userDto.FollowingCount = userProfileExtend.FollowingCount;
        userDto.AvatarUrl = userProfileExtend.AvatarUrl;
        userDto.Follows = follows ?? new List<UserFollowDto>();
        
        if (userRepresentation.Attributes != null && userRepresentation.Attributes.TryGetValue("description", out var descriptionValues))
        {
            userDto.Description = descriptionValues.FirstOrDefault();
        }
        
        return userDto;
    }
    
    public static List<UserDto> ToUserDtos(
        IEnumerable<UserRepresentation> userRepresentations, 
        IEnumerable<UserProfileExtend> userProfileExtends, 
        IEnumerable<UserFollowDto>? follows)
    {
        var userDtos = new List<UserDto>();
        
        foreach (var userRepresentation in userRepresentations)
        {
            var userProfileExtend = userProfileExtends.FirstOrDefault(u => u.UserId == userRepresentation.Id);
            if (userProfileExtend == null)
                continue;
            
            var userFollows = follows?.Where(f => f.FollowingId == userRepresentation.Id).ToList() ?? new List<UserFollowDto>();
            
            var userDto = ToUserDto(userRepresentation, userProfileExtend, userFollows);
            userDtos.Add(userDto);
        }
        
        return userDtos;
    }
}