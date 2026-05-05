using CloudComputing.Data;
using CloudComputing.Data.DTO;
using CloudComputing.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CloudComputing.Server.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController(AppDbContext db, IConfiguration config) : ControllerBase
    {
        private readonly AppDbContext m_DbContext = db;
        private readonly IConfiguration m_Configuration = config;

        [Authorize]
        [HttpGet("{user_id}")]
        public IActionResult Get(Guid user_id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] UserCreateDTO userCreateDTO)
        {
            if (await m_DbContext.Users.AnyAsync(u => u.Username == userCreateDTO.Username))
                return BadRequest(new ApiError(ErrorCodes.UserAlreadyExists));

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = userCreateDTO.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDTO.Password)
            };

            m_DbContext.Users.Add(user);
            await m_DbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("auth")]
        public async Task<IActionResult> Auth([FromBody] AuthRequestDTO authRequestDTO)
        {
            var user = await m_DbContext.Users.FirstOrDefaultAsync(u => u.Username == authRequestDTO.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(authRequestDTO.Password, user.PasswordHash))
                return Unauthorized(new ApiError(ErrorCodes.InvalidCredentials));

            var token = GenerateToken(user);
            return Ok(new { token });
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            throw new NotImplementedException();
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(m_Configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
        };

            var token = new JwtSecurityToken(
                issuer: m_Configuration["Jwt:Issuer"],
                audience: m_Configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(m_Configuration["Jwt:ExpiryHours"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
