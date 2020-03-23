using AutoMapper;
using Data.Dtos;
using Domain.Identity;

namespace Data.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, UserForListDto>();
            CreateMap<AppUser, UserForDetailedDto>();
        }
    }
}