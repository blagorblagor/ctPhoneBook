/* 
    Created on : Aug 29, 2019, 8:10:48 PM
    Author     : goran
*/

/* global ajaxSupport_main, modalSupport_main */

var index_main = {
    
    ////////////////////////////////////////////////////
    
    clickLogin: function() {
        window.alert('Under construction');
    },
    
    ////////////////////////////////////////////////////
    
    clickNewUser: function() {
        window.alert('Under construction');
    },
    
    ////////////////////////////////////////////////////
    
    changeUsername: function() {
        this.clearRowError();
    },
    
    changePassword: function() {
        this.clearRowError();
    },
    
    clearRowError: function() {
        var errorDiv = window.document.getElementById('idRowError');
        if (errorDiv.innerText.length > 0) {
            errorDiv.innerText = '';
            errorDiv.style.display = 'none';
        }
    }
    
};

