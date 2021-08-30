using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NadineStecklein.Models.Email
{
    public class GmailContent:EmailContent

    {
        public string GmailFrom { get; set; }
        public string[] EmailToCollection { get; set; }
    }
}