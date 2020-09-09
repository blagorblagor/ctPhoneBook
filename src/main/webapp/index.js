/* global ajaxSupport_main, modalSupport_main */

var index_main = {
    
    http: null,
    
    errorDiv: null,
    
    ////////////////////////////////////////////////////
    
    pageOnLoad: function() {
        var idAccountStr = window.localStorage.getItem("idAccount");
        if (idAccountStr !== null) {
            this.enterPhoneBook();
        }
    },
    
    enterPhoneBook: function() {
        window.location.href = './phones/phones.jsp';
    },
    
    ////////////////////////////////////////////////////
    
    clickLogin: function() {
        modalSupport_main.setComponentAccessibility(false);
        this.errorDiv = window.document.getElementById('idRowError');
        
        var usernameInput = window.document.getElementById('idUserName');
        var passwordInput = window.document.getElementById('idPassword');
        
        if (usernameInput.value === '') {
            this.setRowError('Username must be set.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        } else if (passwordInput.value === '') {
            this.setRowError('Password must be set.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        }
        
        var obj = {
            usernameObj: usernameInput.value,
            passwordObj: passwordInput.value
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.indexOnLoad;        
        this.http.onerror = this.indexOnError;        
        this.http.ontimeout = this.indexOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/login', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
    },
    
    indexOnLoad: function() {
        if (index_main.http.readyState === 4) {
            if (index_main.http.status === 200) {
                var json = JSON.parse(index_main.http.responseText);
                if (json.status !== "Success") {
                    index_main.setRowError(json.problemMessage);                    
                    modalSupport_main.setComponentAccessibility(true);
                    return;
                }
                
                var idAccountStr = json.idAccount.toString();
                window.localStorage.setItem("idAccount", idAccountStr);
                
                modalSupport_main.setComponentAccessibility(true);
                index_main.enterPhoneBook();
            } else {
                var errorMessage = 'Error on server (' + index_main.http.status + ')';
                index_main.setRowError(errorMessage);
                modalSupport_main.setComponentAccessibility(true);
            }
        }
    },
    
    indexOnError: function() {
        var errorMessage = 'Server is not found or it doeas not respond.';
        index_main.setRowError(errorMessage);
        modalSupport_main.setComponentAccessibility(true);
    },
    
    indexOnTimeout: function() {
        var errorMessage = 'Timeout is over.';
        index_main.setRowError(errorMessage);
        modalSupport_main.setComponentAccessibility(true);
    },
    
    ////////////////////////////////////////////////////
    
    clickNewUser: function() {
        window.location.href = "./newAccount/newAccount.jsp";
    },
    
    ////////////////////////////////////////////////////
    
    changeUsername: function() {
        this.clearRowError();
    },
    
    changePassword: function() {
        this.clearRowError();
    },
    
    ////////////////////////////////////////////////////
    
    setRowError: function(errorMessage) {
        var errorDiv = window.document.getElementById('idRowError');
        errorDiv.innerHTML = errorMessage;
        errorDiv.style.display = 'inline-block';
    },
    
    clearRowError: function() {
        var errorDiv = window.document.getElementById('idRowError');
        if (errorDiv.innerText.length > 0) {
            errorDiv.innerText = '';
            errorDiv.style.display = 'none';
        }
    }
    
};

