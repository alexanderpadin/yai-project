(function() {
    var app = angular.module('controlPanel', ['simplePagination']);

    app.controller('controlPanelCtrl', ['$scope', '$http', 'Pagination', function($scope, $http, Pagination) {
        $scope.pagination = Pagination.getNew();
        $scope.clients = [];
        $scope.servicios = [];
        $scope.showActive = true;

        $scope.orderByField = 'expiracion'; //Default sorting
        $scope.reverseSort = false; //Reverse sorting

        $scope.getAllItems = function(queryLimit, querySkip, first) {

            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/clients',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    params: {
                        limit: queryLimit,
                        skip: querySkip,
                        order: "expiracion"
                    },

                }).success(function(data, status) {
                    if (first) {
                        $scope.clients = data.results;
                        first = !first;
                        if ($scope.clients.length == queryLimit) {
                            querySkip += queryLimit;
                            $scope.getAllItems(queryLimit, querySkip, first);
                        } else {
                            $scope.pagination = Pagination.getNew(50); //Generate pagination in table
                            $scope.pagination.numPages = Math.ceil($scope.clients.length / $scope.pagination.perPage); //Generate number of pages
                            //Data ready.

                        }
                    } else {
                        var newQ = data.results;
                        for (var i = 0; i < newQ.length; i++) {
                            $scope.clients.push(newQ[i]);
                        }
                        if ($scope.clients.length == queryLimit + querySkip) {
                            querySkip += queryLimit;
                            $scope.getAllItems(queryLimit, querySkip, first);
                        } else {
                            $scope.pagination = Pagination.getNew(50); //Generate pagination in table
                            $scope.pagination.numPages = Math.ceil($scope.clients.length / $scope.pagination.perPage); //Generate number of pages
                            //Data ready.
                        }
                    }
                })
                .error(function(data, status) {
                    alert("Se ha producido un error obteniendo la lista de clientes.");
                });
        };

        $scope.getServices = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/services',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    params: {
                        limit: 1000
                    },

                }).success(function(data, status) {
                    $scope.servicios = data.results;
                })
                .error(function(data, status) {
                    console.log("Error:" + data + " Status:" + status);
                });
        }

        $scope.capitalizeStr = function(str) {
            return str.replace(/\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
        }

        $scope.addItem = function(Nombre, Expiracion, Deuda, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Clave, Activo, Otro) {
            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/clients',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
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
                        activo: Activo,
                        otro: Otro
                    }
                }).success(function(data, status) {
                    $scope.getAllItems(1000, 0, true);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error creando el nuevo cliente.");
                });
        };

        $scope.validateDate = function(dateString) {
            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
                return false;

            var parts = dateString.split("/");
            var day = parseInt(parts[1], 10);
            var month = parseInt(parts[0], 10);
            var year = parseInt(parts[2], 10);

            if (year < 1000 || year > 3000 || month == 0 || month > 12)
                return false;

            var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
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
            var otro = document.getElementById("add_otro_metodo").value;
            var clave = "";
            var activo = true;
            var deuda = 0;

            if (!((nombre == null || nombre == "") || (expiracion == null || expiracion == "") || (metodo == null || metodo == "") || (pago == null || pago == "") || (servicio == null || servicio == "") || (telefono == null || telefono == ""))) {
                telefono = $scope.phoneFormat(telefono);
                servicio = $scope.servicios[parseInt(document.getElementById('add_servicio').value)].service;
                if ($scope.validateDate(expiracion)) {

                    if($scope.verifyIfClientExist(telefono)) {
                        alert("Usuario ya existe.");
                    } else {
                        document.getElementById('add_nombre').value = "";
                        document.getElementById('add_expiracion').value = "";
                        document.getElementById('add_metodo').value = "";
                        document.getElementById('add_pago').value = "0";
                        document.getElementById('add_pueblo').value = "";
                        document.getElementById('add_servicio').value = "";
                        document.getElementById('add_unidades').value = "1";
                        document.getElementById('add_telefono').value = "";
                        document.getElementById("add_otro_metodo").value = "";

                        metodo = metodo.replace('_', ' ');
                        metodo = $scope.capitalizeStr(metodo);

                        $('#myModal').modal('hide');
                        $scope.addItem(nombre, expiracion, deuda, metodo, pago, pueblo, servicio, unidades, telefono, clave, activo, otro);

                    }

                } else {
                    alert("Fecha de expiracion invalida.");
                }
            } else {
                alert("Llene todo los blancos requeridos.");
            }
        };

        $scope.metodoUpdate = function() {
            var metodo = document.getElementById('add_metodo').value;
            if(metodo == 'otro') {
                $("#add_otro_metodo").show();
                $("#add_otro_metodo_b").show();
                $("#add_otro_metodo_label").show();

            } else {
                $("#add_otro_metodo").hide();
                $("#add_otro_metodo_b").hide();
                $("#add_otro_metodo_label").hide();
                document.getElementById("add_otro_metodo").value = "";
            }
        };

        $scope.metodoModifyUpdate = function() {
            var metodo = document.getElementById('edit_metodo').value;
            if(metodo == 'otro') {
                $("#modify_otro_metodo").show();
                $("#modify_otro_metodo_b").show();
                $("#modify_otro_metodo_label").show();
            } else {
                $("#modify_otro_metodo").hide();
                $("#modify_otro_metodo_b").hide();
                $("#modify_otro_metodo_label").hide();
                document.getElementById("modify_otro_metodo").value = "";
            }
        };
        

        $scope.verifyIfClientExist = function(num) {
            for(var i = 0 ; i < $scope.clients.length ; i++) {
                if($scope.phoneFormat($scope.clients[i].telefono) == $scope.phoneFormat(num)) {
                    return true;
                } 
            }
            return false;
        };

        $scope.phoneFormat = function(phonenum) {
            var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (regexObj.test(phonenum)) {
                var parts = phonenum.match(regexObj);
                var phone = "";
                if (parts[1]) { phone += "+1 (" + parts[1] + ") "; }
                phone += parts[2] + "-" + parts[3];
                return phone;
            }
            else {
                //invalid phone number
                return phonenum;
            }
        }

        $scope.updatePrice = function() {
            if (!(document.getElementById('add_servicio').value == null || document.getElementById('add_servicio').value == "")) {
                document.getElementById('add_pago').value = ($scope.servicios[parseInt(document.getElementById('add_servicio').value)].price * parseInt(document.getElementById('add_unidades').value));
            } else {
                document.getElementById('add_pago').value = 0;
            }
        };

        $scope.edit_updatePrice = function() {
            if (!(document.getElementById('edit_servicio').value == null || document.getElementById('edit_servicio').value == "")) {
                document.getElementById('edit_pago').value = ($scope.servicios[parseInt(document.getElementById('edit_servicio').value)].price * parseInt(document.getElementById('edit_unidades').value));
            } else {
                document.getElementById('edit_pago').value = 0;
            }
        };

        $scope.changeNumberOfPages = function(num) {
            $scope.pagination = Pagination.getNew(num);
            $scope.pagination.numPages = Math.ceil($scope.clients.length / $scope.pagination.perPage);
        };

        $scope.searchGlitch = function() {
            var characters = document.getElementById("searchBar").value;
            if (characters.length > 0) {
                $scope.changeNumberOfPages(100000);
            } else {
                $scope.changeNumberOfPages(50);
            }
        };

        $scope.populateModal = function(ID, nombre, expiracion, servicio, unidades, telefono, pueblo, pago, metodo, deuda, otro) {

            var raw_servicio = servicio;
            metodo = metodo.replace(' ', '_');
            metodo = metodo.toLowerCase();

            servicio = servicio.replace(' ', '_');
            servicio = servicio.toLowerCase();

            for (var i = 0; i < $scope.servicios.length; i++) {
                if (servicio == $scope.servicios[i].name) {
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
            document.getElementById('modify_otro_metodo').value = otro;

            document.getElementById('pagar_nombre').value = nombre;
            document.getElementById('pagar_servicio').value = raw_servicio;
            document.getElementById('pagar_unidades').value = unidades;
            document.getElementById('pagar_pago').value = pago;

            if(metodo != 'otro') {
                document.getElementById('modify_otro_metodo').value = "";
                $("#modify_otro_metodo").hide();
                $("#modify_otro_metodo_b").hide();
                $("#modify_otro_metodo_label").hide();
            } else {
                document.getElementById('modify_otro_metodo').value = otro;
                $("#modify_otro_metodo").show();
                $("#modify_otro_metodo_b").show();
                $("#modify_otro_metodo_label").show();
            }
        };

        $scope.UpdateItem = function(ID, Nombre, Expiracion, Deuda, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Clave, Activo, Otro) {
            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/clients/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
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
                        activo: Activo, 
                        otro: Otro
                    }
                }).success(function(data, status) {
                    alert("El cliente ha sido modificado exitosamente.")
                    $scope.getAllItems(1000, 0, true);
                    $('#editModal').modal('hide');


                    // document.getElementById('pagar_nombre').value = Nombre;
                    // document.getElementById('pagar_servicio').value = Servicio;
                    // document.getElementById('pagar_unidades').value = Unidades;
                    // document.getElementById('pagar_pago').value = Pago;

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
            var otro = document.getElementById('modify_otro_metodo').value;
            var clave = "";
            var activo = true;
            var deuda = 0;

            if (!((nombre == null || nombre == "") || (expiracion == null || expiracion == "") || (metodo == null || metodo == "") || (pago == null || pago == "") || (servicio == null || servicio == ""))) {

                servicio = $scope.servicios[parseInt(document.getElementById('edit_servicio').value)].service;
                if ($scope.validateDate(expiracion)) {

                    metodo = metodo.replace('_', ' ');
                    metodo = $scope.capitalizeStr(metodo);
                    telefono = $scope.phoneFormat(telefono);

                    $scope.UpdateItem(ID, nombre, expiracion, deuda, metodo, pago, pueblo, servicio, unidades, telefono, clave, activo, otro);

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

            if (Expiracion == null || Expiracion == "") {
                alert("Entre nueva fecha de expiracion.")
                return;
            } else if (!($scope.validateDate(Expiracion))) {
                alert("Entre fecha de expiracion valida.");
                return;
            } else {
                $http({
                        method: 'PUT',
                        url: 'https://api.parse.com/1/classes/clients/' + ID,
                        headers: {
                            'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                            'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                        },
                        data: {
                            expiracion: Expiracion,
                        }
                    }).success(function(data, status) {
                        alert("Se realizo el pago exitosamente.");
                        $scope.getAllItems(1000, 0, true);
                        $('#editModal').modal('hide');

                    })
                    .error(function(data, status) {
                        alert("Se ha producido un error realizando el pago del cliente.");
                    });
            }
        };

        $scope.deleteClient = function() {

            var ID = document.getElementById('edit_ID').value;
            $http({
                    method: 'DELETE',
                    url: 'https://api.parse.com/1/classes/clients/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    alert("El cliente ha sido borrado exitosamente.")
                    $("#deleteAlert").hide();
                    $scope.getAllItems(1000, 0, true);
                    $('#editModal').modal('hide')
                })
                .error(function(data, status) {
                    alert("Se ha producido un error borrando el cliente.");
                });
        };

        $scope.verifyDates = function(date, showActive) {
            var today = new Date();
            var expiration = new Date(date);

            if (showActive) {
                document.getElementById("clientsTable").style.background = "#FFFFFF";
                return (expiration < today);
            } else {
                document.getElementById("clientsTable").style.background = "#FFB2B2";
                return (expiration > today);
            }
        };

        $scope.getAllItems(1000, 0, true);
        $scope.getServices();


    }]);

    app.controller("loginCtrl", ['$scope', '$http', function($scope, $http) {

        $scope.validateLoginInputs = function() {
            var username = document.getElementById("login_user").value;
            var password = document.getElementById("login_pass").value;

            if ((username == "" || username == null) ||
                (password == "" || password == null)) {
                document.getElementById("login_alert").innerHTML = "Entre su ID y Password.";
                $("#login_alert").show();
                return;
            } else {
                $("#login_alert").hide();
                $scope.authUser(username, password);
            }
        };

        $scope.authUser = function(username, password) {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/users',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {

                    var validPass = false;
                    var user_username;
                    var user_ID;
                    var user_role;
                    var obj_ID;

                    for (var i = 0; i < data.results.length; i++) {
                        if (data.results[i].username == username && data.results[i].password == password) {
                            validPass = true;
                            user_username = data.results[i].firstName + " " + data.results[i].lastName;
                            user_role = data.results[i].role;
                            user_ID = data.results[i].username;
                            obj_ID = data.results[i].objectId;
                            user_pass = data.results[i].password;
                        }
                    }

                    if (validPass) {
                        document.getElementById("login_user").value = "";
                        document.getElementById("login_pass").value = "";
                        $("#login_alert").hide();
                        document.getElementById("user_header").innerHTML = user_username;
                        document.getElementById("role_header").innerHTML = user_role;
                        document.getElementById("userID_header").innerHTML = user_ID;
                        document.getElementById("objID_header").innerHTML = obj_ID;
                        document.getElementById("pass_header").innerHTML = user_pass;

                        $("#login").modal("hide");
                        //login user!
                        $scope.setRoles(user_role);

                    } else {
                        document.getElementById("login_alert").innerHTML = "Username y/o Password invalido.";
                        $("#login_alert").show();
                    }

                })
                .error(function(data, status) {
                    console.log("Error:" + data + " Status:" + status);
                });
        };

        $scope.setRoles = function(role) {
            if (role == "admin") {
                $(".clientes_tab").show();
                $("#clientes_tab").show();

                $("#tickets_tab").show();
                $("#ventas_tab").show();
                $("#configuracion_tab").show();

                $("#conf_log").show();
                $("#conf_usuarios").show();
                $("#conf_servicios").show();

            } else if (role == "operador") {
                $(".clientes_tab").show();
                $("#clientes_tab").show();

                $("#tickets_tab").show();
                $("#configuracion_tab").show();
                

            } else {
                $(".tickets_tab").show();
                $("#tickets_tab").show();
                $("#configuracion_tab").show();
            }
        };

    }]);


    app.controller("configurationCtrl", ['$scope', '$http', function($scope, $http) {

        $scope.users_conf = [];
        $scope.services_conf = [];
        $scope.logs_conf = [];

        $scope.prepareField = function() {
            $scope.getUsers_conf();
            $scope.getServices_conf();
            $scope.getLogs_conf();
        }

        $scope.getUsers_conf = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/users',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }, 
                    params: {
                        order: "-createdAt"
                    }
                }).success(function(data, status) {
                    $scope.users_conf = data.results;
                })
                .error(function(data, status) {
                    console.log("Error:" + data + " Status:" + status);
                });
        };

        $scope.getServices_conf = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/services',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    params: {
                        order: "-createdAt"
                    }
                }).success(function(data, status) {
                    $scope.services_conf = data.results;
                })
                .error(function(data, status) {
                    console.log("Error:" + data + " Status:" + status);
                });
        };

        $scope.getLogs_conf = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/log',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    $scope.logs_conf = data.results;
                })
                .error(function(data, status) {
                    console.log("Error:" + data + " Status:" + status);
                });
        };

        $scope.changePassword = function(pass) {

            var ID = document.getElementById("objID_header").innerText;
            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/users/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        password: pass,
                    }
                }).success(function(data, status) {
                    alert("Se ha cambiado su contraseña exitosamente.");
                    $('#change_pass').modal('hide');
                })
                .error(function(data, status) {
                    alert("Se ha producido un ERROR modificando su contraseña.");
                });
        };

        $scope.validateChangePass = function() {

            var realPass = document.getElementById("pass_header").innerText;
            var actualPass = document.getElementById("actual_pass").value;
            var newPass1 = document.getElementById("new_pass_1").value;
            var newPass2 = document.getElementById("new_pass_2").value;

            if ((newPass1 == null || newPass1 == "") ||
                (newPass2 == null || newPass2 == "") ||
                (actualPass == null || actualPass == "")) {
                $("#changePass_alert").show();
                document.getElementById("changePass_alert").innerHTML = "Contraseña invalida.";
                return;
            } else if (actualPass != realPass) {
                $("#changePass_alert").show();
                document.getElementById("changePass_alert").innerHTML = "Contraseña invalida.";
                return;
            } else if (newPass1 != newPass2) {
                $("#changePass_alert").show();
                document.getElementById("changePass_alert").innerHTML = "La contraseña no es la misma en las dos entradas.";
                return;
            } else {
                $("#changePass_alert").hide();
                $scope.changePassword(newPass1);
            }
        };

        $scope.validatesAddService = function() {
            var newService = document.getElementById("add_service_config").value;
            var newPrice = document.getElementById("add_pago_config").value;

            if((newService == null || newService == "") || 
                (newPrice == null || newPrice =="")){

                $("#servicio_alert").show();
                return;
            } else {
                $("#servicio_alert").hide();
                $scope.addNewService(newService, newPrice);
            }
        };

        $scope.addNewService = function(newService, newPrice) {

            var newServiceName = newService.split(' ').join('_');
            newServiceName = newServiceName.toLowerCase();

            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/services',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        name: newServiceName,
                        service: newService,
                        price: parseInt(newPrice)
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $("#add_service_modal").modal("hide");
                })
                .error(function(data, status) {
                    alert("Se ha producido un error creando el nuevo servicio.");
                });
        };

        $scope.populateModificarService = function(ID, Servicio, Precio){

            document.getElementById("modificar_service_config").value = Servicio; 
            document.getElementById("modificar_pago_config").value = Precio;
            document.getElementById("modificar_ID_config").value = ID;

            $("#modificar_service_modal").modal("show");
        };

        $scope.validatesModificarService = function() {
            var modi_service = document.getElementById("modificar_service_config").value; 
            var modi_price = document.getElementById("modificar_pago_config").value;
            var modi_id = document.getElementById("modificar_ID_config").value;
            
            if ((modi_service == null || modi_service == "") ||
                (modi_price == null || modi_price == "") ) {
                $("#servicio_modificar_alert").show();
                return;
            } else {
                $("#servicio_modificar_alert").hide();
                $scope.modifyService(modi_id, modi_service, modi_price);
            }
        };

        $scope.modifyService = function(ID, Service, Price) {

            var ServiceName = Service.split(' ').join('_');
            ServiceName = ServiceName.toLowerCase();

            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/services/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        name: ServiceName,
                        service: Service,
                        price: parseInt(Price)
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $("#modificar_service_modal").modal("hide");

                })
                .error(function(data, status) {
                    alert("Se ha producido un error modificando el servicio.");
                });
        };

        $scope.deleteService = function() {

            var ID = document.getElementById('modificar_ID_config').value;
            $http({
                    method: 'DELETE',
                    url: 'https://api.parse.com/1/classes/services/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $('#modificar_service_modal').modal('hide')
                })
                .error(function(data, status) {
                    alert("Se ha producido un error borrando el servicio.");
                });
        };

        $scope.validatesAddUser = function() {

            var newUserFName = document.getElementById("add_user_first").value;
            var newUserLName = document.getElementById("add_user_Last").value;
            var newUserRole = document.getElementById("add_user_role").value;
            var newUserUsername = document.getElementById("add_user_username").value;
            var newUserPass1 = document.getElementById("add_user_pass1").value;
            var newUserPass2 = document.getElementById("add_user_pass2").value;

            if((newUserFName == null || newUserFName == "") || 
                (newUserLName == null || newUserLName =="") ||
                (newUserRole == null || newUserRole =="") ||
                (newUserUsername == null || newUserUsername =="") ||
                (newUserPass1 == null || newUserPass1 =="") ||
                (newUserPass2 == null || newUserPass2 =="")){

                document.getElementById("usuario_alert").innerHTML = "Entre toda la informacion del nuevo usuario.";
                $("#usuario_alert").show();
                return;
            } else if(newUserPass1 != newUserPass2){
                document.getElementById("usuario_alert").innerHTML = "La contraseña no es la misma en las dos entradas."
                $("#usuario_alert").show();
                return;
            } else if($scope.verifyIfNusernameExist(newUserUsername)) {
                document.getElementById("usuario_alert").innerHTML = "Username ya existe."
                $("#usuario_alert").show();
                return;
            } else {
                $("#usuario_alert").hide();
                $scope.addNewUser(newUserFName, newUserLName, newUserUsername, newUserPass1, newUserRole);
            }
        };

        $scope.verifyIfNusernameExist = function(newUsername) {
            for(var i = 0 ; i < $scope.users_conf.length ; i++) {
                if($scope.users_conf[i].username == newUsername) {
                    return true;
                } 
            }
            return false;
        };

        $scope.addNewUser = function(nombre, apellido, usuario, pass, perm) {

            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/users',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        firstName: nombre,
                        lastName: apellido,
                        username: usuario,
                        password: pass,
                        role: perm,
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $("#add_user_modal").modal("hide");
                })
                .error(function(data, status) {
                    alert("Se ha producido un error creando el nuevo usuario.");
                });
        };

        $scope.populateModificarUser = function(m_objectId, m_firstName, m_lastName, m_username, m_password, m_role){

            document.getElementById("modify_user_first").value = m_firstName;
            document.getElementById("modify_user_Last").value = m_lastName;
            document.getElementById("modify_user_username").value = m_username;
            document.getElementById("modify_user_role").value = m_role;
            document.getElementById("modify_user_pass1").value = m_password;
            document.getElementById("modify_user_pass2").value = m_password;
            document.getElementById("modify_user_ID_config").value = m_objectId;


            $("#modificar_user_modal").modal("show");
        };

        $scope.validatesModificarUser = function() {
            var modi_fname = document.getElementById("modify_user_first").value;
            var modi_lname = document.getElementById("modify_user_Last").value;
            var modi_user = document.getElementById("modify_user_username").value;
            var modi_role = document.getElementById("modify_user_role").value;
            var modi_pass1 = document.getElementById("modify_user_pass1").value;
            var modi_pass2 = document.getElementById("modify_user_pass2").value;
            var modi_ID = document.getElementById("modify_user_ID_config").value;
            
            if((modi_fname == null || modi_fname == "") || 
                (modi_lname == null || modi_lname =="") ||
                (modi_user == null || modi_user =="") ||
                (modi_role == null || modi_role =="") ||
                (modi_pass1 == null || modi_pass1 =="") ||
                (modi_pass2 == null || modi_pass2 =="")){

                document.getElementById("user_modificar_alert").innerHTML = "Entre toda la informacion del usuario.";
                $("#user_modificar_alert").show();
                return;
            } else if(modi_pass1 != modi_pass2){
                document.getElementById("user_modificar_alert").innerHTML = "La contraseña no es la misma en las dos entradas."
                $("#user_modificar_alert").show();
                return;
            } else {
                $("#user_modificar_alert").hide();
                $scope.modifyUser(modi_ID, modi_fname, modi_lname, modi_user, modi_pass1, modi_role);
            }

        };

        $scope.modifyUser = function(ID, nombre, apellido, usuario, pass, perm) {
            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/users/' + ID ,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        firstName: nombre,
                        lastName: apellido,
                        username: usuario,
                        password: pass,
                        role: perm,
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $("#modificar_user_modal").modal("hide");
                })
                .error(function(data, status) {
                    alert("Se ha producido un error modificando el usuario.");
                });
        };
        
        $scope.deleteUser = function() {

            var ID = document.getElementById('modify_user_ID_config').value;
            $http({
                    method: 'DELETE',
                    url: 'https://api.parse.com/1/classes/users/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $('#modificar_user_modal').modal('hide')
                })
                .error(function(data, status) {
                    alert("Se ha producido un error borrando el usuario.");
                });
        };

        $scope.prepareField();

    }]);

})();









