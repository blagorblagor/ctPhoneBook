/* 
    Created on : Sep 05, 2019, 8:10:48 PM
    Author     : goran
*/

/* global phonesGeometry_main, accessories_main, autocompleteList_main, ajaxSupport_main, phonesOverview_dataViewSlick, phonesOverview_gridSlick, modalSupport_main, phonesList_main */

var phonesAddModify_main = {
    
    mode: null, //'adding' or 'modifying'
    
    predmetiLista: [],
    predmetiListaOverview: [],
    
    rowSelectedJSON: null,
    predmetJSON: null,
    indexRowSelected: null,
    
    predmetNamesArray: [],
    predmetNamesIDs: [],
    
    pravnaLicaArray: [],
    pravnaLicaIDsArray: [],
    pravnaLicaNamesArray: [],
    pravnaLicaPIBsArray: [],
    
    vrstaPredmeta: null,
    vrstaPredmetaID: null,
    epBroj: null,
    brojPrijave: null,
    registarskiBroj: null,
    datumPodnosenja: null,
    datumPodnosenjaLocal: null,
    nosilacPrava: null,
    nosilacPravaID: null,
    nosilacPravaNaziv: null,
    nosilacPravaPIB: null,
    zastupa: null,
    zastupaID: null,
    zastupaNaziv: null,
    zastupaPIB: null,
    racunDobija: null,
    racunDobijaID: null,
    racunDobijaNaziv: null,
    racunDobijaPIB: null,
    datumIsteka: null,
    datumIstekaLocal: null,
    datumVaziDo: null,
    datumVaziDoLocal: null,
    datumPlacanja: null,
    datumPlacanjaLocal: null,
    
    elementsWidthError: [],
    elementsAll: [],
    elementsErrorAll: [],
    
    http: null,
    
    /////////////////////////////////////////////
    
    getDataFromSession: function() {
        this.predmetNamesArray = accessories_main.createStringArrayFromSessionObj('predmetNames');
        this.predmetNamesIDs = accessories_main.createIntegerArrayFromSessionObj('predmetIDs');
        
        this.pravnaLicaArray = accessories_main.createStringArrayFromSessionObj('pravnaLica');
        this.pravnaLicaIDsArray = accessories_main.createIntegerArrayFromSessionObj('pravnaLicaIDs');
        this.pravnaLicaNamesArray = accessories_main.createStringArrayFromSessionObj('pravnaLicaNames');
        this.pravnaLicaPIBsArray = accessories_main.createStringArrayFromSessionObj('pravnaLicaPIBs');
        
        /////////////////////////////////////////////
        
        this.predmetiLista = accessories_main.createJSONarrayFromSessionObj('predmetiLista');
        this.createPredmetiListOverview();
    },
    
    createPredmetiListOverview: function() {
        for (var i = 0; i < this.predmetiLista.length; i++) {
            var predmetJSON = this.predmetiLista[i];
            var predmetJSONoverview = {
                id: predmetJSON.id,
                brojPredmetaPotpun: predmetJSON.brojPredmetaPotpun,
                epBroj: predmetJSON.epBroj,
                registarskiBroj: predmetJSON.registarskiBroj,
                brojPrijave: predmetJSON.brojPrijave,
                datumPodnosenja: predmetJSON.datumPodnosenja,
                nosilacPravaNaziv: predmetJSON.nosilacPravaNaziv,
                zastupnikNaziv: predmetJSON.zastupnikNaziv,
                primalacRacunaNaziv: predmetJSON.primalacRacunaNaziv,
                datumIsteka: predmetJSON.datumIsteka,
                datumVaziDo:predmetJSON.datumVaziDo,
                datumPlacanja: predmetJSON.datumPlacanja
            };            
            this.predmetiListaOverview.push(predmetJSONoverview);
        }
    },
    
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
                                                       'This field is mandatory', '&nbsp;');
            return;
        }
        
        if (this.mode === 'adding') {
            this.addPredmetIntoDfatabase();
        } else if (this.mode === 'modifying') {
            this.changePredmetInDatabase();
        }
    },
    
    clickCancelAddChange: function() {
        var columns = phonesOverview_gridSlick.getColumns();
        var sortColumns = phonesOverview_gridSlick.getSortColumns();
        
        window.document.getElementById('idPhonesAddModify').style.display = 'none';
        accessories_main.clearInputsData();
        
        window.document.getElementById('idPredmetiPregled').style.display = 'inline-block';
        phonesGeometry_main.setPregledGeometry('idPhonesDivButtonsAddModify', 'idPredmetiDataTable'); 
        
        if (phonesList_main.indexGridSelected !== null) {
            var indexSelected = phonesList_main.indexGridSelected;
            phonesOverview_gridSlick.resetActiveCell();
            phonesOverview_gridSlick.setSelectedRows([indexSelected]);
            phonesOverview_gridSlick.scrollRowIntoView(indexSelected, true);
        }
        phonesOverview_gridSlick.setColumns(columns);
        phonesOverview_gridSlick.setSortColumns(sortColumns);
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
        
        var elementPredmetEpBroj = window.document.getElementById('idNameInput');
        this.epBroj = elementPredmetEpBroj.value;
        if (this.epBroj.length === 0) {
            this.elementsWidthError.push('idNameInput');
        }
        
        var elementPredmetBrojPrijave = window.document.getElementById('idNicknameInput');
        this.brojPrijave = elementPredmetBrojPrijave.value;
        
        var elementPredmetRegistarskiBroj = window.document.getElementById('idSurnameInput');
        this.registarskiBroj = elementPredmetRegistarskiBroj.value;
        
        var elementPredmetNosilacPrava = window.document.getElementById('idPhoneInput');
        this.nosilacPrava = elementPredmetNosilacPrava.value;
        if (this.nosilacPrava.length === 0) {
            this.elementsWidthError.push('idPhoneInput');
        }
        
        if (this.elementsWidthError.length > 0) {
            return false;
        }
        return true;
    },  
    
    //////////////////////////////////////
    
    addPredmetIntoDatabase: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var token = window.localStorage.getItem("token");
        
        var obj = {
            'token': token,
            'vrstaPredmetaStr': this.vrstaPredmeta,
            'idVrstaPredmeta': this.vrstaPredmetaID,
            'epBroj': this.epBroj,
            'brojPrijave': this.brojPrijave,
            'registarskiBroj': this.registarskiBroj,
            'datumPodnosenja': this.datumPodnosenja,
            'nosilacPrava': this.nosilacPravaID,
            'zastupa': this.zastupaID,
            'primalacRacuna': this.racunDobijaID,
            'datumIsteka': this.datumIsteka,
            'datumVaziDo': this.datumVaziDo,
            'datumPlacanja': this.datumPlacanja
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.predmetAddOnLoad;        
        this.http.onerror = this.predmetAddOnError;        
        this.http.ontimeout = this.predmetAddOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/predmeti/add', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
        
        return true;
    },
    
    predmetAddOnLoad: function() {
        if (phonesAddModify_main.http.readyState === 4) {
            if (phonesAddModify_main.http.status === 200) {
                var json = JSON.parse(phonesAddModify_main.http.responseText);
                errorResponse = ajaxSupport_main.ajaxCallbackError(json, '../index.jsp');
                if (errorResponse) {
                    modalSupport_main.setComponentAccessibility(true); 
                    return;
                }
                
                var idInserted = json.ID_INSERTED;
                var brojPredmeta = json.BROJ_PREDMETA;
                var idUser = json.ID_USER;
                var brojPredmetaPotpunVracen = json.BROJ_PREDMETA_POTPUN;
                
                var objAdded = {
                    id: idInserted,
                    idVrstePredmeta: phonesAddModify_main.vrstaPredmetaID,
                    nazivVrstePredmeta: phonesAddModify_main.vrstaPredmeta,
                    brojPredmeta: brojPredmeta,
                    brojPredmetaPotpun: phonesAddModify_main.brojPredmetaPotpun,
                    epBroj: phonesAddModify_main.epBroj,
                    registarskiBroj: phonesAddModify_main.registarskiBroj,
                    brojPrijave: phonesAddModify_main.brojPrijave,
                    idDrzava: 0, // not in use
                    nazivDrzava: '', // not in use
                    datumPodnosenja: phonesAddModify_main.datumPodnosenjaLocal,
                    datumPodnosenjaISO: phonesAddModify_main.datumPodnosenja,
                    idNosilacPrava: phonesAddModify_main.nosilacPravaID,
                    nosilacPravaNaziv: phonesAddModify_main.nosilacPravaNaziv,
                    nosilacPravaPIB: phonesAddModify_main.nosilacPravaPIB,
                    idZastupnik: phonesAddModify_main.zastupaID,
                    zastupnikNaziv: phonesAddModify_main.zastupaNaziv,
                    zastupnikPIB: phonesAddModify_main.zastupaPIB,
                    idPrimalacRacuna: phonesAddModify_main.racunDobijaID,
                    primalacRacunaNaziv: phonesAddModify_main.racunDobijaNaziv,
                    primalacRacunaPIB: phonesAddModify_main.racunDobijaPIB,
                    datumIsteka: phonesAddModify_main.datumIstekaLocal,
                    datumIstekaISO: phonesAddModify_main.datumIsteka,
                    datumVaziDo: phonesAddModify_main.datumVaziDoLocal,
                    datumVaziDoISO: phonesAddModify_main.datumVaziDo,
                    datumPlacanja: phonesAddModify_main.datumPlacanjaLocal,
                    datumPlacanjaISO: phonesAddModify_main.datumPlacanja,
                    idKorisnici: idUser
                };
                phonesAddModify_main.predmetiLista.push(objAdded);
                
                var objAddedForGrid = {
                    id: idInserted,
                    brojPredmetaPotpun: brojPredmetaPotpunVracen,
                    epBroj: objAdded.epBroj,
                    registarskiBroj: objAdded.registarskiBroj,
                    brojPrijave: objAdded.brojPrijave,
                    datumPodnosenja: objAdded.datumPodnosenja,
                    nosilacPravaNaziv: objAdded.nosilacPravaNaziv,
                    zastupnikNaziv: objAdded.zastupnikNaziv,
                    primalacRacunaNaziv: objAdded.primalacRacunaNaziv,
                    datumIsteka: objAdded.datumIsteka,
                    datumVaziDo: objAdded.datumVaziDo,
                    datumPlacanja: objAdded.datumPlacanja
                };
                
                var successMessage = 'U S P E H:\r\n';
                successMessage += json.AddedItem;                
                window.alert(successMessage);
                
                modalSupport_main.setComponentAccessibility(true);
                
                phonesOverview_dataViewSlick.addItem(objAddedForGrid);
                
                phonesOverview_dataViewSlick.reSort();
                phonesList_main.indexGridSelected = phonesOverview_dataViewSlick.getRowById(idInserted);
                
                phonesAddModify_main.clickCancelAddChange();
            } else {
                modalSupport_main.setComponentAccessibility(true);
                var errorMessage = 'G R E Š K A:\r\nGreška na serveru (' + phonesAddModify_main.http.status + ')';
                window.alert(errorMessage);
            }
        }
    },
    
    predmetAddOnError: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'G R E Š K A:\r\nNeočekivana greška na serveru.';
        window.alert(errorMessage);
    },
    
    predmetAddOnTimeout: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'G R E Š K A:\r\nPrekoračen tajmaut.';
        window.alert(errorMessage);
    },  
    
    //////////////////////////////////////
    
    changePredmetInDatabase: function() {
        modalSupport_main.setComponentAccessibility(false);
        
        var token = window.localStorage.getItem("token");
        
        var obj = {
            'token': token,
            'id': phonesAddModify_main.predmetJSON.id,
            'brojPredmeta': phonesAddModify_main.predmetJSON.brojPredmeta,
            'vrstaPredmetaStr': this.vrstaPredmeta,
            'idVrstaPredmeta': this.vrstaPredmetaID,
            'epBroj': this.epBroj,
            'brojPrijave': this.brojPrijave,
            'registarskiBroj': this.registarskiBroj,
            'datumPodnosenja': this.datumPodnosenja,
            'nosilacPrava': this.nosilacPravaID,
            'zastupa': this.zastupaID,
            'primalacRacuna': this.racunDobijaID,
            'datumIsteka': this.datumIsteka,
            'datumVaziDo': this.datumVaziDo,
            'datumPlacanja': this.datumPlacanja
        };
        
        this.http = ajaxSupport_main.createHTTP();
        
        this.http.onload = this.predmetChangeOnLoad;        
        this.http.onerror = this.predmetChangeOnError;        
        this.http.ontimeout = this.predmetChangeOnTimeout;

        this.http.open('POST', ajaxSupport_main.siteRoot + '/api/services/predmeti/modify', true);
        this.http.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        this.http.timeout = ajaxSupport_main.httpTimeout;
        this.http.send(JSON.stringify(obj));
        
        return true;
    },
    
    predmetChangeOnLoad: function() {
        if (phonesAddModify_main.http.readyState === 4) {
            if (phonesAddModify_main.http.status === 200) {
                var json = JSON.parse(phonesAddModify_main.http.responseText);
                
                errorResponse = ajaxSupport_main.ajaxCallbackError(json, '../index.jsp');
                if (errorResponse) {
                    modalSupport_main.setComponentAccessibility(true); 
                    return;
                }
                
                var idUser = json.ID_USER;
                
                phonesAddModify_main.predmetJSON.epBroj = phonesAddModify_main.epBroj;
                phonesAddModify_main.predmetJSON.registarskiBroj = phonesAddModify_main.registarskiBroj;
                phonesAddModify_main.predmetJSON.brojPrijave = phonesAddModify_main.brojPrijave;
                phonesAddModify_main.predmetJSON.idDrzava = 0; // not in use
                phonesAddModify_main.predmetJSON.nazivDrzava = '', // not in use
                phonesAddModify_main.predmetJSON.datumPodnosenja = phonesAddModify_main.datumPodnosenjaLocal;
                phonesAddModify_main.predmetJSON.datumPodnosenjaISO = phonesAddModify_main.datumPodnosenja;
                phonesAddModify_main.predmetJSON.idNosilacPrava = phonesAddModify_main.nosilacPravaID;
                phonesAddModify_main.predmetJSON.nosilacPravaNaziv = phonesAddModify_main.nosilacPravaNaziv;
                phonesAddModify_main.predmetJSON.nosilacPravaPIB = phonesAddModify_main.nosilacPravaPIB;
                phonesAddModify_main.predmetJSON.idZastupnik = phonesAddModify_main.zastupaID;
                phonesAddModify_main.predmetJSON.zastupnikNaziv = phonesAddModify_main.zastupaNaziv;
                phonesAddModify_main.predmetJSON.zastupnikPIB = phonesAddModify_main.zastupaPIB;
                phonesAddModify_main.predmetJSON.idPrimalacRacuna = phonesAddModify_main.racunDobijaID;
                phonesAddModify_main.predmetJSON.primalacRacunaNaziv = phonesAddModify_main.racunDobijaNaziv;
                phonesAddModify_main.predmetJSON.primalacRacunaPIB = phonesAddModify_main.racunDobijaPIB;
                phonesAddModify_main.predmetJSON.datumIsteka = phonesAddModify_main.datumIstekaLocal;
                phonesAddModify_main.predmetJSON.datumIstekaISO = phonesAddModify_main.datumIsteka;
                phonesAddModify_main.predmetJSON.datumVaziDo = phonesAddModify_main.datumVaziDoLocal;
                phonesAddModify_main.predmetJSON.datumVaziDoISO = phonesAddModify_main.datumVaziDo;
                phonesAddModify_main.predmetJSON.datumPlacanja = phonesAddModify_main.datumPlacanjaLocal;
                phonesAddModify_main.predmetJSON.datumPlacanjaISO = phonesAddModify_main.datumPlacanja;
                phonesAddModify_main.predmetJSON.idKorisnici = idUser;
                
                phonesAddModify_main.rowSelectedJSON.epBroj = phonesAddModify_main.predmetJSON.epBroj;
                phonesAddModify_main.rowSelectedJSON.registarskiBroj = phonesAddModify_main.predmetJSON.registarskiBroj;
                phonesAddModify_main.rowSelectedJSON.brojPrijave = phonesAddModify_main.predmetJSON.brojPrijave;
                phonesAddModify_main.rowSelectedJSON.datumPodnosenja = phonesAddModify_main.predmetJSON.datumPodnosenja;
                phonesAddModify_main.rowSelectedJSON.nosilacPravaNaziv = phonesAddModify_main.predmetJSON.nosilacPravaNaziv;
                phonesAddModify_main.rowSelectedJSON.zastupnikNaziv = phonesAddModify_main.predmetJSON.zastupnikNaziv;
                phonesAddModify_main.rowSelectedJSON.primalacRacunaNaziv = phonesAddModify_main.predmetJSON.primalacRacunaNaziv;
                phonesAddModify_main.rowSelectedJSON.datumIsteka = phonesAddModify_main.predmetJSON.datumIsteka;
                phonesAddModify_main.rowSelectedJSON.datumVaziDo = phonesAddModify_main.predmetJSON.datumVaziDo;
                phonesAddModify_main.rowSelectedJSON.datumPlacanja = phonesAddModify_main.predmetJSON.datumPlacanja;
                
                var successMessage = 'U S P E H:\r\n';
                successMessage += (json.ChangedItem + phonesAddModify_main.predmetJSON.brojPredmetaPotpun);                
                window.alert(successMessage);
                
                modalSupport_main.setComponentAccessibility(true);
                
                var idDokument = phonesAddModify_main.rowSelectedJSON.id;
                phonesOverview_dataViewSlick.reSort();
                phonesList_main.indexGridSelected = phonesOverview_dataViewSlick.getRowById(idDokument);
                
                phonesAddModify_main.clickCancelAddChange();
            } else {
                modalSupport_main.setComponentAccessibility(true);
                var errorMessage = 'G R E Š K A:\r\nGreška na serveru (' + phonesAddModify_main.http.status + ')';
                window.alert(errorMessage);
            }
        }
    },
    
    predmetChangeOnError: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'G R E Š K A:\r\nNeočekivana greška na serveru.';
        window.alert(errorMessage);
    },
    
    predmetChangeOnTimeout: function() {
        modalSupport_main.setComponentAccessibility(true);
        var errorMessage = 'G R E Š K A:\r\nPrekoračen tajmaut.';
        window.alert(errorMessage);
    }
    
};


