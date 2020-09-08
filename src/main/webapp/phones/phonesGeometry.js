/* 
    Created on : Sep 04, 2019, 8:10:48 PM
    Author     : goran
*/

/* global phonesOverview_main, phonesAddModify_main */

var phonesGeometry_main = {
    
    setPregledGeometry: function(idPredmetiDivDugmad, idPredmetiForm) { 
        if (idPredmetiForm === 'idPredmetiDataTable') {
            this.adjustDataTable(idPredmetiForm);
            return;
        }
        
        const styleDivDugmadPregled = window.getComputedStyle(window.document.getElementById(idPredmetiDivDugmad));
        if (styleDivDugmadPregled.height === 'auto') {
            window.document.getElementById(idPredmetiForm).style.height = 'calc(100% - 40px)'; 
            if (idPredmetiForm === 'idPhonesFormAddChange') {
                this.adjustFormAddChange('40px');
            }        
            return;
        }
        window.document.getElementById(idPredmetiForm).style.height = 'calc(100% - ' + styleDivDugmadPregled.height + ')';
        
        this.adjustFormAddChange(styleDivDugmadPregled.height);
    },
    
    adjustDataTable: function(idPredmetiForm) {
        
        var elementPredmetiPregled = window.document.getElementById('idPredmetiPregled');
        var elementPredmetiDivDugmadPregled = window.document.getElementById('idPredmetiDivDugmadPregled');
        var elementiPredmetiDataTable = window.document.getElementById(idPredmetiForm);
        
        var heightElementPredmetiPregled = elementPredmetiPregled.offsetHeight;
        var widthElementPredmetiPregled = elementPredmetiPregled.offsetWidth;
        var dugmadDivHeight = elementPredmetiDivDugmadPregled.offsetHeight;
        
        var widthElementPredmetiPregled = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        
        var gridLeft = (widthElementPredmetiPregled - phonesOverview_main.gridWidth) / 2;
        if (gridLeft < 0) {
            gridLeft = 0;
        }
        
        var gridWidth = phonesOverview_main.gridWidth;
        if (gridWidth > widthElementPredmetiPregled) {
            gridWidth = widthElementPredmetiPregled;
        } 
        
        var gridHeight = heightElementPredmetiPregled - (dugmadDivHeight + 8);
        if (gridHeight < phonesOverview_main.gridMinHeight) {
            gridHeight = phonesOverview_main.gridMinHeight;
            gridWidth -= 18;
        }
        
        elementiPredmetiDataTable.style.left = gridLeft.toString() + 'px';
        elementiPredmetiDataTable.style.width = gridWidth.toString() + 'px';
        elementiPredmetiDataTable.style.height = gridHeight.toString() + 'px';
        
        phonesOverview_main.createAndPopulateGrid('idPredmetiDataTable', phonesAddModify_main.predmetiListaOverview);
    },
    
    adjustFormAddChange: function(dugmadDivHeight) {
        var predmetiAddChangeTitleObj = window.document.getElementById('idPhonesAddChangeTitle');
        const stylePredmetiAddChangeTitle = window.getComputedStyle(predmetiAddChangeTitleObj);
        
        var indexPX = dugmadDivHeight.indexOf('px');
        var dugmadDivHeightInt = dugmadDivHeight.substring(0, indexPX);
        
        var predmetiFormObj = window.document.getElementById('idPhonesFormInnerAddChange');
            
        var pageWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    
        var pageHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
    
        var heightFormObj = pageHeight - (parseInt(dugmadDivHeightInt) + 30) - 20;

        if (pageWidth < 800) {
            predmetiFormObj.setAttribute('style', 'display: inline-block; text-align: center; width: ' + pageWidth.toString() + 'px; height: ' + heightFormObj + 'px; padding-left: 0px; padding-right: 0px; overflow: auto;');
        } else {
            predmetiFormObj.setAttribute('style', 'display: inline-block; text-align: center; width: 800px; height: ' + heightFormObj + 'px; padding-left: calc(50% - 400px); padding-right: calc(50% - 400px);');
        }
    }
    
};
