using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NadineStecklein.Models.Response
{
    public class ItemResponse<T> : BaseResponse
    {
        public T Item { get; set; }
    }
}