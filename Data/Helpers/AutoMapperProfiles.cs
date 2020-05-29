using AutoMapper;
using Data.Dtos;
using Domain;
using Domain.Identity;
using System.Linq;

namespace Data.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, UserForListDto>()
                .ForMember(destination => destination.PhotoUrl,
                    opt =>
                    {
                        opt.MapFrom(source =>
                            source.Photos.FirstOrDefault(p => p.IsMain).Url);
                    })
                .ForMember(destination => destination.Age,
                    opt =>
                    {
                        opt.MapFrom(source =>
                            source.DateOfBirth.CalculateAge());
                    });
            CreateMap<AppUser, UserForDetailedDto>()
                .ForMember(destination => destination.PhotoUrl,
                    opt =>
                    {
                        opt.MapFrom(source =>
                            source.Photos.FirstOrDefault(p => p.IsMain).Url);
                    }).ForMember(destination => destination.Age,
                    opt =>
                    {
                        opt.MapFrom(source =>
                            source.DateOfBirth.CalculateAge());
                    });
            CreateMap<Photo, PhotosForDetailedDto>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<Photo, PhotoForUpdateDto>().ReverseMap();
            CreateMap<UserForUpdateDto, AppUser>();
            CreateMap<UserForRegisterDto, AppUser>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(destination => destination.SenderPhotoUrl,
                    opt =>
                    {
                        opt.MapFrom(source =>
                            source.Sender.Photos.FirstOrDefault(p => p.IsMain).Url);
                    })
                .ForMember(destination => destination.RecipientPhotoUrl,
                    opt =>
                    {
                        opt.MapFrom(source =>
                            source.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url);
                    });
            CreateMap<Message, MessageForUpdateDto>().ReverseMap();
        }
    }
}