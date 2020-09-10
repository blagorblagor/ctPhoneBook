/* global phonesGeometry_main, accessories_main, autocompleteList_main, ajaxSupport_main, phonesOverview_dataViewSlick, phonesOverview_gridSlick, modalSupport_main, phonesList_main */

var phonesAddModify_main = {
    
    mode: null, //'adding' or 'modifying'
    
    name: null,
    nickname: null,
    surname: null,
    phone: null,
    
    elementsWidthError: [],
    elementsAll: [],
    elementsErrorAll: [],
    
    http: null,
    
    /////////////////////////////////////////////
    
    setElementsArray: function() {
        this.elementsAll.push('idNameInput');
        this.elementsAll.push('idNicknameInput');
        this.elementsAll.push('idSurnameInput');
        this.elementsAll.push('idPhoneInput');
        
        this.elementsErrorAll.push('idNameError');
        this.elementsErrorAll.push('idNicknameError');
        this.elementsErrorAll.push('idSurnameError');
        this.elementsErrorAll.push('idPhoneError');
    },
    
    /////////////////////////////////////////////
    
    clickSaveAddChange: function() {
        var dataIsOK = this.dataControl();
        if (!dataIsOK) {
            accessories_main.showErrorsAddChangeInputs(this.elementsAll, this.elementsWidthError, this.elementsErrorAll, 
                                                       'This field is mandatory!', '&nbsp;');
            return;
        }
        
        if (this.mode === 'adding') {
            this.addPhoneIntoDatabase();
        } else if (this.mode === 'modifying') {
            this.modifyPhoneInDatabase();
        }
    },
    
    clickCancelAddChange: function() {
        window.document.getElementById('idNameInput').value = '';
        window.document.getElementById('idNicknameInput').value = '';
        window.document.getElementById('idSurnameInput').value = '';
        window.document.getElementById('idPhoneInput').value = '';
        
        window.document.getElementById('idPhonesAddModify').style.display = 'none';
        window.document.getElementById('idContactsOverview').style.display = 'inline-block';
    },
    
    dateLostFocus: function(elementDateInput) {
        var dateValue = elementDateInput.value;
        if (dateValue.length > 0) {
            if (dateValue < elementDateInput.min) {
                elementDateInput.value = '';
            } else if (dateValue > elementDateInput.max) {
                elementDateInput.value = '';
            }
        }
    },
    
    elementChanged: function(elementDateInput, idElementError) {
        if (this.elementsWidthError.length === 0) {
            return;
        }
        
        var dateValue = elementDateInput.value;
        if (dateValue.length > 0) {
            window.document.getElementById(idElementError).innerHTML = '&nbsp;';
            accessories_main.removeFromElementsWithErrorsAddChangeInputs(elementDateInput.id, this.elementsWidthError, this.elementsErrorAll);
        }
    },
    
    ////////////////////////////////////////////
    
    dataControl: function() {
        this.elementsWidthError = [];
        
        var elementName = window.document.getElementById('idNameInput');
        this.name = elementName.value;
        if (this.name.length === 0) {
            this.elementsWidthError.push('idNameInput');
        }
        
        var elementNickname = window.document.getElementById('idNicknameInput');
        this.nickname = elementNickname.value;
        
        var elementSurname = window.document.getElementById('idSurnameInput');
        this.surname = elementSurname.value;
        
        var elementPhone = window.document.getElementById('idPhoneInput');
        this.phone = elementPhone.value;
        if (this.phone.length === 0) {
            this.elementsWidthError.push('idPhoneInput');
        }
        
        if (this.elementsWidthError.length > 0) {
            return false;
        }
        return true;
    },  
    
    //////////////////////////////////////
    
    addPhoneIntoDatabase: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var idAccount = parseInt(window.localStorage.getItem("idAccount"));
        var obj = {
            'idAccountObj': idAccount,
            'nameObj': this.name,
            'nicknameObj': this.nickname,
            'surnameObj': this.surname,
            'phoneObj': this.phone
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.phoneAddOnLoad;        
        this.http.onerror = this.phoneAddOnError;        
        this.http.ontimeout = this.phoneAddOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/phones/add', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
    },
    
    phoneAddOnLoad: function() {
        if (phonesAddModify_main.http.readyState === 4) {
            if (phonesAddModify_main.http.status === 200) {
                var json = JSON.parse(phonesAddModify_main.http.responseText);
                if (json.status !== "Success") { 
                    window.alert(json.problemMessage);
                    modalSupport_main.setComponentAccessibility(true);
                    return;
                }                
                
                window.location.reload();
            } else {
                modalSupport_main.setComponentAccessibility(true);
                var errorMessage = 'E R R O R\r\nError on server (' + phonesAddModify_main.http.status + ')';
                window.alert(errorMessage);
            }
        }
    },
    
    phoneAddOnError: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'E R R O R\r\nUnexpected error on server.';
        window.alert(errorMessage);
    },
    
    phoneAddOnTimeout: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'E R R O R\r\nTimeout is over.';
        window.alert(errorMessage);
    },  
    
    //////////////////////////////////////
    
    modifyPhoneInDatabase: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var name =  window.document.getElementById('idNameInput').value;
        var nickname = window.document.getElementById('idNicknameInput').value;
        var surname = window.document.getElementById('idSurnameInput').value;
        var phone = window.document.getElementById('idPhoneInput').value;
        
        var obj = {
            'idContactObj': phonesList_main.selectedContactRowJSON.id,
            'idPhoneObj': phonesList_main.selectedContactRowJSON.id_phones,
            'nameObj': name,
            'nicknameObj': nickname,
            'surnameObj': surname,
            'phoneObj': phone
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.phoneModifyOnLoad;        
        this.http.onerror = this.phoneModifyOnError;        
        this.http.ontimeout = this.phoneModifyOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/phones/modify', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
    },
    
    phoneModifyOnLoad: function() {
        if (phonesAddModify_main.http.readyState === 4) {
            if (phonesAddModify_main.http.status === 200) {
                var json = JSON.parse(phonesAddModify_main.http.responseText);
                if (json.status !== "Success") { 
                    window.alert(json.problemMessage);
                    modalSupport_main.setComponentAccessibility(true);
                    return;
                }                
                
                window.location.reload();
            } else {
                modalSupport_main.setComponentAccessibility(true);
                var errorMessage = 'E R R O R:\r\nError on server (' + phonesAddModify_main.http.status + ')';
                window.alert(errorMessage);
            }
        }
    },
    
    phoneModifyOnError: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'E R R O R:\r\nUnexpected error on server.';
        window.alert(errorMessage);
    },
    
    phoneModifyOnTimeout: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'E R R O R:\r\nYimeout is over.';
        window.alert(errorMessage);
    }
    
};


