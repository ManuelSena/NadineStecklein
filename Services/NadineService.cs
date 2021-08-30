using Nadine.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace NadineStecklein.Services
{
        public class NadineService : BaseService, INadineService
        {
            public List<Nadine> ReadAll()
            {
                return Adapter.LoadObject<Nadine>("dbo.Nadine_SelectAll");
            }

            //public Elicit ReadyById(int id)
            //{
            //    return Adapter.LoadObject<Elicit>(
            //        "Project_ToDoList_SelectById",
            //        new[] { SqlDbParameter.Instance.BuildParameter("@Id", id, System.Data.SqlDbType.Int) }).FirstOrDefault();
            //}

            //public int Post(ElicitAddRequest model)
            //{
            //    int id = 0;
            //    Adapter.ExecuteQuery("Project_ToDoList_Insert",
            //        new[]
            //        {
            //        SqlDbParameter.Instance.BuildParameter("@typeName", model.TypeName, SqlDbType.NVarChar),
            //        SqlDbParameter.Instance.BuildParameter("@details", model.Details, SqlDbType.NVarChar),
            //        SqlDbParameter.Instance.BuildParameter("@Id", 0, System.Data.SqlDbType.Int, 0, ParameterDirection.Output),
            //        },
            //        (parameters =>
            //        {
            //            id = parameters.GetParamValue<int>("@Id");
            //        }));
            //    return id;
            //}

            //public int Put(ElicitUpdateRequest model)
            //{
            //    int id = 0;
            //    Adapter.ExecuteQuery("Project_ToDoList_Update",
            //        new[]
            //        {
            //        SqlDbParameter.Instance.BuildParameter("@TypeName", model.TypeName, SqlDbType.NVarChar),
            //        SqlDbParameter.Instance.BuildParameter("@Details", model.Details, SqlDbType.NVarChar),
            //        SqlDbParameter.Instance.BuildParameter("@Id", model.Id, SqlDbType.Int),
            //        },
            //        (parameters =>
            //        {
            //            id = parameters.GetParamValue<int>("@Id");
            //        }));
            //    return id;
            //}

            //public int Delete(int id)
            //{
            //    Adapter.ExecuteQuery("Project_ToDoList_Delete",
            //        new[]
            //        {SqlDbParameter.Instance.BuildParameter("@Id", id, SqlDbType.Int)
            //        });
            //    return id;
            //}
        }
        //}
//    }
//}
}