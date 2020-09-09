/* global Slick, slickGridSupport_main */

phonesOverview_dataViewSlick = null;
phonesOverview_gridSlick = null;

var phonesOverview_main = {
    
    gridWidth: 600,
    gridMinHeight: 400,
    
    createAndPopulateGrid: function(idContactsDataTable, predmetiOverview) {
        var elementDataTable = window.document.getElementById(idContactsDataTable);
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
        
        var invisibleIdColumnDefContactID = {id: "id", name: "", field: "id", width: 0, minWidth: 0, maxWidth: 0, sortable: true, hidden: true, cssClass: "invisibleColumn", headerCssClass: "invisibleColumn"};
        var invisibleIdColumnDefPhoneID = {id: "id_phones", name: "", field: "id_phones", width: 0, minWidth: 0, maxWidth: 0, sortable: true, hidden: true, cssClass: "invisibleColumn", headerCssClass: "invisibleColumn"};
        var columns = [
            invisibleIdColumnDefContactID,
            invisibleIdColumnDefPhoneID,
            {id: "name", name: "Name", field: "name", width: 140, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            {id: "nickname", name: "Nickname", field: "nickname", width: 140, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            {id: "surname", name: "Surname", field: "surname", width: 140, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"},
            {id: "phone_number", name: "Phone", field: "phone_number", width: 162, sortable: true, cssClass: "cellGridTextLeftAllignment", headerCssClass: "headerCellGridTextLeftAllignment"}
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
            var elementButtonModifyOverview = window.document.getElementById('idButtonModifyOverview');
            var elementDeleteOverview = window.document.getElementById('idButtonDeleteOverview');
            
            var selectedRows = phonesOverview_gridSlick.getSelectedRows();
            if (selectedRows[0] !== undefined) {
                elementButtonModifyOverview.disabled = false;
                elementDeleteOverview.disabled = false;
            } else {
                elementButtonModifyOverview.disabled = true;
                elementDeleteOverview.disabled = true;
            }
        });
	 
        phonesOverview_gridSlick.onSort.subscribe(function (e, args) {            
            var cols = args.sortCols;
            var columnID = args.sortCols[0].sortCol.id;
            
            var comparer = function(dataRow1, dataRow2) {
                if (columnID === 'name') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'nickname') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'surname') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                } else if (columnID === 'phone_number') {
                    return slickGridSupport_main.stringComparer(dataRow1, dataRow2, cols);
                }
            };
            
            phonesOverview_dataViewSlick.sort(comparer);
            
            phonesOverview_gridSlick.invalidate();
            phonesOverview_gridSlick.render();
        });
        
        phonesOverview_gridSlick.init();
        //phonesOverview_gridSlick.setSortColumn('name', true);
        
        phonesOverview_dataViewSlick.beginUpdate();
        phonesOverview_dataViewSlick.setItems(data);
        phonesOverview_dataViewSlick.setFilter(filter);
        phonesOverview_dataViewSlick.endUpdate();
        
        phonesOverview_gridSlick.invalidate();
        phonesOverview_gridSlick.render();
    }
    
};

