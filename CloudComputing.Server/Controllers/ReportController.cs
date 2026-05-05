using Microsoft.AspNetCore.Mvc;

namespace CloudComputing.Server.Controllers
{
    [ApiController]
    [Route("api/v1/reports")]
    public class ReportController(IWebHostEnvironment webHostEnvironment) : ControllerBase
    {
        private readonly IWebHostEnvironment m_WebHostEnv = webHostEnvironment;

        private string UploadDirectory => Path.Combine(m_WebHostEnv.ContentRootPath, "uploads");

        [HttpGet("{filename}")]
        public IActionResult Get(string filename)
        {
            //Verify that the path dosn't target any other file
            if (Path.IsPathRooted(filename))
                return BadRequest(new ApiError(ErrorCodes.ReportNameInvalid, "Invalid report name"));

            //Resolve path
            var report_path = Path.GetFullPath(Path.Combine(UploadDirectory, filename));

            //Verify the resolved path is actually inside the uploads folder
            if (!report_path.StartsWith(UploadDirectory + Path.DirectorySeparatorChar))
                return BadRequest(new ApiError(ErrorCodes.ReportNameInvalid, "Invalid report name"));

            if (!System.IO.File.Exists(report_path))
                return NotFound(new ApiError(ErrorCodes.ReportNotFound, "Report not found"));

            var content = System.IO.File.ReadAllText(report_path);
            return Ok(content);
        }

        [HttpPost("upload")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> Post(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new ApiError(ErrorCodes.ReportInvalid, "Uploaded report is empty"));

            if (file.Length > 10 * 1024 * 1024)
                return BadRequest(new ApiError(ErrorCodes.ReportTooBig, "Uploaded report is too bid"));

            //Resolve path
            var report_path = Path.GetFullPath(Path.Combine(UploadDirectory, file.FileName));

            //Verify the resolved path is actually inside the uploads folder
            if (!report_path.StartsWith(UploadDirectory + Path.DirectorySeparatorChar))
                return BadRequest(new ApiError(ErrorCodes.ReportNameInvalid, "The uploaded report name is not valid"));

            Directory.CreateDirectory(UploadDirectory);
            using var stream = System.IO.File.Create(report_path);
            await file.CopyToAsync(stream);

            return Created();
        }
    }
}
