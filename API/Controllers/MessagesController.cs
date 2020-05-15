using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Helpers;
using AutoMapper;
using Data;
using Data.Dtos;
using Data.Helpers;
using Data.Repository.Interfaces;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users/[controller]")]
    [ServiceFilter(typeof(LogUserActivity))]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        private readonly IUsersRepository _usersRepository;

        public MessagesController(
            IDatingRepository datingRepository, IMapper mapper, IUsersRepository usersRepository)
        {
            _datingRepository = datingRepository;
            _mapper = mapper;
            _usersRepository = usersRepository;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(string id)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var messageFromRepo = await _datingRepository.GetMessage(id);
            if (messageFromRepo == null) return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser([FromQuery] RequestQueryMessageParams messageParams)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            messageParams.UserId = currentUser.Id;

            var messagesFromRepo = await _datingRepository.GetMessagesForUser(messageParams);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize,
                messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(string recipientId)
        {
            _ = recipientId ?? throw new ArgumentNullException(nameof(recipientId));

            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var messagesFromRepo = await _datingRepository.GetMessageThread(recipientId, currentUser.Id);
            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(MessageForCreationDto messageForCreationDto)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            messageForCreationDto.SenderId = currentUser.Id;

            var recipient = await _usersRepository.GetUser(messageForCreationDto.RecipientId);
            if (recipient == null) return BadRequest("Problem sent message.");

            var message = _mapper.Map<Message>(messageForCreationDto);
            message.Id = Guid.NewGuid().ToString();

            _datingRepository.Add(message);
            if (await _datingRepository.Save())
            {
                var messageToReturn = _mapper.Map<MessageForCreationDto>(message);
                return CreatedAtRoute("GetMessage", new {id = message.Id}, messageToReturn);
            }

            throw new Exception("Creating the message failed on save.");
        }
    }
}