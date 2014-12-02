Form Authentication via Ajax Requests in AppBuilder Hybrid Application
=========================

An AppBuilder hybrid sample that uses ASP.Net forms authentication to control access to asmx ajax-enabled web service methods. The hybrid app will automatically deny access and take user to login page, when the forms authentication session has timed out but only when calling a protected web service method.

### About the Sample

To try out the sample, you can directly clone the repository in AppBuilder and start the **WebService** locally. 

##### There are several other things that you will need to consider:

* There is a page called 'Webform1.aspx' that allows you to do local testing within the ASP.Net web site for the web service methods.
* The valid credentials for the hybrid application are **mike**/**abcd**. Anything else will be considered invalid.
* You can see how the hybrid app works just like a regular ASP.Net app in [this video](http://screencast.com/t/uoE9qdBz). _Employees_ method of web service is a protected method, that lists the employees. After 1 minute, the user is taken to login screen.

##### Some other important things:

* In the hybrid application, a forms authentication cookie is being attached to the response object in the web service method LoginUser. This cookie will expire after 1 minute, which is the forms authentication session timeout in the sample. 
* In the web config of the back-end, we need  to include configuration for forms authentication, as well, as make the web service open to all using the location element (we will always perform a check within methods needing protected access to decide if user's forms authentication is still alive). 
* Enable the web service for httpget and httppost.
```xml
<?xml version="1.0"?>
<configuration>
  <connectionStrings/>
  <system.web>
    <compilation debug="false" targetFramework="4.0"/>
    <authentication mode="Forms">
      <forms loginUrl="Login.aspx" name=".ASPXFORMSAUTH" timeout="1"/>
    </authentication>
    <webServices>
      <protocols>
        <add name="HttpGet"/>
        <add name="HttpPost"/>
      </protocols>
    </webServices>
  </system.web>
  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true"/>
  </system.webServer>
  <location path="WebService1.asmx">
    <system.web>
      <authorization>
        <allow users="*"/>
      </authorization>
    </system.web>
  </location>
  <location path="WebForm1.aspx">
    <system.web>
      <authorization>
        <allow users="*"/>
      </authorization>
    </system.web>
  </location>
</configuration>
```
* When implementing web service methods that are going to allow only protected access, always return a type of object when you want to return a custom object or a value type. But if the web service method is not protected, then you don't need to follow this rule. **This is very important, since when user's form's authentication ticket has expired, we want the same method to return a special anonymous authentication object that tells the jQuery in the hybrid app, that the user is no more logged in.** 
* Call the web service method of _LoginUser_ to login and _LogoutUser_ to logout.
* Call the protected web service method of _Employees_ to get a List<Employee>.
* The sample has forms authentication timeout of 1 minute. So, after one minute of inactivity, the hybrid app will automatically take you to the login page on the mobile device.
* When calling a protected web service method in hybrid app, you need to do some special handling in jQuery ajax success method to determine if user is still logged in. This is as shown below:
```javascript
if (info.d.Authenticated === false) {
                    clearForm();
                    setMode("login");
                    $("#sessionEnded").html("Your session has ended. Please login again.");
                    $("#sessionEnded").show();
                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                    //do your normal processing
                }
```

### Special thanks to Sunil for providing the sample and letting us share it with the community!