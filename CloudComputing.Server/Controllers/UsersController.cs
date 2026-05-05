using Microsoft.AspNetCore.Mvc;

namespace CloudComputing.Server.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController
    {
        [HttpGet("{user_id}")]
        public IActionResult Get(Guid user_id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        [HttpPost("create")]
        public IActionResult Create(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        [HttpPost("auth")]
        public IActionResult Auth(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            throw new NotImplementedException();
        }
    }
}
