namespace CloudComputing.Data
{
    public enum ErrorCodes
    {
        ReportInvalid = 0,
        ReportTooBig,

        ReportNameInvalid,
        ReportNotFound,
    }

    public class ApiError(ErrorCodes errorCodes, string? message = null)
    {
        public ErrorCodes Code { get; init; } = errorCodes;
        public string? Message { get; init; } = message;
    }
}
