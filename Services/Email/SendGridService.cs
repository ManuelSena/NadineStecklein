//using NadineStecklein.Models.Email;
//using NadineStecklein.Services.Interfaces.Email;
//using SendGrid;
//using SendGrid.Helpers.Mail;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;

//namespace NadineStecklein.Services.Email
//{
//    public class SendGridService : ISendGridService
//    {
//        public async Task<string> Send(SendGridContent model)
//        {
//            //API Key to use SendGrid Mail Service.
//            string apiKey = AppSettingConfig.Instance.GetByAppKey("Sendgrid apiKey");
//            // client returns Interface to the SendGrid REST API
//            var client = new SendGridClient(apiKey);
//            //Email Content
//            EmailAddress From = new EmailAddress(model.From.Email, model.From.Name);
//            EmailAddress To = new EmailAddress(model.To.Email, model.To.Name);
//            var Message = MailHelper.CreateSingleEmail(From, To, model.Subject, model.PlainTextContent, model.HtmlContent);
//            var response = await client.SendEmailAsync(Message);
//            return response.StatusCode.ToString();
//        }
//    }
//}