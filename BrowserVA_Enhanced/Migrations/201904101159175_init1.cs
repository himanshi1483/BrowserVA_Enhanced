namespace BrowserVA_Enhanced.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.DashboardHistories", "DashboardName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.DashboardHistories", "DashboardName");
        }
    }
}
