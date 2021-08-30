using NadineStecklein.Models.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NadineStecklein.Services.Interfaces.Email
{
     public interface ISendGridService
    {
        Task<string> Send(SendGridContent model);
    }
}
