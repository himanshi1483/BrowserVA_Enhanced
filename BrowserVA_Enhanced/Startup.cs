using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(BrowserVA_Enhanced.Startup))]
namespace BrowserVA_Enhanced
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
