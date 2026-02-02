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
        
        return userDto;
    }
}