using NadineStecklein.Models.Email;
using NadineStecklein.Services.Interfaces.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace NadineStecklein.Services.Email
{
    public class GmailService : IGmailService
    {
        public GmailService() { }
        public void SendSingleEmail(GmailContent model)
        {
            string From = "manny@elicit.us";
            string GmailPassword = "Exc%eN0srQ*7!";
            try
            {
                SmtpClient smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new NetworkCredential(From, GmailPassword),
                    Timeout = 3000
                };
                MailMessage message = new MailMessage(From, model.To.Email, model.Subject, model.Body);
                message.IsBodyHtml = true;
                smtp.Send(message);
            }
            catch { }
        }
        //public void SendMultipleEmail(GmailMessage model)
        //public void SendMultipleEmail(GmailContent model)
        //{
        //    try
        //    {
        //        /*WE use smtp sever we specified above to send the message(MailMessage message)*/
        //        for (int i = 0; i < model.EmailToCollection.Length; i++)
        //        {
        //            string arr = string.Empty;
        //            var EachEmail = model.EmailToCollection[i];
        //            arr = (EachEmail);
        //            model.To = new EmailUserObj { Email = arr };
        //            SendSingleEmail(model);
        //        }
        //    }
        //    catch
        //    {
        //    }
        //}
    }

}