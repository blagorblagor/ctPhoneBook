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
        <title>Phone Book - New Account</title>

        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Cache-Control" content="no-cache">
        <meta http-equiv="Expires" content="Sat, 01 Dec 2001 00:00:00 GMT">
        
        <link rel="stylesheet" type="text/css" href="../jsAndCssSupport/modalSupport.css<%=versionJsCss%>" />      
        <script type="text/javascript" src="../jsAndCssSupport/ajaxSupport.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/modalSupport.js<%=versionJsCss%>"></script>
        
        <link rel="stylesheet" type="text/css" href="./newAccount.css<%=versionJsCss%>" />
        <script type="text/javascript" src="./newAccount.js<%=versionJsCss%>"></script>
        
    </head>
    
    <body>
        <div id='idCompanyNam' class='title companyTitle'>
            CT Phone Book
        </div>
        <div id='idNewAccount' class='title pageTitle'>
            New Account
        </div>
        <div id='idUserRow' class='row'>
            <div id='idUserLabel' class='rowLeft'>
                Username:
            </div>
            <div id='idUserNameDiv' class='rowRight' oninput='javascript:newAccount_main.changedUsername()'>
                <input id='idUserName' class='inputGeneral' type='text' autocomplete='off' maxlength='50' />
            </div>
        </div>
        <div id='idPasswordRow'  class='row'>
            <div id='idPasswordLabel' class='rowLeft'>
                Password:
            </div>
            <div id='idPasswordDiv' class='rowRight' oninput='javascript:newAccount_main.changedPassword()'>
                <input id='idPassword' class='inputGeneral' type='password' autocomplete='off' maxlength='50' />
            </div>
        </div>
        <div id='idPasswordReenteredRow'  class='row'>
            <div id='idPasswordReenteredDiv' class='rowLeft'>
                Reentered Password:
            </div>
            <div id='idPasswordReenteredDiv' class='rowRight' oninput='javascript:newAccount_main.changedReenteredPassword()'>
                <input id='idPasswordReentered' class='inputGeneral' type='password' autocomplete='off' maxlength='50' />
            </div>
        </div>
        <div id='idButtonLoginRow' class='row'>
            <div id='idButtonLoginRowLeft' class='rowLeft'>
            </div>
            <div id='idButtonCreateDiv' class='rowRight'>
                <button id='idButtonCreate' class='buttonCreate' onclick='javascript:newAccount_main.clickCreate()'>
                    Create
                </button>
            </div>
        </div>
        <div id='idError' class='row'>
            <div id='idErrorLeft' class='rowLeft'>
            </div>
            <div id='idErrorDiv' class='rowRight'>
                <div id='idRowError' class='rowError'>
                </div> 
            </div> 
        </div>
    </body>
    
</html>
