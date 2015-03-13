(function() {
	var app = angular.module('controlPanel', []);

	app.controller('controlPanelCtrl', function($scope, $http){
    	
    	$scope.clients = [];
        $scope.servicios = [];
        
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
                            //Data ready.
                            $scope.getServices();
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
                            //Data Ready
                            $scope.getServices();
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

        $scope.updateItem = function(ID, info) {
            $http({method : 'PUT',
                url : 'https://api.parse.com/1/classes/clientes/' + ID, 
                headers: {'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8','X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'},
                data: info
                }).success(function(data, status) {
                    alert(data);
                })
                .error(function(data, status) {
                    alert("Error");
                });
        };

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
            var servicio = $scope.servicios[parseInt(document.getElementById('add_servicio').value)].service;
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

                if($scope.validateDate(expiracion)) {

                    $scope.addItem(nombre, expiracion, deuda, metodo, pago, pueblo, servicio, unidades, telefono, clave, activo);
                   
                    var nombre = document.getElementById('add_nombre').value = "";
                    var expiracion = document.getElementById('add_expiracion').value = "";
                    var metodo = document.getElementById('add_metodo').value = "Selecciona";
                    var pago = document.getElementById('add_pago').value = "";
                    var pueblo = document.getElementById('add_pueblo').value = "";
                    var servicio = document.getElementById('add_servicio').value = "Selecciona";
                    var unidades = document.getElementById('add_unidades').value = "";
                    var telefono = document.getElementById('add_telefono').value = "";

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

        $scope.getAllItems(1000,0, true);
        
  	});

    //Filtro para los quipos en la tabla
	app.filter('array', function() {
	  return function(items) {
	    var filtered = [];
	    angular.forEach(items, function(item) {
	      filtered.push(item);
	    });
	   return filtered;
	  };
	});
})();
