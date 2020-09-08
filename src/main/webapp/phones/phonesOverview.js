/* 
    Created on : Sep 11, 2019, 10:02:15 AM
    Author     : goran
*/

/* global Slick, slickGridSupport_main */

phonesOverview_dataViewSlick = null;
phonesOverview_gridSlick = null;

var phonesOverview_main = {
    
    //gridWidth: 1425,
    gridWidth: 600,
    gridMinHeight: 400,
    
    createAndPopulateGrid: function(idPredmetiDataTable, predmetiOverview) {
        var elementDataTable = window.document.getElementById(idPredmetiDataTable);
        var data = predmetiOverview;
        
        var options = {
            enableCellNavigation: true,
            enableColumnReorder: true,
            multiColumnSort: true,
            syncColumnCellResize: true,
            showHeaderRow: true,
            headerRowHeight: 32,
            explicitInitialization: true,
            multiSelect: false
        };
        
        var invisibleIdColumnDefContactID = {id: "id_contacts", name: "", field: "id_contacts", width: 0, minWidth: 0, maxWidth: 0, sortable: true, hidden: true, cssClass: "invisibleColumn", headerCssClass: "invisibleColumn"};
        var invisibleIdColumnDefPhoneID = {id: "id_phones", name: "", field: "id_phones", width: 0, minWidth: 0, maxWidth: 0, sortable: true, hidden: true, cssClass: "invisibleColumn", headerCssClass: "invisibleColumn"};
        var columns = [
            invisibleIdColumnDefContactID,
            invisibleIdColumnDefPhoneID,
            //{id: "brojPredmetaPotpun", name: "Predmet", field: "brojPredmetaPotpun", width: 104, sortable: true, cssClass: "cellGridTextRightAllignment", headerCssClass: "headerCellGridTextRightAllignment"},
            {id: "name", name: "Name", field: "name", width: 140, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            {id: "nickname", name: "Nickname", field: "nickname", width: 140, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            {id: "surname", name: "Surname", field: "surname", width: 140, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            //{id: "datumPodnosenja", name: "Datum podnošenja", field: "datumPodnosenja", width: 135, sortable: true, cssClass: "cellGridTextRightAllignment", headerCssClass: "headerCellGridTextRightAllignment"},
            {id: "phone", name: "Phone", field: "phone", width: 162, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"}
            //{id: "zastupnikNaziv", name: "Zastupnik", field: "zastupnikNaziv", width: 162, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            //{id: "primalacRacunaNaziv", name: "Račun dobija", field: "primalacRacunaNaziv", width: 162, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            //{id: "datumIsteka", name: "Pravo ističe", field: "datumIsteka", width: 90, sortable: true, cssClass: "cellGridTextRightAllignment", headerCssClass: "headerCellGridTextRightAllignment"},
            //{id: "datumVaziDo", name: "Važi do", field: "datumVaziDo", width: 90, sortable: true, cssClass: "cellGridTextRightAllignment", headerCssClass: "headerCellGridTextRightAllignment"},
            //{id: "datumPlacanja", name: "Taksu platiti do", field: "datumPlacanja", width: 110, sortable: true, cssClass: "cellGridTextRightAllignment", headerCssClass: "headerCellGridTextRightAllignment"}
        ];
        
        var columnFilters = {};
        
        function filter(item) {   
            phonesOverview_gridSlick.resetActiveCell();
            phonesOverview_gridSlick.setSelectedRows([]);
            
            for (var columnId in columnFilters) {
                if (columnId !== undefined && columnFilters[columnId] !== '') {
                    var c = phonesOverview_gridSlick.getColumns()[phonesOverview_gridSlick.getColumnIndex(columnId)];
                    var indexFilterStr = item[c.field].toLowerCase().indexOf(columnFilters[columnId].toLowerCase());
                    if (indexFilterStr !== 0) {
                        return false;
                    }
                }
            }
            
            return true;
        }
        
        phonesOverview_dataViewSlick = new Slick.Data.DataView();
        phonesOverview_gridSlick = new Slick.Grid(elementDataTable, phonesOverview_dataViewSlick, columns, options);
        
        phonesOverview_gridSlick.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow:true}));
        
        phonesOverview_dataViewSlick.onRowCountChanged.subscribe(function (e, args) {
            phonesOverview_gridSlick.updateRowCount();
            phonesOverview_gridSlick.render();
        });
        
        phonesOverview_dataViewSlick.onRowsChanged.subscribe(function (e, args) {
            phonesOverview_gridSlick.invalidateRows(args.rows);
            phonesOverview_gridSlick.render();
        });
        
        phonesOverview_gridSlick.onColumnsResized.subscribe(function (e, args) {
            var columnsLocal = phonesOverview_gridSlick.getColumns();
            columnsLocal[0] = invisibleIdColumnDefContactID;
            phonesOverview_gridSlick.setColumns(columnsLocal);
        });
        
        $(phonesOverview_gridSlick.getHeaderRow()).delegate(":input", "change keyup", function (e) {
            var columnId = $(this).data("columnId");
            if (columnId !== null) {
                columnFilters[columnId] = $.trim($(this).val());
                phonesOverview_dataViewSlick.refresh();
            }
        });
        
        phonesOverview_gridSlick.onHeaderRowCellRendered.subscribe(function(e, args) {
            if (args.column.id === 'id_contacts') {
                return;
            }
            
            $(args.node).empty();
            $("<input type='text'>")
               .data("columnId", args.column.id)
               .val(columnFilters[args.column.id])
               .appendTo(args.node);
        });
        
        phonesOverview_gridSlick.onSelectedRowsChanged.subscribe(function(e,args){
            var elementDugmeIzmenaPregledi = window.document.getElementById('idDugmeIzmenaPregledi');
            var elementDugmeUklanjanjePregledi = window.document.getElementById('idDugmeUklanjanjePregledi');
            //var elementDugmeDokumentacijaPregledi = window.document.getElementById('idDugmeDokumentacijaPregledi');
            
            var selectedRows = phonesOverview_gridSlick.getSelectedRows();
            if (selectedRows[0] !== undefined) {
                elementDugmeIzmenaPregledi.disabled = false;
                elementDugmeUklanjanjePregledi.disabled = false;
                //elementDugmeDokumentacijaPregledi.disabled = false;
            } else {
                elementDugmeIzmenaPregledi.disabled = true;
                elementDugmeUklanjanjePregledi.disabled = true;
                //elementDugmeDokumentacijaPregledi.disabled = true;
            }
        });
	 
        phonesOverview_gridSlick.onSort.subscribe(function (e, args) {            
            var cols = args.sortCols;
            var columnID = args.sortCols[0].sortCol.id;
            
            var comparer = function(dataRow1, dataRow2) {
                /*if (columnID === 'brojPredmetaPotpun') {
                    return slickGridSupport_main.predmetCustomComparer(dataRow1, dataRow2, cols);
                } else*/ if (columnID === 'epBroj') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'brojPrijave') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'registarskiBroj') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } /*else if (columnID === 'datumPodnosenja') {
                    return slickGridSupport_main.dateComparer(dataRow1, dataRow2, cols);
                }*/ else if (columnID === 'nosilacPravaNaziv') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                }/* else if (columnID === 'zastupnikNaziv') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'primalacRacunaNaziv') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'datumIsteka') {
                    return slickGridSupport_main.dateComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'datumVaziDo') {
                    return slickGridSupport_main.dateComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'datumPlacanja') {
                    return slickGridSupport_main.dateComparer(dataRow1, dataRow2, cols);
                }*/
            };
            
            phonesOverview_dataViewSlick.sort(comparer);
            
            phonesOverview_gridSlick.invalidate();
            phonesOverview_gridSlick.render();
        });
        
        phonesOverview_gridSlick.init();
        //phonesOverview_gridSlick.setSortColumn("brojPredmetaPotpun", true);
        phonesOverview_gridSlick.setSortColumn('id_contacts', true);
        
        phonesOverview_dataViewSlick.beginUpdate();
        phonesOverview_dataViewSlick.setItems(data);
        phonesOverview_dataViewSlick.setFilter(filter);
        phonesOverview_dataViewSlick.endUpdate();
        
        phonesOverview_gridSlick.invalidate();
        phonesOverview_gridSlick.render();
    }
    
};

