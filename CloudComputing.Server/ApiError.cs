namespace CloudComputing.Server
{
    public enum ErrorCodes
    {
        ReportInvalid = 0,
        ReportTooBig,

        ReportNameInvalid,
        ReportNotFound,

        InvalidCredentials,
        Unauthorized,
        OperationForbiden,

        UserAlreadyExists,
        UserNotFound,
        UserInfoInvalid,
        UserCannotDeleteSelf
    }

    public class ApiError(ErrorCodes errorCodes, string? message = null)
    {
        public ErrorCodes Code { get; init; } = errorCodes;
        public string? Message { get; init; } = message;
    }
}
