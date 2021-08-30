using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace NadineStecklein.App_Start
{
        public static class WebApiConfig
        {
            public static void Register(HttpConfiguration config)
            {
                // Web API configuration and services
                var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;

                //This is what transforms all the Json into camelcase
                json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                // Web API routes
                config.MapHttpAttributeRoutes();

                config.Routes.MapHttpRoute(
                    name: "DefaultApi",
                    routeTemplate: "api/{controller}/{id}",
                    defaults: new { id = RouteParameter.Optional }
                );
            }
        }
    }