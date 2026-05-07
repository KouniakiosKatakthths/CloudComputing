namespace CloudComputing.Data.Responce
{
    public class UserResponce
    {
        public required Guid Id { get; init; }

        public required string Username { get; init; }

        public required UserRoles Role { get; init; }
    }
}
