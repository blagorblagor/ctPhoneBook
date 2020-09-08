/* 
    Created on : Aug 28, 2019, 6:37:48 PM
    Author     : goran
*/

/* global accessories_main */

var ajaxSupport_main = { 
    
    siteRoot: '/ctPhoneBook', //Must be the same as that one in context.xml
    
    httpTimeout: 30000, // 30 sec.
    
    createHTTP: function() {
        var http;
        if (window.XMLHttpRequest) {
            http = new XMLHttpRequest();
        } else if(window.ActiveXObject) {
            http = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        return http;
    }
    
};
