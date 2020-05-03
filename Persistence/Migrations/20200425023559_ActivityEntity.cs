using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class ActivityEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropPrimaryKey(
            //     name: "PK_Value",
            //     table: "Value");

            // migrationBuilder.RenameTable(
            //     name: "Value",
            //     newName: "Values");

            // migrationBuilder.AddPrimaryKey(
            //     name: "PK_Values",
            //     table: "Values",
            //     column: "Id");

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    City = table.Column<string>(nullable: true),
                    Venue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");

            // migrationBuilder.DropPrimaryKey(
            //     name: "PK_Values",
            //     table: "Values");

            // migrationBuilder.RenameTable(
            //     name: "Values",
            //     newName: "Value");

            // migrationBuilder.AddPrimaryKey(
            //     name: "PK_Value",
            //     table: "Value",
            //     column: "Id");
        }
    }
}
