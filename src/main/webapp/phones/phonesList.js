/* global phonesGeometry_main, phonesAddModify_main, phonesOverview_gridSlick, phonesOverview_dataViewSlick, modalSupport_main, ajaxSupport_main, accessories_main */

var phonesList_main = {
    
    http: null,
    
    indexGridSelected: null,
    
    selectedContactRowJSON: null,
    contactsListOverview: [],
    
    ////////////////////////////////////////////////////
    
    pageLoad: function() {
        var idAccountStr = window.localStorage.getItem("idAccount");
        if (idAccountStr === null) {
            window.location.href = "../index.jsp";
            return;
        }

        var idAccount = parseInt(idAccountStr);
        if (idAccount <= 0) {
            window.location.href = "../index.jsp";
            return;
        }

        phonesAddModify_main.setElementsArray();

        window.setTimeout(function() {
            window.document.getElementById('idContactsOverview').style.display = 'inline-block';                    
            phonesList_main.readContacts();
        }, 100);
    },
    
    pageResize: function() {
        window.setTimeout(function() {
            if (window.document.getElementById('idContactsOverview').style.display !== 'none') {
            phonesGeometry_main.setContactGeometry('idPhonesDivButtonsAddModify', 'idContactsDataTable');
            } else if (window.document.getElementById('idPhonesAddModify').style.display !== 'none') {
                phonesGeometry_main.setContactGeometry('idPhonesDivButtonsAddModify', 'idPhonesFormAddChange');
            }
        }, 100);        
    },
    
    ////////////////////////////////////////////////////
    
    readContacts: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var idAccount = parseInt(window.localStorage.getItem("idAccount"));
        var obj = {
            'idAccountObj': idAccount
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.readContactsOnLoad;        
        this.http.onerror = this.readContactsOnError;        
        this.http.ontimeout = this.readContactsOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/phones/read', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
    },
    
    readContactsOnLoad: function() {
        if (phonesList_main.http.readyState === 4) {
            if (phonesList_main.http.status === 200) {
                var json = JSON.parse(phonesList_main.http.responseText);
                if (json.status !== "Success") {
                    alert(json.problemMessage);                    
                    modalSupport_main.setComponentAccessibility(true);
                    return;
                }
                
                phonesList_main.contactsListOverview = json.contacts;                
                phonesGeometry_main.setContactGeometry('idContactsDivButtonsOverview', 'idContactsDataTable');
                
                modalSupport_main.setComponentAccessibility(true);
            } else {
                var errorMessage = 'Error on server (' + phonesList_main.http.status + ')';
                window.alert(errorMessage);
                modalSupport_main.setComponentAccessibility(true);
            }
        }
    },
    
    readContactsOnError: function() {
        var errorMessage = 'Server is not found or it doeas not respond.';
        window.alert(errorMessage);
        modalSupport_main.setComponentAccessibility(true);
    },
    
    readContactsOnTimeout: function() {
        var errorMessage = 'Timeout is over.';
        window.alert(errorMessage);
        modalSupport_main.setComponentAccessibility(true);
    },
    
    ////////////////////////////////////////////////////
    
    clickOnListAdd: function() {
        accessories_main.removeAllErrorLabelsAddChangeInputs(phonesAddModify_main.elementsErrorAll);
        
        window.document.getElementById('idContactsOverview').style.display = 'none';
        
        phonesAddModify_main.mode = 'adding';
        window.document.getElementById('idPhonesAddChangeTitle').innerHTML = 'Add Contact';
        
        phonesGeometry_main.setContactGeometry('idPhonesDivButtonsAddModify', 'idPhonesFormAddChange');
        window.document.getElementById('idPhonesAddModify').style.display = 'inline-block';
    },
    
    clickOnContactsModify: function() {
        var selectedRows = phonesOverview_gridSlick.getSelectedRows();
        if (selectedRows[0] === undefined) {
            return;
        }
        this.selectedContactRowJSON = phonesOverview_dataViewSlick.getItem([selectedRows[0]]);
        
        accessories_main.removeAllErrorLabelsAddChangeInputs(phonesAddModify_main.elementsErrorAll);
        
        window.document.getElementById('idContactsOverview').style.display = 'none';
        
        phonesAddModify_main.mode = 'modifying';
        window.document.getElementById('idPhonesAddChangeTitle').innerHTML = 'Modify Contact';
        
        phonesGeometry_main.setContactGeometry('idPhonesDivButtonsAddModify', 'idPhonesFormAddChange');
        window.document.getElementById('idPhonesAddModify').style.display = 'inline-block';
        
        this.setModifyingData();
    },
    
    clickOnContactsDelete: function() {
        var selectedRows = phonesOverview_gridSlick.getSelectedRows();
        if (selectedRows[0] === undefined) {
            return;
        }
        this.selectedContactRowJSON = phonesOverview_dataViewSlick.getItem([selectedRows[0]]);
        
        var question = 'C O N F I R M A T I O N\r\n';
        question += 'Do you really want to delete\r\n';
        question += 'selected contact?';
        var confirmation = window.confirm(question);
        if (!confirmation) {
          return;
        }
        
        this.removeContactFromDatabase();
    },
    
    ////////////////
    
    setModifyingData: function() {
        window.document.getElementById('idNameInput').value = this.selectedContactRowJSON.name;
        window.document.getElementById('idNicknameInput').value = this.selectedContactRowJSON.nickname;
        window.document.getElementById('idSurnameInput').value = this.selectedContactRowJSON.surname;
        window.document.getElementById('idPhoneInput').value = this.selectedContactRowJSON.phone_number;
    },  
    
    //////////////////////////////////////
    
    removeContactFromDatabase: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var obj = {
            'idContactObj': phonesList_main.selectedContactRowJSON.id,
            'idPhoneObj': phonesList_main.selectedContactRowJSON.id_phones
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.contactRemoveOnLoad;        
        this.http.onerror = this.contactRemoveOnError;        
        this.http.ontimeout = this.contactRemoveOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/phones/delete', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
    },
    
    contactRemoveOnLoad: function() {
        if (phonesList_main.http.readyState === 4) {
            if (phonesList_main.http.status === 200) {
                var json = JSON.parse(phonesList_main.http.responseText);
                if (json.status !== "Success") { 
                    window.alert(json.problemMessage);
                    modalSupport_main.setComponentAccessibility(true);
                    return;
                }                
                
                window.location.reload();
            } else {
                modalSupport_main.setComponentAccessibility(true);
                var errorMessage = 'Error on server (' + phonesList_main.http.status + ')';
                window.alert(errorMessage);
            }
        }
    },
    
    contactRemoveOnError: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'Server is not found or it doeas not respond.';
        window.alert(errorMessage);
    },
    
    contactRemoveOnTimeout: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'Timeout is over.';
        window.alert(errorMessage);
    }
    
};


