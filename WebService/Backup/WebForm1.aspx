<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="WebApplicationClient1.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title></title>
        <script src="Scripts/jQuery.js" type="text/javascript"></script>
    </head>
    <body>
        <form id="form1" runat="server">
            <div>
                <asp:ScriptManager ID="sm1" runat="server">
                   
                </asp:ScriptManager>
                   <input type="button" value="Call Web Service Method that is Protected"  onclick="CallGetEmployees();  return false;" />
                <script type="text/javascript">

                    $(document).ready(function () {
                        CallGetHello('mike', 'abcd');
                        
                    });

                    function CallGetHello(userName, password) {

                        var serviceurl = "http://localhost:54805/WebService1.asmx/LoginUser";
                        $.ajax({
                            url: serviceurl,
                            type: 'POST',
                            //crossDomain: true,
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({ userName: userName, password:   password  }),
                            dataType: "json",
                            success: function (msg) {
                                alert('Cross-Domain Web service call succeeded. We will now call a protected method on the web service. ' + msg.d);
                                       if (msg.d.toString() === 'true') {
                                           CallGetEmployees(); 
                                    }
                                    else {
                                        alert('Invalid Credentials');   
                                }
                            },
                            error: function (error) { alert('ERROR has occurred!'); alert(JSON.stringify(error)) }
                        });

                    }

                    function CallGetEmployees() {

                        var serviceurl = "http://localhost:54805/WebService1.asmx/Employees";
                        $.ajax({
                            url: serviceurl,
                            type: 'POST',
                            //crossDomain: true,
                            contentType: "application/json; charset=utf-8",
                            data:  JSON.stringify({}),
                            dataType: "json", //"jsonp",
                            success: function (msg) {
                                if (msg.Authenticated) {
                                    alert('Cross-Domain Web service call succeeded' + JSON.stringify(msg) + ' ; ' + msg.Authenticated);
                                }
                                else {
                                    alert('Cross-Domain Web service call succeeded' + JSON.stringify(msg) );
                                }
                            },
                            //                            error: function (xhr, status, error) {
                            //                                // Boil the ASP.NET AJAX error down to JSON.
                            //                                var err = eval("(" + xhr.responseText + ")");

                            //                                // Display the specific error raised by the server (e.g. not a
                            //                                //   valid value for Int32, or attempted to divide by zero).
                            //                                alert(err.Message);
                            //                            }
                            error: function (error) { alert('ERROR has occurred!'); if (JSON) { alert(JSON.stringify(error)) } }
                        });

                    }
//                    function pageLoad() {
//                        alert('About to call web service');
//                        AJAXEnabledWebService1.WebService1.GetHello("sunil", "abcd", OnSuccess, OnFailed);
//                    }
//                    function OnSuccess(result) {
//                        alert(result);
//                        try {
//                            AJAXEnabledWebService1.WebService1.GetEmployees(OnSuccess1, OnFailed);
//                        }
//                        catch (e) {
//                            alert('error = ' + e);
//                        }
//                    }
//                    function OnFailed(error) {
//                        alert('ERROR occurred ! ' + error.get_message());
//                    }
//                    function OnSuccess1(result) {
//                        alert(result);
//                    }
//                    function callWS() {
//                        AJAXEnabledWebService1.WebService1.GetEmployees(OnSuccess1, OnFailed);
//                    }
                </script>
            </div>
        </form>
    </body>
</html>
