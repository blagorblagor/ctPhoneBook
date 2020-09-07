<%-- 
    Document   : index
    Created on : Sep 7, 2020, 9:01:02 PM
    Author     : goran
--%>

<%@page import="rs.co.ct.ctPhoneBook.accessories.PseudoVersion"%>
<%
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Cache-Control", "no-cache");
    response.setDateHeader("Expires", 0);
    
    String versionJsCss = PseudoVersion.GetPseudoVersion().getPseudoVersionJsCss();
%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Phone Book - Login</title>

        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Cache-Control" content="no-cache">
        <meta http-equiv="Expires" content="Sat, 01 Dec 2001 00:00:00 GMT">
        
        <link rel="stylesheet" type="text/css" href="./jsAndCssSupport/modalSupport.css<%=versionJsCss%>" />      
        <script type="text/javascript" src="./jsAndCssSupport/ajaxSupport.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="./jsAndCssSupport/modalSupport.js<%=versionJsCss%>"></script>
        
        <link rel="stylesheet" type="text/css" href="./index.css<%=versionJsCss%>" />
        <script type="text/javascript" src="./index.js<%=versionJsCss%>"></script>
        
    </head>
    
    <body>
        <div id='idCompanyNam' class='title companyTitle'>
            CT Phone Book
        </div>
        <div id='idLogin' class='title pageTitle'>
            Login
        </div>
        <div id='idUserRow' class='row'>
            <div id='idKorisnikLabela' class='rowLeft'>
                Username:
            </div>
            <div id='idUserName' class='rowRight' oninput='javascript:index_main.changeUsername()'>
                <input id='idKorisnickoIme' class='inputGeneral' type="text" autocomplete='off' />
            </div>
        </div>
        <div id='idPasswordRow'  class='row'>
            <div id='idSifraLabela' class='rowLeft'>
                Password:
            </div>
            <div id='idPassword' class='rowRight' oninput='javascript:index_main.changePassword()'>
                <input id='idSifra' class='inputOpstiUnos' type="password" autocomplete='off' />
            </div>
        </div>
        <div id='idButtonLoginRow' class='row'>
            <div id='idButtonLoginRowLeft' class='rowLeft'>
            </div>
            <div id='idButtonLoginDiv' class='rowRight'>
                <button id='idButtonLogin' class='dugmeLogovanje' onclick='javascript:index_main.clickLogin()'>
                    Login
                </button>
            </div>
        </div>
        <div id='idButtonNewAccountRow' class='row'>
            <div id='idButtonNewAccountRowLeft' class='rowLeft'>
            </div>
            <div id='idButtonNewAccountDiv' class='rowRight'>
                <button id='idButtonNewAccount' class='dugmeLogovanje' onclick='javascript:index_main.clickNewUser()'>
                    Create New Account
                </button>
            </div>
        </div>
        <div id='idRowError' class='rowError'>
        </div>        
    </body>
    
</html>
