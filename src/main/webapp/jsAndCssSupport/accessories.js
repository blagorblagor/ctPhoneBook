/* 
    Created on : Sep 08, 2019, 6:37:48 PM
    Author     : goran
*/

/* global ajaxSupport_main */

var accessories_main = {
    
    arraySeparator: String.fromCharCode(20),
    
    /////////////////////////////
    
    createStringArrayFromSessionObj: function(sessionObjArrayName) {
        var arrayStringsSessionObj = window.localStorage.getItem(sessionObjArrayName);
        var arrayStrings = arrayStringsSessionObj.split(this.arraySeparator);
        
        return arrayStrings;
    },    
    
    createIntegerArrayFromSessionObj: function(sessionObjArrayName) {
        var arrayInts = [];
        
        var arrayIntsSessionObj = window.localStorage.getItem(sessionObjArrayName);
        var arrayIntsStr = arrayIntsSessionObj.split(this.arraySeparator);
        for (var i = 0; i < arrayIntsStr.length; i++) {
            var memberInt = parseInt(arrayIntsStr[i]);
            arrayInts.push(memberInt);
        }
        
        return arrayInts;
    },   
    
    createJSONarrayFromSessionObj: function(sessionObjArrayName) {
        var arrayJSON = [];
        
        var arrayJSONSessionObj = window.localStorage.getItem(sessionObjArrayName);
        var arrayJSONStr = arrayJSONSessionObj.split(this.arraySeparator);
        for (var i = 0; i < arrayJSONStr.length; i++) {
            var memberStr = arrayJSONStr[i];
            if (memberStr.length === 0) {
                break;
            }
            var memberJSON = JSON.parse(memberStr);
            arrayJSON.push(memberJSON);
        }
        
        return arrayJSON;
    },     
    
    ////////////////////////
    
    clearInputsData: function() {
        var editi = window.document.getElementsByTagName("input");
        for (var i = 0; i < editi.length; i++) {
            editi[i].value = '';
        }
    },
    
    ////////////////////////
    
    showErrorsAddChangeInputs: function(elementsAll, elementsWidthError, elementsErrorAll, errorMessage, errorDummyMessage) {
        for (var i = 0; i < elementsAll.length; i++) {
            var idElement = elementsAll[i];
            
            var hasError = false;
            for (var j = 0; j < elementsWidthError.length; j++) {
                var idElementWithError = elementsWidthError[j];
                if (idElement === idElementWithError) {
                    hasError = true;
                    break;
                }
            }
            
            if (hasError) {
                window.document.getElementById(elementsErrorAll[i]).innerHTML = errorMessage;
            } else {
                window.document.getElementById(elementsErrorAll[i]).innerHTML = errorDummyMessage;
            }
        }
    },
    
    removeFromElementsWithErrorsAddChangeInputs: function(idElementRemovedError, elementsWidthError, elementsErrorAll) {
        for (var i = 0; i < elementsWidthError.length; i++) {
            var idElementWithError = elementsWidthError[i];
            if (idElementWithError === idElementRemovedError) {
                elementsWidthError.splice(i, 1);
                break;
            }
        }
        
        if (elementsWidthError.length === 0) {
            this.removeAllErrorLabelsAddChangeInputs(elementsErrorAll);
        }
    },
    
    removeAllErrorLabelsAddChangeInputs: function(elementsErrorAll) {
        for (var i = 0; i < elementsErrorAll.length; i++) {
            var idElementError = elementsErrorAll[i];
            window.document.getElementById(idElementError).innerHTML = '';
        }
    },
    
    ////////////////////
    
    dateISOtoDateSerb: function(dateISO) {
        var dateSerb = '';
        
        if (dateISO.length === 0) {
            return dateSerb;
        }
        
        var year = dateISO.substring(0, 4);
        var month = dateISO.substring(5, 7);
        var day = dateISO.substring(8);
        
        dateSerb = day + "." + month + "." + year;
        return dateSerb;
    },
    
    dateSerbToDateISO: function(dateSerb) {
        var dateISO = '';
        
        if (dateSerb.length === 0) {
            return dateISO;
        }
        
        var day = dateSerb.substring(0, 2);
        var month = dateSerb.substring(3, 5);
        var year = dateSerb.substring(6);
        
        dateISO = year + "-" + month + "-" + day;
        return dateISO;
    },
    
    //////////////////////////////////////////
    
    disableAllButtonsAndInputs: function() {
        var dugmad = window.document.getElementsByTagName("button");
        for (var i = 0; i < dugmad.length; i++) {
            dugmad[i].disabled = true;
        }
        
        var editi = window.document.getElementsByTagName("input");
        for (var i = 0; i < editi.length; i++) {
            editi[i].disabled = true;
        }
    },
    
    //////////////////////////////////////////
    
    logout: function() {
        window.localStorage.removeItem("idAccount");
        window.location = ajaxSupport_main.siteRoot + '/index.jsp';
    }
    
};


