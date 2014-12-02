using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Security.Permissions;
using System.Xml;
using System.Web.Services.Protocols;
using System.Web.Script.Services;
using System.Text;
using System.Web.Script.Serialization;
 
namespace WebServiceForHybridApp
{
    /// <summary>
    /// Summary description for WebService1
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]

    public class WebService1 : System.Web.Services.WebService 
    {

       /// <summary>
       /// For a web service method returning a custom object i.e. not a value type like string, int, bool,
       /// we need to always make sure that the return type is of object type.
       /// This is because we need to return an anonymous object when user's forms authentication ticket has expired
       /// which is not going to be the custom object type we would normally return from this application.
       /// </summary>
       /// <returns></returns>
        [WebMethod]
        [PrincipalPermission(SecurityAction.Assert, Unrestricted = true)]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public object Employees()
        {
            if (Context.Request.IsAuthenticated)
            {
                return GetAllEmployees();
            }
            else
            {
                //return an object that tells the hybrid app whether the user is still authenticated or his/her session has ended
                //we can always access this value by checking returnValue.d.Authenticated, where returnValue is the value we get
                //in success method of jQuery's call to this web service method
                return new { Authenticated = (Context.Request.IsAuthenticated) };
            }
        }
        private List<Employee> GetAllEmployees()
        {
            var employeees = new List<Employee>();
            employeees.Add(new Employee() { FirstName = "Sunil", LastName = "Dhaul", Age = 28, IsManager = true, YearsInJob = 6 });
            employeees.Add(new Employee() { FirstName = "Nikolay", LastName = "Rebello", Age = 35, IsManager = true, YearsInJob = 6 });
            employeees.Add(new Employee() { FirstName = "Mike", LastName = "Newton", Age = 32, IsManager = false, YearsInJob = 2 });
            employeees.Add(new Employee() { FirstName = "Paul", LastName = "Samath", Age = 24, IsManager = false, YearsInJob = 2 });
            return employeees;

        }

        /// <summary>
        /// This method is doing a simple check of credentials passed expecting mike/abcd as the credentials
        /// for a successful login.
        /// In real world, we would check against a database.
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [WebMethod]
        [PrincipalPermission(SecurityAction.Assert, Unrestricted = true)]
        [ScriptMethod(UseHttpGet = false, ResponseFormat = ResponseFormat.Json)]
        public bool LoginUser(string userName, string password)
        {
            bool authenticated = false;

            if (userName.ToLower() == "mike" && password.ToLower() == "abcd")//you can instead check credentials against a users table in database 
            {
                this.Context.Response.Cookies.Add(System.Web.Security.FormsAuthentication.GetAuthCookie(userName, false));
                authenticated = true;
            }
            return authenticated;
        }
        [WebMethod]
        [PrincipalPermission(SecurityAction.Assert, Unrestricted = true)]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public bool LogoutUser()
        {
            if (this.Context.Request.IsAuthenticated)
            {
                System.Web.Security.FormsAuthentication.SignOut();
                return true;
            }
            return false;
        }
        [WebMethod]
        [PrincipalPermission(SecurityAction.Assert, Unrestricted = true)]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
        public bool IsAuthenticated()
        {
            if (Context.Request.IsAuthenticated)
            {
                return true;
            }
            return false;
        }
     

        
    }
}
