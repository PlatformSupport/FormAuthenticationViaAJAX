(function (global) {
    var $loginWrap,
    $logoutWrap,
    $username,
    $password,
    $loggedUser;

    function init() {
        $loginWrap = $("#login-wrap");
        $logoutWrap = $("#logout-wrap");
        $username = $("#login-username");
        $password = $("#login-password");
        $loggedUser = $("#logout-username");

        setMode("login");

        $username.on("keyup", checkEnter);
        $password.on("keyup", checkEnter);
        $("#login-reset").on("click", resetForm);
        $("#login-form").on("submit", login);
        $("#logout").on("click", logout);
        $("#callProtectedMethod").on("click", getEmployees);
        $("#sessionEnded").hide();
         
        $(document).on("pagebeforeshow", "#details-page", function () {
            //get from data - you put this here when the "a" wa clicked in the previous page
            var info = $(this).data("info");
            //string to put HTML in
            var info_view = "";
            info_view = '<div id="detailsHeader" class="ui-bar ui-bar-b">Employee Details</div>';
            //use for..in to iterate through object
            for (var key in info) {
                //Im using grid layout here.
                //use any kind of layout you want.
                //key is the key of the property in the object 
                //if obj = {name: 'k'}
                //key = name, value = k
                info_view += '<div class="ui-grid-a"><div class="ui-block-a"><div class="ui-bar field" style="font-weight : bold; text-align: left;">' + key + '</div></div><div class="ui-block-b"><div class="ui-bar value" style="width : 75%">' + info[key] + '</div></div></div>';
            }
            //add this to html
            //$(this).find("[data-role=content]").html("");
            $(this).find("[data-role=content]").html(info_view);
        });
    }

    $(document).on("deviceready", init);

    function resetForm(e) {
        e.preventDefault();
        e.stopPropagation();
        $username.val("");
        $password.val("");
        $("#sessionEnded").hide();
    }
    function clearForm() {
        $username.val("");
        $password.val("");
    }

    function setMode(mode) {
        if (mode === "login") {
            $loginWrap.show();
            $logoutWrap.hide();
        }
        else {
            $loginWrap.hide();
            $logoutWrap.show();
        }
    }

    function login(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        var username = $username.val().trim(),
        password = $password.val().trim();
        if (username === "" || password === "") {
            navigator.notification.alert("Both fields are required!",
                                         function () {
                                         },
                                         "Invalid Input",
                                         'OK');
        }
        else {
            $.mobile.loading('show');
            $("#sessionEnded").html("Your credentials are being verified. PLEASE WAIT...");
            $("#sessionEnded").show();
            CallLogin(username, password);
        }
    }

    function logout() {
        $.mobile.loading('show');
        CallLogout();
    }

    function checkEnter(e) {
        e.preventDefault();

        if (e.keyCode == 13) {
            $(e.target).blur();
            login();
        }
    }
    function getEmployees() {
        $.mobile.loading('show');
        CallGetEmployees();
    }
    function CallLogin(userName, password) {
        var serviceurl = "http://localhost:54805/WebService1.asmx/LoginUser";
        $.ajax({
            url: serviceurl,
            type: 'POST',
            async:true,
            cache:false,
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({ userName:  userName , password:  password }),
            dataType:"json",
            success: function (msg) {
                if (msg.d.toString() === 'true') {
                    $loggedUser.text(userName);
                    setMode("logout");
                    $("#sessionEnded").hide();
                    $.mobile.loading('hide');
                }
                else {
                    $("#sessionEnded").html("Invalid Credentials");
                    $("#sessionEnded").show();
                    $.mobile.loading('hide');
                }
            },
            error: function (error) {
                $("#sessionEnded").hide();
                $.mobile.loading('hide');
                alert('ERROR has occurred when calling Login!');
                alert(JSON.stringify(error));
            }
        });
    }

    function CallGetEmployees() {
        var serviceurl = "http://localhost:54805/WebService1.asmx/Employees";
        $.ajax({
            url: serviceurl,
            type: 'POST',
            async:true,
            cache:false,
            contentType: "application/json; charset=utf-8",
            data:  JSON.stringify({}),
            dataType:"json",
            success: function (info) {
                if (info.d.Authenticated === false) {
                    clearForm();
                    setMode("login");
                    $("#sessionEnded").html("Your session has ended. Please login again.");
                    $("#sessionEnded").show();
                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                    
                    //remove all but the header li item so we do not duplicate li items on databinding i.e appending to prof-list
                    $("#prof-list li").each(function (index) {
                        if (index > 0) {
                            $(this).remove();
                        }
                    });
                    //set up string for adding <li/>
                    var li = "";
                    //container for $li to be added
                    $.each(info.d, function (i, name) {
                        //add the <li> to "li" variable
                        //note the use of += in the variable
                        //meaning I'm adding to the existing data. not replacing it.
                        //store index value in array as id of the <a> tag
                        li += '<li><a href="#" id="' + i + '" class="info-go">' + name.FirstName + ' ' + name.LastName + '</a></li>';
                    });
                    
                    //append list to ul
                    $("#prof-list").append(li).promise().done(function () {
                        //wait for append to finish - thats why you use a promise()
                        //done() will run after append is done
                        //add the click event for the redirection to happen to #details-page
                        $(this).on("click", ".info-go", function (e) {
                            e.preventDefault();
                            //store the information in the next page's data
                            $("#details-page").data("info", info.d[this.id]);
                           
                            //you can create the html for listview items here itself (then you don't need to add data to details-page as in above line
                            //here we are using the approach of creating list view just before details-page is about to show (pagebeforeshow event)
                            /* var html = '';
                            html +="<p><h3>First Name</h3> : " +info[this.id].FirstName + "</p>";
                            html +="<p><h3>Last Name</h3> : " +info[this.id].LastName + "</p>";
                            html +="<p><h3>Age</h3> : " +info[this.id].Age + "</p>";
                            html +="<p><h3>Is Manager ?</h3> : " +info[this.id].IsManager + "</p>";
                            $('#details').html(html);*/
                            
                            //change the page # to second page. 
                            //Now the URL in the address bar will read index.html#details-page
                            //where #details-page is the "id" of the second page
                            //we're gonna redirect to that now using changePage() method
                            $.mobile.changePage("#details-page");
                        });
                        //refresh list to enhance its styling.
                        // $(this).listview("refresh");
                    });
                   
                    $.mobile.changePage("#info-page");
                    $("#prof-list").listview("refresh");
                }
            },
            error: function (error) {
                $.mobile.loading('hide');
                alert('ERROR has occurred when getting Employees!' + JSON.stringify(error));
            }
        });
    }
    
    function CallLogout() {
       var serviceurl = "http://localhost:54805/WebService1.asmx/LogoutUser";
        $.ajax({
            url: serviceurl,
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            success: function (msg) {
                clearForm();
                setMode("login");
                $.mobile.loading('hide');
            },
            error: function (error) {
                $.mobile.loading('hide');
                alert('ERROR has occurred when calling Logout!  ' + JSON.stringify(error));
            }
        });
    }
})(window);