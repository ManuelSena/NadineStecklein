using DbAccess.DbAdapter;
using LinqToDB.DataProvider;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Nadine.Services
{
    public class BaseService
    {

        public IDataProvider DataProvider { get; set; }

        public DbAdapter Adapter
        {
            get
            {
                return new DbAdapter(new SqlCommand(),
                    new SqlConnection("Data Source=elicit.database.windows.net; Initial Catalog=ElicitInc; Persist Security Info=False; User ID=mrmanuel13; Password=Joker13ms3!; MultipleActiveResultSets=False; Encrypt=True; TrustServerCertificate=False; Connection Timeout=30;"));

            }
        }

    }
}