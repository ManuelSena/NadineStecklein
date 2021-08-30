using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NadineStecklein.Models.Requests.Email
{
    public class SendQuestionRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Topic { get; set; }
        [Required]
        public string Message { get; set; }
    }
}