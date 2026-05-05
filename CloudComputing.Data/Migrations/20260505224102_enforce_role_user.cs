using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudComputing.Data.Migrations
{
    /// <inheritdoc />
    public partial class enforce_role_user : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Temporary col
            migrationBuilder.AddColumn<string>(
                name: "Role_new",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "User");

            //Convert 0/1 values to strings
            migrationBuilder.Sql(@"
                UPDATE ""Users"" 
                SET ""Role_new"" = CASE 
                    WHEN ""Role"" = '0' THEN 'User'
                    WHEN ""Role"" = '1' THEN 'Admin'
                    ELSE 'User'
                END
            ");

            //Drop old column
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            //Replace with new
            migrationBuilder.RenameColumn(
                name: "Role_new",
                table: "Users",
                newName: "Role");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Role_old",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"
                UPDATE ""Users""
                SET ""Role_old"" = CASE
                    WHEN ""Role"" = 'User'  THEN 0
                    WHEN ""Role"" = 'Admin' THEN 1
                    ELSE 0
                END
            ");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Role_old",
                table: "Users",
                newName: "Role");
        }
    }
}
