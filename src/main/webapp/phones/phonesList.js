/* 
    Created on : Sep 04, 2019, 8:10:48 PM
    Author     : goran
*/

/* global phonesGeometry_main, phonesAddModify_main, phonesOverview_gridSlick, phonesOverview_dataViewSlick, modalSupport_main, ajaxSupport_main, accessories_main */


var phonesList_main = {
    
    http: null,
    
    indexGridSelected: null,
    
    pageResize: function() {
        if (window.document.getElementById('idPredmetiPregled').style.display !== 'none') {
            phonesGeometry_main.setPregledGeometry('idPhonesDivButtonsAddModify', 'idPredmetiDataTable');
        } else if (window.document.getElementById('idPhonesAddModify').style.display !== 'none') {
            phonesGeometry_main.setPregledGeometry('idPhonesDivButtonsAddModify', 'idPhonesFormAddChange');
        }
    },
    
    ////////////////////////////////
    
    clickOnListAdd: function() {
        var selectedRows = phonesOverview_gridSlick.getSelectedRows();
        if (selectedRows[0] !== undefined) {
            this.indexGridSelected = selectedRows[0];
        } else {
            this.indexGridSelected = null;
        }
        
        accessories_main.removeAllErrorLabelsAddChangeInputs(phonesAddModify_main.elementsErrorAll);
        
        window.document.getElementById('idPredmetiPregled').style.display = 'none';
        
        phonesAddModify_main.mode = 'adding';
        window.document.getElementById('idPhonesAddChangeTitle').innerHTML = 'Add Contact';
        
        phonesGeometry_main.setPregledGeometry('idPhonesDivButtonsAddModify', 'idPhonesFormAddChange');
        window.document.getElementById('idPhonesAddModify').style.display = 'inline-block';
    },
    
    clickOnPreglediModify: function() {
        var indexAndJSONsArray = this.getPredmetJSON(1);
        if (indexAndJSONsArray.length === 0) {
            return;
        }
        
        accessories_main.removeAllErrorLabelsAddChangeInputs(phonesAddModify_main.elementsErrorAll);
        
        phonesAddModify_main.rowSelectedJSON = indexAndJSONsArray[0];
        phonesAddModify_main.predmetJSON = indexAndJSONsArray[1];
        phonesAddModify_main.indexRowSelected = indexAndJSONsArray[2];
        
        window.document.getElementById('idPredmetiPregled').style.display = 'none';
        
        phonesAddModify_main.mode = 'modifying';
        window.document.getElementById('idPhonesAddChangeTitle').innerHTML = 'Izmena predmeta';
        window.document.getElementById('idPredmetVrstaInput').disabled = true;
        window.document.getElementById('idPredmetVrstaInput').style.color = 'grey';
        
        phonesGeometry_main.setPregledGeometry('idPhonesDivButtonsAddModify', 'idPhonesFormAddChange');
        window.document.getElementById('idPhonesAddModify').style.display = 'inline-block';
        
        this.setModifyingData();
    },
    
    clickOnPreglediRevoke: function() {
        var question = 'P O T V R D A\r\n';
        question += 'Želite li zaista da uklonite\r\n';
        question += 'označeni predmet?';
        var confirmation = window.confirm(question);
        if (!confirmation) {
          return;
        }
        
        indexAndJSONsArray = this.getPredmetJSON(2);
        if (indexAndJSONsArray.length === 0) {
            return;
        }
        phonesAddModify_main.rowSelectedJSON = indexAndJSONsArray[0];
        phonesAddModify_main.predmetJSON = indexAndJSONsArray[1];
        phonesAddModify_main.indexRowSelected = indexAndJSONsArray[2];
        
        this.revokePredmetInDatabase();
    },
    
    clickOnPreglediDocumentation: function() {
        var indexAndJSONsArray = this.getPredmetJSON(3);
        if (indexAndJSONsArray.length === 0) {
            return;
        }
        phonesAddModify_main.rowSelectedJSON = indexAndJSONsArray[0];
        
        var idPredmet = phonesAddModify_main.rowSelectedJSON.id;
        var brojPredmetPotpun = phonesAddModify_main.rowSelectedJSON.brojPredmetaPotpun;
        
        window.localStorage.setItem("predmetiAreLoaded", '0');
        
        window.localStorage.setItem("documentsAreLoaded", '0');
        window.localStorage.setItem("idPredmetForDocumentation", idPredmet.toString());
        window.localStorage.setItem("brojPredmetPotpunForDocumentation", brojPredmetPotpun);
        
        window.location = './submoduleDocumentation/submoduleDocumentation.jsp';
    },
    
    clickOnChekboxLabel: function(idCheck) {
        var elementCheck = window.document.getElementById(idCheck);
        if (elementCheck.checked) {
            elementCheck.checked = false;
        } else {
            elementCheck.checked = true;
        }
        this.filterChanged();
    },
    
    ////////////////
    
    //modifying - mode = 1, revoke - mode = 2, submodule documentation - mode = 3
    getPredmetJSON: function(mode) {
        var indexAndJSONsArray = [];
        
        var selectedRows = phonesOverview_gridSlick.getSelectedRows();
        if (selectedRows[0] !== undefined) {
            var rowSelectedJSON = phonesOverview_dataViewSlick.getItem([selectedRows[0]]);
            
            for (var i = 0; i < phonesAddModify_main.predmetiLista.length; i++) {
                var predmetJSON = phonesAddModify_main.predmetiLista[i];
                if (rowSelectedJSON.id === predmetJSON.id) {
                    indexAndJSONsArray.push(rowSelectedJSON);
                    indexAndJSONsArray.push(predmetJSON);
                    indexAndJSONsArray.push(i);
                    break;
                }
            }
            
            this.indexGridSelected = selectedRows[0];
        } else {
            var errorMessage = '';
            if (mode === 1) {
                errorMessage += 'Ako želite da izmenite predmet,\r\n';
                errorMessage += 'morate ga najpre označiti.';
            } else if (mode === 2) {
                errorMessage += 'Ako želite da uklonite predmet,\r\n';
                errorMessage += 'morate ga najpre označiti.';
            }
            window.alert(errorMessage);
            
            this.indexGridSelected = null;
        }
        
        return indexAndJSONsArray;
    },
    
    setModifyingData: function() {
        window.document.getElementById('idPredmetVrstaInput').value = phonesAddModify_main.predmetJSON.nazivVrstePredmeta;
        window.document.getElementById('idPredmetBrojInput').value = phonesAddModify_main.predmetJSON.brojPredmeta;
        
        window.document.getElementById('idPredmetEpBrojInput').value = phonesAddModify_main.predmetJSON.epBroj;
        window.document.getElementById('idPredmetBrojPrijaveInput').value = phonesAddModify_main.predmetJSON.brojPrijave;
        window.document.getElementById('idPredmetRegistarskiBrojInput').value = phonesAddModify_main.predmetJSON.registarskiBroj;
        
        window.document.getElementById('idPredmetDatumPodnosenjaInput').value = phonesAddModify_main.predmetJSON.datumPodnosenjaISO;
        window.document.getElementById('idPredmetDatumIstekaInput').value = phonesAddModify_main.predmetJSON.datumIstekaISO;
        window.document.getElementById('idPredmetDatumVaziDoInput').value = phonesAddModify_main.predmetJSON.datumVaziDoISO;
        window.document.getElementById('idDatumPlacanjaInput').value = phonesAddModify_main.predmetJSON.datumPlacanjaISO;
        
        nosilacPravaACL = phonesAddModify_main.predmetJSON.nosilacPravaNaziv + " " + phonesAddModify_main.predmetJSON.nosilacPravaPIB;
        zastupnikACL = phonesAddModify_main.predmetJSON.zastupnikNaziv + " " + phonesAddModify_main.predmetJSON.zastupnikPIB;
        primalacRacunaACL = phonesAddModify_main.predmetJSON.primalacRacunaNaziv + " " + phonesAddModify_main.predmetJSON.primalacRacunaPIB;
        
        window.document.getElementById('idPredmetNosilacPravaInput').value = nosilacPravaACL;
        window.document.getElementById('idPredmetZastupnikInput').value = zastupnikACL;
        window.document.getElementById('idPredmetRacunDobijaInput').value = primalacRacunaACL;
    },  
    
    //////////////////////////////////////
    
    revokePredmetInDatabase: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var token = window.localStorage.getItem("token");
        
        var obj = {
            'token': token,
            'id': phonesAddModify_main.predmetJSON.id
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.predmetRevokeOnLoad;        
        this.http.onerror = this.predmetRevokeOnError;        
        this.http.ontimeout = this.predmetRevokeOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/predmeti/revoke', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
        
        return true;
    },
    
    predmetRevokeOnLoad: function() {
        if (phonesList_main.http.readyState === 4) {
            if (phonesList_main.http.status === 200) {
                var json = JSON.parse(phonesList_main.http.responseText);
                
                errorResponse = ajaxSupport_main.ajaxCallbackError(json, '../index.jsp');
                if (errorResponse) {
                    modalSupport_main.setComponentAccessibility(true); 
                    return;
                }
                
                var wasLastRow = false;
                if (phonesList_main.indexGridSelected === (phonesOverview_dataViewSlick.getLength() - 1)) {
                    wasLastRow = true;
                }
                
                var successMessage = 'U S P E H:\r\n';
                successMessage += (json.RevokedItem + phonesAddModify_main.predmetJSON.brojPredmetaPotpun);                
                window.alert(successMessage);
                
                modalSupport_main.setComponentAccessibility(true);
                
                var idRemoved = phonesAddModify_main.rowSelectedJSON.id;
                phonesOverview_dataViewSlick.deleteItem(idRemoved);
                
                if (phonesOverview_dataViewSlick.getLength() > 0) {
                    var indexNewSelected = 0;
                    if (wasLastRow) {
                        indexNewSelected = phonesOverview_dataViewSlick.getLength() - 1;
                    } else {
                        indexNewSelected = phonesList_main.indexGridSelected;
                    } 
                    phonesOverview_gridSlick.resetActiveCell();
                    phonesOverview_gridSlick.setSelectedRows([indexNewSelected]);
                    phonesOverview_gridSlick.scrollRowIntoView(indexNewSelected, true);
                }
            } else {
                modalSupport_main.setComponentAccessibility(true);
                var errorMessage = 'G R E Š K A:\r\nGreška na serveru (' + phonesAddModify_main.http.status + ')';
                window.alert(errorMessage);
            }
        }
    },
    
    predmetRevokeOnError: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'G R E Š K A:\r\nNeočekivana greška na serveru.';
        window.alert(errorMessage);
    },
    
    predmetRevokeOnTimeout: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'P R O B L E M:\r\nNeočekivana greška na serveru.';
        window.alert(errorMessage);
    }
    
};


