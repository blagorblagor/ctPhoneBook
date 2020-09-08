/* global ajaxSupport_main, modalSupport_main */

var newAccount_main = {
    
    http: null,
    
    ////////////////////////////////////////////////////
    
    clickCreate: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var usernameInput = window.document.getElementById('idUserName');
        var passwordInput = window.document.getElementById('idPassword');
        var reenteredPasswordInput = window.document.getElementById('idPasswordReentered');
        
        if (usernameInput.value === '') {
            this.setRowError('Username must be set.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        } else if (passwordInput.value.length < 8) {
            this.setRowError('Username must have 8 characters at least.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        } else if (passwordInput.value === '') {
            this.setRowError('Password must be set.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        } else if (passwordInput.value.length < 10) {
            this.setRowError('Password must have 10 characters at least.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        } else if (passwordInput.value !== reenteredPasswordInput.value ) {
            this.setRowError('Reentered password does not match entered passwored.');
            modalSupport_main.setComponentAccessibility(true);
            return;
        }
        
        var obj = {
            usernameObj: usernameInput.value,
            passwordObj: passwordInput.value
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.newAccountOnLoad;        
        this.http.onerror = this.newAccountOnError;        
        this.http.ontimeout = this.newAccountOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/newAccount', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
    },
    
    newAccountOnLoad: function() {
        if (newAccount_main.http.readyState === 4) {
            if (newAccount_main.http.status === 200) {
                var json = JSON.parse(newAccount_main.http.responseText);
                if (json.status !== "Success") {
                    this.setRowError(json.problemMessage);                    
                    modalSupport_main.setComponentAccessibility(true);
                    return;
                }
                
                modalSupport_main.setComponentAccessibility(true);
                window.location.href = '../index.jsp';
            } else {
                var errorMessage = 'Error on server (' + newAccount_main.http.status + ')';
                this.setRowError(errorMessage);
                modalSupport_main.setComponentAccessibility(true);
            }
        }
    },
    
    newAccountOnError: function() {
        var errorMessage = 'Server is not found or it doeas not respond.';
        this.setRowError(errorMessage);
        modalSupport_main.setComponentAccessibility(true);
    },
    
    newAccountOnTimeout: function() {
        var errorMessage = 'Timeout is over.';
        this.setRowError(errorMessage);
        modalSupport_main.setComponentAccessibility(true);
    },
    
    ////////////////////////////////////////////////////
    
    changedUsername: function() {
        this.clearRowError();
    },
    
    changedPassword: function() {
        this.clearRowError();
    },
    
    changedReenteredPassword: function() {
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

