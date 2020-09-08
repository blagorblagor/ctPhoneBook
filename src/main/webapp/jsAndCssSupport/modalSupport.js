/* 
    Created on : Sep 01, 2019, 6:37:48 PM
    Author     : goran
*/

var modalSupport_main = {    
    setComponentAccessibility: function(enableAccess) {
        if (!enableAccess) {
            var divModal = window.document.createElement("div");
            divModal.id = "idDivModal";
            divModal.className += "modalOverlay";
            window.document.body.appendChild(divModal);
        } else {
            var divModal = window.document.getElementById("idDivModal");
            divModal.remove();
        }
    },
    
    setPointerCursor: function() {
        var divModal = window.document.getElementById("idDivModal");
        divModal.style.cursor = 'default';
    }
};


