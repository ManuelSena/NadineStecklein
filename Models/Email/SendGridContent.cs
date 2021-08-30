using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NadineStecklein.Models.Email
{
    public class SendGridContent:EmailContent
    {
        public List<EmailUserObj> FromList { get; set; }
        public string PlainTextContent { get; set; }
        public string HtmlContent { get; set; }
    }
}