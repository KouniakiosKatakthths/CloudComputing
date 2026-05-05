using Microsoft.AspNetCore.Mvc;

namespace CloudComputing.Server.Controllers
{
    [ApiController]
    [Route("api/v1/reports")]
    public class ReportController : ControllerBase
    {
        [HttpGet("{filename:string}")]
        public IActionResult Get(string filename)
        {
            throw new NotImplementedException();
        }
    }
}
