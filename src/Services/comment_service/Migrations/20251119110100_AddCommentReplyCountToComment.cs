using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace comment_service.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentReplyCountToComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CommentReplyCount",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentReplyCount",
                table: "Comments");
        }
    }
}
