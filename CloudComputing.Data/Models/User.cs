namespace CloudComputing.Data.Models
{
    public class User
    {
        public required Guid Id { get; init; }

        public required string Username { get; init; }

        public required string PasswordHash { get; init; }
    }
}
