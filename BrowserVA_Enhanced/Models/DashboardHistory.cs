using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace BrowserVA_Enhanced.Models
{
    public class DashboardHistory
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Url { get; set; }
        [DisplayName("Dashboard Name")]
        public string DashboardName { get; set; }
        [DisplayName("Opened On")]
        public DateTime? OpenedOn { get; set; }
    }
}