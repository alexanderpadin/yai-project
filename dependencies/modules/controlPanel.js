(function() {
	var app = angular.module('controlPanel', ['simplePagination']);

	app.controller('controlPanelCtrl', ['$scope', '$http', 'Pagination', function($scope, $http, Pagination){
    	$scope.pagination = Pagination.getNew(); 
    	$scope.clients = [];
        $scope.servicios = [];
        $scope.showActive = true;

        $scope.orderByField = 'expiracion'; //Default sorting
        $scope.reverseSort = false; //Reverse sorting
        
        $scope.getAllItems = function(queryLimit, querySkip, first) {

            $http({method : 'GET',
                url : 'https://api.parse.com/1/classes/clients', 
                headers: { 'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8','X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'},
                params: {limit:queryLimit, skip:querySkip, order: "expiracion"},
                
            }).success(function(data, status) {
                    if(first) {
                        $scope.clients = data.results;
                        first = !first;
                        if($scope.clients.length == queryLimit) {
                            querySkip += queryLimit;
                            $scope.getAllItems(queryLimit, querySkip, first);
                        } else {
                            $scope.pagination = Pagination.getNew(50); //Generate pagination in table
                            $scope.pagination.numPages = Math.ceil($scope.clients.length/$scope.pagination.perPage); //Generate number of pages
                            //Data ready.
                            
                        }
                    } else {
                        var newQ = data.results;
                        for (var i = 0 ; i < newQ.length ; i++) {
                          $scope.clients.push(newQ[i]);
                        }
                        if($scope.clients.length == queryLimit + querySkip) {
                            querySkip += queryLimit;
                            $scope.getAllItems(queryLimit, querySkip, first);
                        } else {
                            $scope.pagination = Pagination.getNew(50); //Generate pagination in table
                            $scope.pagination.numPages = Math.ceil($scope.clients.length/$scope.pagination.perPage); //Generate number of pages
                            //Data ready.
                        }
                    }
                })
                .error(function(data, status) {
                    alert("Error");
                });
        };

        $scope.getServices = function() {
             $http({method : 'GET',
                url : 'https://api.parse.com/1/classes/services', 
                headers: { 'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8','X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'},
                params: {limit:1000},
                
                }).success(function(data, status) {
                        $scope.servicios = data.results;
                    })
                .error(function(data, status) {
                    console.log("Error:" + data + " Status:" + status);
                });
        }

        $scope.capitalizeStr = function(str){
            return str.replace(/\w\S*/g, 
                function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
        }

        $scope.addItem = function(Nombre, Expiracion, Deuda, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Clave, Activo) {
            $http({
                    method : 'POST',
                    url : 'https://api.parse.com/1/classes/clients', 
                    headers: { 
                        'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        nombre: Nombre,
                        expiracion: Expiracion,
                        deuda: parseInt(Deuda),
                        metodo: Metodo,
                        pago: parseInt(Pago),
                        pueblo: Pueblo,
                        servicio: Servicio,
                        unidades: parseInt(Unidades),
                        telefono: Telefono,
                        clave: Clave,
                        activo: Activo
                    }
                }).success(function(data, status) {
                     $scope.getAllItems(1000,0, true);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error creando el nuevo cliente.");
                });
        };

        $scope.validateDate = function(dateString) {
            if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
                return false;

            var parts = dateString.split("/");
            var day = parseInt(parts[1], 10);
            var month = parseInt(parts[0], 10);
            var year = parseInt(parts[2], 10);

            if(year < 1000 || year > 3000 || month == 0 || month > 12)
                return false;

            var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

            if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                monthLength[1] = 29;

            return day > 0 && day <= monthLength[month - 1];
        };

        $scope.validatesAddInputs = function() {

            var nombre = document.getElementById('add_nombre').value;
            var expiracion = document.getElementById('add_expiracion').value;
            var metodo = document.getElementById('add_metodo').value;
            var pago = document.getElementById('add_pago').value;
            var pueblo = document.getElementById('add_pueblo').value;
            var servicio = document.getElementById('add_servicio').value;
            var unidades = document.getElementById('add_unidades').value;
            var telefono = document.getElementById('add_telefono').value;
            var clave = "";
            var activo = true;
            var deuda = 0;

            if(!((nombre == null || nombre == "") 
                || (expiracion == null || expiracion == "")
                || (metodo == null || metodo == "")
                || (pago == null || pago == "")
                || (servicio == null || servicio == ""))){

                servicio = $scope.servicios[parseInt(document.getElementById('add_servicio').value)].service;
                if($scope.validateDate(expiracion)) {
                    document.getElementById('add_nombre').value = "";
                    document.getElementById('add_expiracion').value = "";
                    document.getElementById('add_metodo').value = "";
                    document.getElementById('add_pago').value = "0";
                    document.getElementById('add_pueblo').value = "";
                    document.getElementById('add_servicio').value = "";
                    document.getElementById('add_unidades').value = "1";
                    document.getElementById('add_telefono').value = "";

                    metodo = metodo.replace('_',' ');
                    metodo = $scope.capitalizeStr(metodo);

                    $('#myModal').modal('hide');

                    $scope.addItem(nombre, expiracion, deuda, metodo, pago, pueblo, servicio, unidades, telefono, clave, activo);
                   
                } else {
                    alert("Fecha de expiracion invalida.");
                }
            } else {
                alert("Llene todo los blancos requeridos.");
            }
        };

        $scope.updatePrice = function(){
            if(!(document.getElementById('add_servicio').value == null || document.getElementById('add_servicio').value == "")) {
                document.getElementById('add_pago').value = ($scope.servicios[parseInt(document.getElementById('add_servicio').value)].price * parseInt(document.getElementById('add_unidades').value));
            } else {
                document.getElementById('add_pago').value = 0;
            }
        };

        $scope.edit_updatePrice = function() {
            if(!(document.getElementById('edit_servicio').value == null || document.getElementById('edit_servicio').value == "")) {
                document.getElementById('edit_pago').value = ($scope.servicios[parseInt(document.getElementById('edit_servicio').value)].price * parseInt(document.getElementById('edit_unidades').value));
            } else {
                document.getElementById('edit_pago').value = 0;
            }
        };

        $scope.changeNumberOfPages = function(num){
            $scope.pagination = Pagination.getNew(num);
            $scope.pagination.numPages = Math.ceil($scope.clients.length/$scope.pagination.perPage);
        };

        $scope.searchGlitch = function() {
                     var characters = document.getElementById("searchBar").value;
                     if(characters.length > 0) {
                        $scope.changeNumberOfPages(100000);
                     } else {
                        $scope.changeNumberOfPages(50);
                     }
        };

        $scope.populateModal = function(ID, nombre, expiracion, servicio, unidades, telefono, pueblo, pago, metodo, deuda) {
            
            var raw_servicio = servicio;
            metodo = metodo.replace(' ','_');
            metodo = metodo.toLowerCase();

            servicio = servicio.replace(' ', '_');
            servicio = servicio.toLowerCase();

            for(var i = 0 ; i < $scope.servicios.length ; i++) {
                if(servicio == $scope.servicios[i].name) {
                     document.getElementById('edit_servicio').value = i;
                }
            }

            document.getElementById('edit_ID').value = ID;
            document.getElementById('edit_nombre').value = nombre;
            document.getElementById('edit_expiracion').value = expiracion;
            document.getElementById('edit_unidades').value = unidades;
            document.getElementById('edit_telefono').value = telefono;
            document.getElementById('edit_pueblo').value = pueblo;
            document.getElementById('edit_pago').value = pago;
            document.getElementById('edit_metodo').value = metodo;

            document.getElementById('pagar_nombre').value = nombre;
            document.getElementById('pagar_servicio').value = raw_servicio;
            document.getElementById('pagar_unidades').value = unidades;
            document.getElementById('pagar_pago').value = pago;
        };

        $scope.UpdateItem = function(ID, Nombre, Expiracion, Deuda, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Clave, Activo) {
            $http({
                    method : 'PUT',
                    url : 'https://api.parse.com/1/classes/clients/' + ID, 
                    headers: { 
                        'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        nombre: Nombre,
                        expiracion: Expiracion,
                        deuda: parseInt(Deuda),
                        metodo: Metodo,
                        pago: parseInt(Pago),
                        pueblo: Pueblo,
                        servicio: Servicio,
                        unidades: parseInt(Unidades),
                        telefono: Telefono,
                        clave: Clave,
                        activo: Activo
                    }
                }).success(function(data, status) {
                    alert("El cliente ha sido modificado exitosamente.")
                    $scope.getAllItems(1000,0, true);

                    document.getElementById('pagar_nombre').value = Nombre;
                    document.getElementById('pagar_servicio').value = Servicio;
                    document.getElementById('pagar_unidades').value = Unidades;
                    document.getElementById('pagar_pago').value = Pago;

                })
                .error(function(data, status) {
                    alert("Se ha producido un error modificando el cliente.");
                });
        };

        $scope.modifyClient = function() {
            var ID = document.getElementById('edit_ID').value;
            var nombre = document.getElementById('edit_nombre').value;
            var expiracion = document.getElementById('edit_expiracion').value;
            var metodo = document.getElementById('edit_metodo').value;
            var pago = document.getElementById('edit_pago').value;
            var pueblo = document.getElementById('edit_pueblo').value;
            var servicio = document.getElementById('edit_servicio').value;
            var unidades = document.getElementById('edit_unidades').value;
            var telefono = document.getElementById('edit_telefono').value;
            var clave = "";
            var activo = true;
            var deuda = 0;

            if(!((nombre == null || nombre == "") 
                || (expiracion == null || expiracion == "")
                || (metodo == null || metodo == "")
                || (pago == null || pago == "")
                || (servicio == null || servicio == ""))){

                servicio = $scope.servicios[parseInt(document.getElementById('edit_servicio').value)].service;
                if($scope.validateDate(expiracion)) {
                    
                    metodo = metodo.replace('_',' ');
                    metodo = $scope.capitalizeStr(metodo);

                    $scope.UpdateItem(ID, nombre, expiracion, deuda, metodo, pago, pueblo, servicio, unidades, telefono, clave, activo);
                   
                } else {
                    alert("Fecha de expiracion invalida.");
                }
            } else {
                alert("Llene todo los blancos requeridos.");
            }
        };

        $scope.makePayment = function() {

            var ID = document.getElementById('edit_ID').value;
            var Expiracion = document.getElementById('pagar_expiracion').value;

            if(Expiracion == null || Expiracion == "") {
                alert("Entre nueva fecha de expiracion.")
                return;
            } else if(!($scope.validateDate(Expiracion))) {
                alert("Entre fecha de expiracion valida.");
                return;
            } else {
                $http({
                    method : 'PUT',
                    url : 'https://api.parse.com/1/classes/clients/' + ID, 
                    headers: { 
                        'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        expiracion: Expiracion,
                    }
                }).success(function(data, status) {
                    alert("Se realizo el pago exitosamente.");
                    $scope.getAllItems(1000,0, true);

                })
                .error(function(data, status) {
                    alert("Se ha producido un error realizando el pago del cliente.");
                });
            }
        };

        $scope.deleteClient = function() {

            var ID = document.getElementById('edit_ID').value;
            $http({
                    method : 'DELETE',
                    url : 'https://api.parse.com/1/classes/clients/' + ID, 
                    headers: { 
                        'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    alert("El cliente ha sido borrado exitosamente.")
                    $("#deleteAlert").hide();
                    $scope.getAllItems(1000,0, true);
                    $('#editModal').modal('hide')
                })
                .error(function(data, status) {
                    alert("Se ha producido un error borrando el cliente.");
                });
        };

        $scope.verifyDates = function(date, showActive) {
            var today = new Date();
            var expiration = new Date(date);

            if(showActive) {
                document.getElementById("clientsTable").style.background = "#FFFFFF";
                return (expiration < today);
            } else {
                document.getElementById("clientsTable").style.background = "#FF6666";
                return (expiration > today);
            }                  
        };

        $scope.getAllItems(1000,0, true);
        $scope.getServices();
        
  	}]);
    
})();
