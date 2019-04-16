using BrowserVA_Enhanced.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrowserVA_Enhanced.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        ApplicationDbContext _db = new ApplicationDbContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ViewDashboard(int id)
        {
            string _url = _db.DashboardHistory.Where(x => x.Id == id).Select(x => x.Url).FirstOrDefault();

            DashboardHistory model = new DashboardHistory();
            model.Url = _url;
            return View(model);
        }

        [HttpPost]
        public ActionResult Index(string url, string name)
        {
            DashboardHistory history = new DashboardHistory();
            history.Url = url;
            history.Username = User.Identity.Name;
            history.OpenedOn = DateTime.Now;
            history.DashboardName = name;
            _db.DashboardHistory.Add(history);
            _db.SaveChanges();
            return View();
        }

        public ActionResult History()
        {
            List<DashboardHistory> model = new List<DashboardHistory>();
            model = _db.DashboardHistory.Where(x=>x.Username == User.Identity.Name).ToList();
            ViewBag.Message = "Your application description page.";

            return View(model);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}