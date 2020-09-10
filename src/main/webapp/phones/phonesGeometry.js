/* global phonesOverview_main, phonesAddModify_main, phonesList_main */

var phonesGeometry_main = {
    
    setContactGeometry: function(idContactsDivButtons, idContactsForm) { 
        if (idContactsForm === 'idContactsDataTable') {
            this.adjustDataTable(idContactsForm);
            return;
        }
        
        const styleDivButtonsOverview = window.getComputedStyle(window.document.getElementById(idContactsDivButtons));
        if (styleDivButtonsOverview.height === 'auto') {
            window.document.getElementById(idContactsForm).style.height = 'calc(100% - 40px)'; 
            if (idContactsForm === 'idPhonesFormAddChange') {
                this.adjustFormAddChange('40px');
            }        
            return;
        }
        window.document.getElementById(idContactsForm).style.height = 'calc(100% - ' + styleDivButtonsOverview.height + ')';
        
        this.adjustFormAddChange(styleDivButtonsOverview.height);
    },
    
    adjustDataTable: function(idContactsForm) {
        var elementContactsOverview = window.document.getElementById('idContactsOverview');
        var elementContactsDivButtonsOverview = window.document.getElementById('idContactsDivButtonsOverview');
        var elementiContactsDataTable = window.document.getElementById(idContactsForm);
        
        var heightElementContactOverview = elementContactsOverview.offsetHeight;
        var widthElementContactOverview = elementContactsOverview.offsetWidth;
        var buttonsDivHeight = elementContactsDivButtonsOverview.offsetHeight;
        
        var widthElementContactOverview = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        
        var gridLeft = (widthElementContactOverview - phonesOverview_main.gridWidth) / 2;
        if (gridLeft < 0) {
            gridLeft = 0;
        }
        
        var gridWidth = phonesOverview_main.gridWidth;
        if (gridWidth > widthElementContactOverview) {
            gridWidth = widthElementContactOverview;
        } 
        
        var gridHeight = heightElementContactOverview - (buttonsDivHeight + 8);
        if (gridHeight < phonesOverview_main.gridMinHeight) {
            gridHeight = phonesOverview_main.gridMinHeight;
            gridWidth -= 18;
        }
        
        elementiContactsDataTable.style.left = gridLeft.toString() + 'px';
        elementiContactsDataTable.style.width = gridWidth.toString() + 'px';
        elementiContactsDataTable.style.height = gridHeight.toString() + 'px';
        
        phonesOverview_main.createAndPopulateGrid('idContactsDataTable', phonesList_main.contactsListOverview);
    },
    
    adjustFormAddChange: function(buttonsDivHeight) {
        var contactsAddChangeTitleObj = window.document.getElementById('idPhonesAddChangeTitle');
        const stylePredmetiAddChangeTitle = window.getComputedStyle(contactsAddChangeTitleObj);
        
        var indexPX = buttonsDivHeight.indexOf('px');
        var buttonsDivHeightInt = buttonsDivHeight.substring(0, indexPX);
        
        var contactsFormObj = window.document.getElementById('idPhonesFormInnerAddChange');
            
        var pageWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    
        var pageHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
    
        var heightFormObj = pageHeight - (parseInt(buttonsDivHeightInt) + 30) - 20;

        if (pageWidth < 800) {
            contactsFormObj.setAttribute('style', 'display: inline-block; text-align: center; width: ' + pageWidth.toString() + 'px; height: ' + heightFormObj + 'px; padding-left: 0px; padding-right: 0px; overflow: auto;');
        } else {
            contactsFormObj.setAttribute('style', 'display: inline-block; text-align: center; width: 800px; height: ' + heightFormObj + 'px; padding-left: calc(50% - 400px); padding-right: calc(50% - 400px);');
        }
    }
    
};
