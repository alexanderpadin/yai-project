(function() {
	var app = angular.module('controlPanel', []);

	app.controller('controlPanelCtrl', function($scope, $http){
    	
    	$scope.clients = [];
        
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
                        }
                    }
                })
                .error(function(data, status) {
                    alert("Error");
                });
        };

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

        $scope.addItem = function(nombre, expiracion, deuda, metodo, pago, pueblo, servicio, unidades, telefono, pueblo, pago, metodo, deuda) {

            var info = {
                "nombre" : nombre, 
                "expiracion" : expiracion, 
                "deuda" : deuda, 
                "metodo" : metodo, 
                "pago" : pago, 
                "pueblo" : pueblo, 
                "servicio" : servicio, 
                "unidades" : unidades, 
                "telefono" : telefono, 
                "pueblo" : pueblo, 
                "pago" : pago, 
                "metodo" : metodo, 
                "deuda" : deuda
            };

            $http({method : 'POST',
                url : 'https://api.parse.com/1/classes/clientes/clients', 
                headers: {'X-Parse-Application-Id':'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8','X-Parse-REST-API-Key':'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'},
                data: info
                }).success(function(data, status) {
                    alert(data);
                })
                .error(function(data, status) {
                    alert("Error");
                });
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
