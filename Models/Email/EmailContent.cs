using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NadineStecklein.Models.Email
{
    public class EmailContent
    {
        public EmailUserObj From { get; set; }
        public EmailUserObj To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}