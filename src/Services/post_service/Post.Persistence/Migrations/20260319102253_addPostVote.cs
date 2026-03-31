using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Post.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addPostVote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            // migrationBuilder.CreateTable(
            //     name: "category",
            //     columns: table => new
            //     {
            //         CategoryId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         Name = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4"),
            //         Slug = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4")
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_category", x => x.CategoryId);
            //     })
            //     .Annotation("MySql:CharSet", "utf8mb4");
            //
            // migrationBuilder.CreateTable(
            //     name: "post",
            //     columns: table => new
            //     {
            //         PostId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         Title = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4"),
            //         Slug = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4"),
            //         Content = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4"),
            //         AuthorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         CategoryId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         Approved = table.Column<bool>(type: "tinyint(1)", nullable: false),
            //         Point = table.Column<int>(type: "int", nullable: false),
            //         UpPoint = table.Column<int>(type: "int", nullable: false),
            //         DownPoint = table.Column<int>(type: "int", nullable: false),
            //         ViewCount = table.Column<int>(type: "int", nullable: false),
            //         ReadingTime = table.Column<double>(type: "double", nullable: false),
            //         Status = table.Column<byte>(type: "tinyint unsigned", nullable: false),
            //         CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
            //         UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_post", x => x.PostId);
            //         table.ForeignKey(
            //             name: "FK_post_category_CategoryId",
            //             column: x => x.CategoryId,
            //             principalTable: "category",
            //             principalColumn: "CategoryId",
            //             onDelete: ReferentialAction.Cascade);
            //     })
            //     .Annotation("MySql:CharSet", "utf8mb4");
            //
            // migrationBuilder.CreateTable(
            //     name: "tag",
            //     columns: table => new
            //     {
            //         TagId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         Name = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4"),
            //         Slug = table.Column<string>(type: "longtext", nullable: false)
            //             .Annotation("MySql:CharSet", "utf8mb4"),
            //         CategoryId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_tag", x => x.TagId);
            //         table.ForeignKey(
            //             name: "FK_tag_category_CategoryId",
            //             column: x => x.CategoryId,
            //             principalTable: "category",
            //             principalColumn: "CategoryId",
            //             onDelete: ReferentialAction.Cascade);
            //     })
            //     .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "post_vote",
                columns: table => new
                {
                    PostVoteId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PostId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TypeVote = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_post_vote", x => x.PostVoteId);
                    table.ForeignKey(
                        name: "FK_post_vote_post_PostId",
                        column: x => x.PostId,
                        principalTable: "post",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            // migrationBuilder.CreateTable(
            //     name: "post_tag",
            //     columns: table => new
            //     {
            //         PostTagId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         PostId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            //         TagId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_post_tag", x => x.PostTagId);
            //         table.ForeignKey(
            //             name: "FK_post_tag_post_PostId",
            //             column: x => x.PostId,
            //             principalTable: "post",
            //             principalColumn: "PostId",
            //             onDelete: ReferentialAction.Cascade);
            //         table.ForeignKey(
            //             name: "FK_post_tag_tag_TagId",
            //             column: x => x.TagId,
            //             principalTable: "tag",
            //             principalColumn: "TagId",
            //             onDelete: ReferentialAction.Cascade);
            //     })
            //     .Annotation("MySql:CharSet", "utf8mb4");
            //
            // migrationBuilder.CreateIndex(
            //     name: "IX_post_CategoryId",
            //     table: "post",
            //     column: "CategoryId");
            //
            // migrationBuilder.CreateIndex(
            //     name: "IX_post_tag_PostId",
            //     table: "post_tag",
            //     column: "PostId");
            //
            // migrationBuilder.CreateIndex(
            //     name: "IX_post_tag_TagId",
            //     table: "post_tag",
            //     column: "TagId");
            //
            migrationBuilder.CreateIndex(
                name: "IX_post_vote_PostId",
                table: "post_vote",
                column: "PostId");
            //
            // migrationBuilder.CreateIndex(
            //     name: "IX_tag_CategoryId",
            //     table: "tag",
            //     column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropTable(
            //     name: "post_tag");

            migrationBuilder.DropTable(
                name: "post_vote");

            // migrationBuilder.DropTable(
            //     name: "tag");
            //
            // migrationBuilder.DropTable(
            //     name: "post");
            //
            // migrationBuilder.DropTable(
            //     name: "category");
        }
    }
}
