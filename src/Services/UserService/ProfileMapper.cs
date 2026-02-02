using UserService.Dtos;
using UserService.Entities;

namespace UserService;

public class ProfileMapper : AutoMapper.Profile
{
    public  ProfileMapper()
    {
        CreateMap<UserFollow, UserFollowDto>()
            .ForMember(dest => dest.FollowerId, opt => opt.MapFrom(src => src.FollowerId))
            .ForMember(dest => dest.FollowingId, opt => opt.MapFrom(src => src.FollowingId));
    }
}