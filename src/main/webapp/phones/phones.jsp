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
        <title>Phone Book - Contacts</title>

        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Cache-Control" content="no-cache">
        <meta http-equiv="Expires" content="Sat, 01 Dec 2001 00:00:00 GMT">
        
        <!-- **************************************************  -->
        
        <link rel="stylesheet" type="text/css" href="../jsAndCssSupport/slickGrid/slick.grid.css<%=versionJsCss%>"/>
        <link rel="stylesheet" type="text/css" href="../jsAndCssSupport/slickGrid/css/smoothness/jquery-ui-1.8.16.custom.css<%=versionJsCss%>"/>
        <link rel="stylesheet" type="text/css" href="../jsAndCssSupport/slickGrid/stil.css<%=versionJsCss%>"/>
        
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/lib/firebugx.js<%=versionJsCss%>"></script>
        
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/lib/jquery-1.7.min.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/lib/jquery-ui-1.8.16.custom.min.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/lib/jquery.event.drag-2.2.js<%=versionJsCss%>"></script>

        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/slick.core.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/slick.grid.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/slick.dataview.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/slickGrid/plugins/slick.rowselectionmodel.js<%=versionJsCss%>"></script>
        
        <!--  **************************************************  -->
        
        <link rel="stylesheet" type="text/css" href="../jsAndCssSupport/modalSupport.css<%=versionJsCss%>" />
        
        <script type="text/javascript" src="../jsAndCssSupport/ajaxSupport.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/slickGridSupport.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/accessories.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="../jsAndCssSupport/modalSupport.js<%=versionJsCss%>"></script>
        
        <!--  **************************************************  -->
        
        <link rel="stylesheet" type="text/css" href="./phones.css<%=versionJsCss%>" />
        <link rel="stylesheet" type="text/css" href="./phonesList.css<%=versionJsCss%>" />
        <link rel="stylesheet" type="text/css" href="./phonesAddModify.css<%=versionJsCss%>" />
        <link rel="stylesheet" type="text/css" href="./phonesOverview.css<%=versionJsCss%>" />
        
        <script type="text/javascript" src="./phonesGeometry.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="./phonesList.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="./phonesAddModify.js<%=versionJsCss%>"></script>
        <script type="text/javascript" src="./phonesOverview.js<%=versionJsCss%>"></script>
        
    </head>
    
    <body onload='javascript:phonesList_main.pageLoad();' onresize='javascript:phonesList_main.pageResize();'>
        
        <div id='idPageDiv' class='pageDiv'>
            
            <div id='idContactsOverview' class='formPhones'>
                <div id='idContactsDivButtonsOverview' class='phonesDivButtons'>
                    <button id='idButtonAddOverview' class='buttonsPhones' onclick='javascript:phonesList_main.clickOnListAdd();'>Add</button>
                    <button id='idButtonModifyOverview' class='buttonsPhones' disabled='true' onclick='javascript:phonesList_main.clickOnContactsModify();'>Edit</button>
                    <button id='idButtonDeleteOverview' class='buttonsPhones' disabled='true' onclick='javascript:phonesList_main.clickOnContactsDelete();'>Delete</button>
                    <button id='idButtonLogoutOverview' class='buttonsSpecials' onclick='javascript:accessories_main.logout();'>Logout</button>
                </div>
                
                <div id='idContactsDataTable' class='contactsDataTable'>
                </div>
            </div>
            
            <div id='idPhonesAddModify' class='formPhones'>
                <div id='idPhonesDivButtonsAddModify' class='phonesDivButtons'>
                    <button id='idButtonAdd' class='buttonsPhones' onclick='javascript:phonesAddModify_main.clickSaveAddChange();'>Save</button>
                    <button id='idButtonCancel' class='buttonsPhones' onclick='javascript:phonesAddModify_main.clickCancelAddChange();'>Cancel</button>
                    <button id='idButtonLogout' class='buttonsSpecials' onclick='javascript:accessories_main.logout();'>Logout</button>
                </div>
                <div id='idPhonesFormAddChange' class='formAddChange'>
                    <div id='idPhonesAddChangeTitle' class='titleFormAddChange'>
                    </div>
                    <div id='idPhonesFormInnerAddChange' class='formInnerAddChange'>
                        <div id='idName' class='elementDiv'>
                            <div id='idNameLabel' class='elementLabel'>
                                * Name:
                            </div>
                            <div id='idNameDiv' class='elementInputAdditional'>
                                <input id='idNameInput' class='inputOpstiUnos' type='text' autocomplete='off' maxlength="50"
                                 onkeyup='javascript:phonesAddModify_main.elementChanged(this, "idNameError");'/>
                            </div>
                            <div id='idNameError' class='elementError'>
                            </div>
                        </div>
                        <div id='idNickname' class='elementDiv'>
                            <div id='idNicknameLabel' class='elementLabel'>
                                Nickname:
                            </div>
                            <div id='idNicknameInputDiv' class='elementInputAdditional'>
                                <input id='idNicknameInput' class='inputOpstiUnos' type='text' autocomplete='off' maxlength="50" />
                            </div>
                            <div id='idNicknameError' class='elementError'>
                            </div>
                        </div>
                        <div id='idSurname' class='elementDiv'>
                            <div id='idSurnameLabel' class='elementLabel'>
                                Surname:
                            </div>
                            <div id='idSurnameInputDiv' class='elementInputAdditional'>
                                <input id='idSurnameInput' class='inputOpstiUnos' type='text' autocomplete='off' maxlength="50" />
                            </div>
                            <div id='idSurnameError' class='elementError'>
                            </div>
                        </div>
                        <div id='idPhone' class='elementDiv'>
                            <div id='idPhoneLabel' class='elementLabel'>
                                * Phone:
                            </div>
                            <div id='idPhoneInputDiv' class='elementInputAdditional'>
                                <input id='idPhoneInput' class='inputOpstiUnos' autocomplete='off' type='text' maxlength="25"
                                 onkeyup='javascript:phonesAddModify_main.elementChanged(this, "idPhoneError");'/>
                            </div>
                            <div id='idPhoneError' class='elementError'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    </body>
    
</html>
