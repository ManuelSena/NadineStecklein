using NadineStecklein.Models.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NadineStecklein.Services.Interfaces.Email
{
    public interface IGmailService
    {
        //void SendMultipleEmail(GmailContent model);
        void SendSingleEmail(GmailContent model);
    }
}
