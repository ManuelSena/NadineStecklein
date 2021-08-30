//using Nadine.Services;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.SqlClient;
//using System.Linq;
//using System.Web;

//namespace NadineStecklein.Services.Tools
//{
//    public sealed class AppSettingConfig : BaseService
//    {
//        private static readonly AppSettingConfig _instance = new AppSettingConfig();
//        private AppSettingConfig() { }
//        static AppSettingConfig() { }
//        public static AppSettingConfig Instance { get { return _instance; } }
//        public string GetByAppKey(string keyName)
//        {
//            //CALL THE DATABASE HERE TO GET THE APPSETTING KEY VALUE BY KEY NAME HERE
//            AppSetting item = new AppSetting();
//            DataProvider.ExecuteCmd("dbo.Apps_AppSetting_SelectByName",
//                inputParamMapper: delegate (SqlParameterCollection paramCollection)
//                {
//                    paramCollection.AddWithValue("@keyName", keyName);
//                },
//                singleRecordMapper: delegate (IDataReader reader, short set)
//                {
//                    item = (DataMapper<AppSetting>.Instance.MapToObject(reader));
//                }
//                );
//            return item.AppKeyValue;
//        }
//    }
//}