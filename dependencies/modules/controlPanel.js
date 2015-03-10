(function() {
	var app = angular.module('controlPanel', []);

	app.controller('controlPanelCtrl', function($scope, $http){
    	
    	$scope.clients = "";

        $scope.convertToJson = function(csv) {
            alert("here")
            var lines=csv.split("\n"); 
            var result = [];
            var headers=lines[0].split(",");
             
            for(var i=1;i<lines.length;i++){
                var obj = {};
                var currentline=lines[i].split(",");
                for(var j=0;j<headers.length;j++){
                    obj[headers[j]] = currentline[j];
                }
            result.push(obj);
            }
            return JSON.stringify(result);
        }

        $http.get('database/clientes_ex.json').
            success(function(data, status, headers, config) {
                $scope.clients = data;
            }).
            error(function(data, status, headers, config) {
                alert("Error loading the data.")
        });

    	
    	$scope.modifyEquipment = function() {

           
    	}

    
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
