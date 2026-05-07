using CloudComputing.Data;
using CloudComputing.Data.DTO;
using CloudComputing.Data.Models;
using CloudComputing.Data.Responce;
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
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var user_id_s = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (user_id_s == null || !Guid.TryParse(user_id_s, out var user_id))
                return Unauthorized(new ApiError(ErrorCodes.Unauthorized, "You are unothorized to perform this action"));

            var user = await m_DbContext.Users.FindAsync(user_id);
            if (user == null)
                return NotFound(new ApiError(ErrorCodes.UserNotFound, "This user was not found"));

            return Ok(new UserResponce 
            { 
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] UserCreateDTO userCreateDTO)
        {
            //Safekeeping
            if (userCreateDTO.Username.Length > 128 ||
                userCreateDTO.Password.Length > 128 || 
                string.IsNullOrEmpty(userCreateDTO.Username) ||
                string.IsNullOrEmpty(userCreateDTO.Password))
                return BadRequest(new ApiError(ErrorCodes.UserInfoInvalid, "Bad user information provited"));

            if (await m_DbContext.Users.AnyAsync(u => u.Username == userCreateDTO.Username))
                return BadRequest(new ApiError(ErrorCodes.UserAlreadyExists));

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = userCreateDTO.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDTO.Password),
                Role = UserRoles.User
            };

            try
            {
                //Can throw in duplication
                m_DbContext.Users.Add(user);
                await m_DbContext.SaveChangesAsync();
            }
            catch
            {
                return BadRequest(new ApiError(ErrorCodes.UserInfoInvalid, "Username already in use"));
            }

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromQuery] string username)
        {
            var user_id_s = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (user_id_s == null || !Guid.TryParse(user_id_s, out var user_id))
                return Unauthorized(new ApiError(ErrorCodes.Unauthorized, "You are unothorized to perform this action"));

            var active_user = await m_DbContext.Users.FindAsync(user_id);
            if (active_user == null)
                return NotFound(new ApiError(ErrorCodes.UserNotFound, "This user was not found"));

            if (active_user.Username == username)
                return BadRequest(new ApiError(ErrorCodes.UserCannotDeleteSelf, "You cannot delete yourself"));

            var usr = await m_DbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (usr == null) return NotFound(new ApiError(ErrorCodes.UserNotFound, "This user was not found"));

            m_DbContext.Users.Remove(usr);
            await m_DbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("auth")]
        public async Task<IActionResult> Auth([FromBody] AuthRequestDTO authRequestDTO)
        {
            var user = await m_DbContext.Users.FirstOrDefaultAsync(u => u.Username == authRequestDTO.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(authRequestDTO.Password, user.PasswordHash))
                return Unauthorized(new ApiError(ErrorCodes.InvalidCredentials, "Invalid username or password"));

            var token = GenerateToken(user);

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(double.Parse(m_Configuration["Jwt:ExpiryMinutes"]!))
            });

            return Ok();
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok();
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(m_Configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: m_Configuration["Jwt:Issuer"],
                audience: m_Configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(m_Configuration["Jwt:ExpiryMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
