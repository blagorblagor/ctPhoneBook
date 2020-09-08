/* 
    Created on : Sep 14, 2019, 2:37:48 PM
    Author     : goran
*/

/* global accessories_main */

var slickGridSupport_main = {
    
    stringComparer: function(dataRow1, dataRow2, cols) {
        for (var i = 0, numberOfCols = cols.length; i < numberOfCols; i++) {
            var field = cols[i].sortCol.field;
            var sign = cols[i].sortAsc ? 1 : -1;
            var value1 = dataRow1[field].toLowerCase(), value2 = dataRow2[field].toLowerCase();
            var result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result !== 0) {
                return result;
            }
            return 0;
        }
    },
    
    dateComparer: function(dataRow1, dataRow2, cols) {
        for (var i = 0, numberOfCols = cols.length; i < numberOfCols; i++) {
            var field = cols[i].sortCol.field;
            var sign = cols[i].sortAsc ? 1 : -1;
            var value1 = dataRow1[field], value2 = dataRow2[field];
            
            value1 = accessories_main.dateSerbToDateISO(value1);
            value2 = accessories_main.dateSerbToDateISO(value2);
            
            var result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result !== 0) {
                return result;
            }
            return 0;
        }
    },
    
    dateTimeComparer: function(dataRow1, dataRow2, cols) {
        for (var i = 0, numberOfCols = cols.length; i < numberOfCols; i++) {
            var field = cols[i].sortCol.field;
            var sign = cols[i].sortAsc ? 1 : -1;
            var value1 = dataRow1[field], value2 = dataRow2[field];
            
            var indexSpace = value1.indexOf(' ');
            var value1_date = value1.substring(0, indexSpace);
            var value1_time = value1.substring(indexSpace + 1);
            
            var indexSpace = value2.indexOf(' ');
            var value2_date = value2.substring(0, indexSpace);
            var value2_time = value2.substring(indexSpace + 1);
            
            value1_date = accessories_main.dateSerbToDateISO(value1_date);
            value2_date = accessories_main.dateSerbToDateISO(value2_date);
            
            value1 = value1_date + ' ' + value1_time;
            value2 = value2_date + ' ' + value2_time;
            
            var result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result !== 0) {
                return result;
            }
            return 0;
        }
    },
    
    integerComparer: function(dataRow1, dataRow2, cols) {
        for (var i = 0, numberOfCols = cols.length; i < numberOfCols; i++) {
            var field = cols[i].sortCol.field;
            var sign = cols[i].sortAsc ? 1 : -1;
            var value1 = dataRow1[field], value2 = dataRow2[field];
            
            value1 = parseInt(value1);
            value2 = parseInt(value2);
            
            var result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result !== 0) {
                return result;
            }
            return 0;
        }
    },
    
    //////////////////////////////////////
    
    predmetCustomComparer: function(dataRow1, dataRow2, cols) {
        for (var i = 0, numberOfCols = cols.length; i < numberOfCols; i++) {
            var field = cols[i].sortCol.field;
            var sign = cols[i].sortAsc ? 1 : -1;
            var value1 = dataRow1[field], value2 = dataRow2[field];
            
            var foundParts_1 = this.findPredmetEntireNumberParts(value1);
            var literal_1 = foundParts_1[0];
            var number_1 = foundParts_1[1];
            
            var foundParts_2 = this.findPredmetEntireNumberParts(value2);
            var literal_2 = foundParts_2[0];
            var number_2 = foundParts_2[1];
            
            if (literal_1 > literal_2) {
                return (1 * sign);
            } else if (literal_1 < literal_2) {
                return (-1 * sign);
            } else {
                if (number_1 > number_2) {
                    return (1 * sign);
                } else if (number_1 < number_2) {
                    return (-1 * sign);
                }
            }
            
            return 0;
        }
    },
    
    findPredmetEntireNumberParts: function(value) {
        var foundParts = [];
        
        var aNumber = 0;
        var literal = '';
        
        var indexLiteral_P = value.indexOf('P');
        var indexLiteral_TM = value.indexOf('TM-');
        var indexLiteral_V = value.indexOf('V-');
        
        if (indexLiteral_P > 0) {
            literal = value.substring(indexLiteral_P, indexLiteral_P + 1);
            var number_str = value.substring(0, indexLiteral_P);
            aNumber = parseInt(number_str);
        } else if (indexLiteral_TM >= 0) {
            literal = value.substring(0, 3);
            var number_str = value.substring(3);
            aNumber = parseInt(number_str);
        } else if (indexLiteral_V >= 0) {
            literal = value.substring(0, 2);
            var number_str = value.substring(2);
            aNumber = parseInt(number_str);
        } else {
            aNumber = parseInt(value);
        }
        
        foundParts.push(literal);
        foundParts.push(aNumber);
        
        return foundParts;
    }
    
    //////////////////////////////////
    
};

