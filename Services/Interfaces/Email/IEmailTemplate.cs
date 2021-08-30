using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NadineStecklein.Services.Email.EmailTemplate;

namespace NadineStecklein.Services.Interfaces.Email
{
   public  interface IEmailTemplate
    {
        string CreateEmailBody(EmailBody body);
    }
}
