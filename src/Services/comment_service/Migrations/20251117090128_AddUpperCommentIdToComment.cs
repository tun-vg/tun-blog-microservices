using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace comment_service.Migrations
{
    /// <inheritdoc />
    public partial class AddUpperCommentIdToComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UpperCommentId",
                table: "Comments",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpperCommentId",
                table: "Comments");
        }
    }
}
