using NadineStecklein.Models.Email;
using NadineStecklein.Models.Requests.Email;
using NadineStecklein.Services.Interfaces.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace NadineStecklein.Controllers.api.Email
{
        [AllowAnonymous]
        [RoutePrefix("api/sendquestions")]
        public class SendQuestionController : ApiController
        {
            IGmailService _gmailService;
            public SendQuestionController(IGmailService gmailService)
            {
                _gmailService = gmailService;
            }
            [Route(), HttpPost]
            public IHttpActionResult SendQuestion(SendQuestionRequest model)
            {
                try
                {
                    _gmailService.SendSingleEmail(new GmailContent
                    {
                        To = new EmailUserObj { Email = "manny@elicit.us", Name="Manuel Sena" },
                        Subject = model.Topic,
                        Body = "From: " + model.Email + model.Message
                    });
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
}