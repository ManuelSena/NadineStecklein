using NadineStecklein.Services.Interfaces.Email;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace NadineStecklein.Services.Email
{
    public enum EmailFileType { REGISTER, FORGOTPW, CAMPAIGN, SUBSCRIPTION, AUTOSUBSCRIPTION }
    public class EmailTemplate : IEmailTemplate
    {
        bool isLocal = HttpContext.Current.Request.IsLocal;
        string template;
        string css;
        public class EmailBody
        {
            public EmailFileType TemplateType { get; set; }
            public string Token { get; set; }
            public int LastFour { get; set; }
            public double Sum { get; set; }
            public double Price { get; set; }
            public DateTime Date { get; set; }
            public string StripeEmail { get; set; }
            public string CardType { get; set; }
            public int Invoice { get; set; } //invoice no.
            public DateTime CreatedDate { get; set; } // paid date
        }
        EmailBody eb = new EmailBody();
        public string CreateEmailBody(EmailBody eb)
        {
            string path = "";
            switch (eb.TemplateType)
            {
                case EmailFileType.FORGOTPW:
                    path = "/Content/EmailTemplate/ForgotPassword.html";
                    break;
                case EmailFileType.REGISTER:
                    path = "/Content/EmailTemplate/register.html";
                    break;
                case EmailFileType.SUBSCRIPTION:
                    path = "/Content/EmailTemplate/Subscription.html";
                    break;
                case EmailFileType.CAMPAIGN:
                    path = "/Content/EmailTemplate/Campaign.html";
                    break;
                case EmailFileType.AUTOSUBSCRIPTION:
                    path = "/Content/EmailTemplate/AutoSubscription.html";
                    break;
                default:
                    path = "/Content/EmailTemplate/Default.html";
                    break;
            }
            using (StreamReader style = new StreamReader(HostingEnvironment.MapPath("/Content/EmailTemplate/StyleSheet1.css")))
            {
                css = style.ReadToEnd();
            }
            using (StreamReader reader = new StreamReader(HostingEnvironment.MapPath(path)))
            {
                template = reader.ReadToEnd();
            }
            DateTime date = DateTime.Now;
            string url = (isLocal == true ? "http://localhost:3024/" : "https://teamprospect.azurewebsites.net/");
            template = template.Replace("{css}", css).Replace("{url}", url).Replace("{token}", eb.Token).Replace("{invoice}", eb.Invoice.ToString()).Replace("{date}", date.ToString()).Replace("{card}", eb.CardType).Replace("{price}", eb.Price.ToString()).Replace("{lastFour}", eb.LastFour.ToString());
            return template;
        }
    }
}