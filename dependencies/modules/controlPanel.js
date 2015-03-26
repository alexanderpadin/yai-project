(function() {
    var app = angular.module('controlPanel', ['simplePagination']);

    app.controller('controlPanelCtrl', ['$scope', '$http', 'Pagination', function($scope, $http, Pagination) {
        
        $scope.pagination = Pagination.getNew();
        $scope.clients = [];
        $scope.servicios = [];
        $scope.showActive = true;

        $scope.orderByField = 'expiracion'; //Default sorting
        $scope.reverseSort = false; //Reverse sorting

        $scope.numberOfPagesinClients = 50;


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
                            $scope.pagination = Pagination.getNew($scope.numberOfPagesinClients); //Generate pagination in table

                            $scope.pagination.numPages = Math.ceil($scope.clients.length / $scope.pagination.perPage); //Generate number of pages
                            document.getElementById("numberOfClients").innerHTML = 'Clientes: ' + $scope.numberOfPagesinClients + ' de ' + $scope.clients.length +' total'
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
                            $scope.pagination = Pagination.getNew($scope.numberOfPagesinClients); //Generate pagination in table
                            $scope.pagination.numPages = Math.ceil($scope.clients.length / $scope.pagination.perPage); //Generate number of pages
                            document.getElementById("numberOfClients").innerHTML = 'Clientes: ' + $scope.numberOfPagesinClients + ' de ' + $scope.clients.length +' total'
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
                });
        }

        $scope.capitalizeStr = function(str) {
            return str.replace(/\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
        }

        $scope.generateDate = function() {
            var date = new Date();
            var mo = date.getMonth() + 1;
            var day = date.getDate();
            var y = date.getFullYear();
            var h = date.getHours();
            var m = date.getMinutes();

            var newDate = mo + '/' + day +'/'+ y;
   
            h = ("0" + h).slice(-2);
            m = ("0" + m).slice(-2);

            var fourDigitTime = h +''+ m;


            var hours24 = parseInt(fourDigitTime.substring(0, 2),10);
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? ' PM' : ' AM';
            var minutes = fourDigitTime.substring(2);

            newDate = newDate + ' ' + hours + ':' + minutes + amPm;
            return newDate;
        }

        $scope.insertLog = function(Action) {
            var USER = document.getElementById('user_header').innerText;
            var ROL =  document.getElementById('role_header').innerText;
            var FECHA = $scope.generateDate();

            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/log',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        usuario: USER,
                        rol: ROL,
                        accion: Action,
                        fecha: FECHA
                    }
                }).success(function(data, status) {
                    
                })
                .error(function(data, status) {
                });
        }

        $scope.addItem = function(Nombre, Expiracion, Deuda, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Clave, Activo, Otro) {
            var action = "Nuevo Cliente: " + Nombre + " con servicio de " + Servicio + " en " + Pueblo; 
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
                    $scope.insertLog(action);
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
            $scope.numberOfPagesinClients = num;
            $scope.pagination = Pagination.getNew($scope.numberOfPagesinClients);
            $scope.pagination.numPages = Math.ceil($scope.clients.length / $scope.pagination.perPage);
            if($scope.numberOfPagesinClients > $scope.clients.length ) {
                document.getElementById("numberOfClients").innerHTML = 'Clientes: ' + $scope.clients.length + ' de ' + $scope.clients.length +' total'
            } else {
                document.getElementById("numberOfClients").innerHTML = 'Clientes: ' + $scope.numberOfPagesinClients + ' de ' + $scope.clients.length +' total'
            } 
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

                    var raw_servicio = servicio;
                    metodo = metodo.replace(' ', '_');
                    metodo = metodo.toLowerCase();

                    document.getElementById('edit_servicio_print').value = servicio;
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

                    var d = new Date(expiracion);
                    d.setMonth( d.getMonth( ) + 1 );
                    document.getElementById("pagar_expiracion").value = ( d.getMonth( ) + 1 ) + '/' + d.getDate( ) + '/' + d.getFullYear( );

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

                    $scope.storeTempModifications();
                })
                .error(function(data, status) {
                });
        };

        $scope.storeTempModifications = function() {
            var nom = document.getElementById('edit_nombre').value;
            var exp = document.getElementById('edit_expiracion').value;
            var serv = document.getElementById('edit_servicio_print').value;
            var uni = document.getElementById('edit_unidades').value;
            var tel = document.getElementById('edit_telefono').value;
            var pue = document.getElementById('edit_pueblo').value;
            var pag = document.getElementById('edit_pago').value;
            var met = document.getElementById('edit_metodo').value;
            var otr = document.getElementById('modify_otro_metodo').value;

            $scope.tempModifications = {
                'nombre': nom,
                'expiracion': exp,
                'metodo': met,
                'pago': pag,
                'pueblo': pue,
                'servicio': serv,
                'unidades': uni,
                'telefono': tel,
                'otro': otr
            };
        };

        $scope.checkWhichIsDiff = function(old, Nombre, Expiracion, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Otro) {
            var changes = "(";

            if (old.nombre != Nombre) {
                changes += "nombre, ";
            }
            if (old.expiracion != Expiracion) {
                changes += "expiracion de pago, ";
            }
            if (old.metodo != Metodo.toLowerCase() || old.otro != Otro) {
                changes += "metodo de pago, ";
            }
            if (old.pago != Pago) {
                changes += "cantidad de pago, ";
            }
            if (old.pueblo != Pueblo) {
                changes += "pueblo, ";
            }
            if (old.servicio != Servicio) {
                changes += "plan de servicio, ";
            }
            if (old.unidades != Unidades) {
                changes += "numero de unidades de servicio, ";
            }
            if (old.telefono != Telefono) {
                changes += "telefono, ";
            }
            
            
            changes += ".)";
            changes = changes.replace(", .", '');
            
            return changes;

        };

        $scope.UpdateItem = function(ID, Nombre, Expiracion, Deuda, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Clave, Activo, Otro) {

            var cambios = $scope.checkWhichIsDiff($scope.tempModifications, Nombre, Expiracion, Metodo, Pago, Pueblo, Servicio, Unidades, Telefono, Otro);
            var action = "Modifico Cliente: " + Nombre + " modificacion en " + cambios;

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
                    $scope.insertLog(action); 
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
            var servicio = document.getElementById('edit_servicio_print').value;
            var unidades = document.getElementById('edit_unidades').value;
            var telefono = document.getElementById('edit_telefono').value;
            var otro = document.getElementById('modify_otro_metodo').value;
            var clave = "";
            var activo = true;
            var deuda = 0;

            if (!((nombre == null || nombre == "") || (expiracion == null || expiracion == "") || (metodo == null || metodo == "") || (pago == null || pago == "") || (servicio == null || servicio == ""))) {

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

        $scope.printService = function(value) {
            if(value == "" || value == null) {
                document.getElementById("edit_servicio_print").value = "";
            } else {
                document.getElementById("edit_servicio_print").value = value.service;
                document.getElementById("edit_servicio").value = "";
            }
        };

        $scope.makePayment = function() {
            var ID = document.getElementById('edit_ID').value;
            var Expiracion = document.getElementById('pagar_expiracion').value;
            var CLIENTE = document.getElementById('pagar_nombre').value;
            var SERVICIO = document.getElementById('pagar_servicio').value;
            var PAGO = document.getElementById('pagar_pago').value;

            var action = "Ejecuto Pago: ($" + PAGO + ".00) " + CLIENTE + " con servicio " + SERVICIO;

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
                        $scope.insertLog(action);

                    })
                    .error(function(data, status) {
                        alert("Se ha producido un error realizando el pago del cliente.");
                    });
            }
        };

        $scope.deleteClient = function() {
            var CLIENTE = document.getElementById('pagar_nombre').value;
            var SERVICIO = document.getElementById('pagar_servicio').value;
            var action = "Borro Cliente: " + CLIENTE + " con servicio " + SERVICIO;

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
                    $scope.insertLog(action); 
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
                    var userFirstName;

                    for (var i = 0; i < data.results.length; i++) {
                        if (data.results[i].username == username && data.results[i].password == password) {
                            validPass = true;
                            user_username = data.results[i].firstName + " " + data.results[i].lastName;
                            user_role = data.results[i].role;
                            user_ID = data.results[i].username;
                            obj_ID = data.results[i].objectId;
                            user_pass = data.results[i].password;
                            userFirstName = data.results[i].firstName;
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
                        document.getElementById("user_tk_firstName").value = userFirstName;

                        $("#login").modal("hide");
                        //login user!
                        $scope.setRoles(user_role);

                    } else {
                        document.getElementById("login_alert").innerHTML = "Username y/o Password invalido.";
                        $("#login_alert").show();
                    }

                })
                .error(function(data, status) {
                });
        };

        $scope.setRoles = function(role) {
            if (role == "admin") {
                $(".clientes_tab").show();
                $("#clientes_tab").show();

                $("#tickets_tab").show();
                $("#ventas_tab").show();
                $("#configuracion_tab").show();

                $("#tBtnLog").show();
                $("#conf_usuarios").show();
                $("#conf_servicios").show();

                $("#numberOfClients").show();

                $("#addMoreTickets").show();

                $("#deleteOpenTicket").show();



            } else if (role == "operador") {
                $(".clientes_tab").show();
                $("#clientes_tab").show();

                $("#tickets_tab").show();
                $("#configuracion_tab").show();

                $("#addMoreTickets").show();
            } else {
                $(".tickets_tab").show();
                $("#tickets_tab").show();
                $("#configuracion_tab").show();
                $('#calendar').fullCalendar('render');
            }
        };

    }]);

    app.controller("configurationCtrl", ['$scope', '$http', 'Pagination', function($scope, $http, Pagination) {

        $scope.pagination = Pagination.getNew();
        $scope.numberOfPagesinLogs = 15;

        $scope.users_conf = [];
        $scope.services_conf = [];
        $scope.logs_conf = [];

        $scope.tempModifications_service;
        $scope.tempModifications_users;

        $scope.insertLog = function(Action) {
            var USER = document.getElementById('user_header').innerText;
            var ROL =  document.getElementById('role_header').innerText;
            var FECHA = $scope.generateDate();

            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/log',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        usuario: USER,
                        rol: ROL,
                        accion: Action,
                        fecha: FECHA
                    }
                }).success(function(data, status) {
                    
                })
                .error(function(data, status) {
                });
        };

        $scope.generateDate = function() {
            var date = new Date();
            var mo = date.getMonth() + 1;
            var day = date.getDate();
            var y = date.getFullYear();
            var h = date.getHours();
            var m = date.getMinutes();

            var newDate = mo + '/' + day +'/'+ y;
   
            h = ("0" + h).slice(-2);
            m = ("0" + m).slice(-2);

            var fourDigitTime = h +''+ m;


            var hours24 = parseInt(fourDigitTime.substring(0, 2),10);
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? ' PM' : ' AM';
            var minutes = fourDigitTime.substring(2);

            newDate = newDate + ' ' + hours + ':' + minutes + amPm;
            return newDate;
        };

        $scope.storeTempModifications_service = function() {
            var servicio = document.getElementById('modificar_service_config').value;
            var pago = document.getElementById('modificar_pago_config').value;

            $scope.tempModifications_service = {
                'service': servicio,
                'price': pago,
            };

        };

        $scope.checkWhichIsDiff_service = function(old, serv, pag) {
            var changes = "(";

            if (old.service != serv) {
                changes += "nombre de servicio, ";
            }
            if (old.price != pag) {
                changes += "costo de servicio, ";
            }
            
            changes += ".)";
            changes = changes.replace(", .", '');
            
            return changes;
        };

        $scope.storeTempModifications_users = function() {
            var userF = document.getElementById('modify_user_first').value;
            var userL = document.getElementById('modify_user_Last').value;
            var userN = document.getElementById('modify_user_username').value;
            var userR = document.getElementById('modify_user_role').value;
            var userP = document.getElementById('modify_user_pass1').value;

            $scope.tempModifications_users = {
                'firstName': userF,
                'lastName': userL,
                'username': userN,
                'password': userP,
                'role': userR,
            };

        };

        $scope.checkWhichIsDiff_users = function(old, FirstName, LastName, Username, PassWord, Role) {
            var changes = "(";

            if (old.firstName != FirstName) {
                changes += "nombre de usuario, ";
            }
            if (old.lastName != LastName) {
                changes += "apellido de usuario, ";
            }
            if (old.username != Username) {
                changes += "username, ";
            }
            if (old.password != PassWord) {
                changes += "password, ";
            }
            if (old.role != Role) {
                changes += "permisos, ";
            }
            
            changes += ".)";
            changes = changes.replace(", .", '');
            
            return changes;
        };

        $scope.searchGlitch = function() {
            var characters = document.getElementById("searchLogs").value;
            if (characters.length > 0) {
                $scope.changeNumberOfPages(1000);
            } else {
                $scope.changeNumberOfPages(15);
            }
        };

        $scope.changeNumberOfPages = function(num) {
            $scope.numberOfPagesinLogs = num;
            $scope.pagination = Pagination.getNew($scope.numberOfPagesinLogs);
            $scope.pagination.numPages = Math.ceil($scope.logs_conf.length / $scope.pagination.perPage);
        };

        $scope.prepareField = function() {
            $scope.getUsers_conf();
            $scope.getServices_conf();
            $scope.getLogs_conf();
        };

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

                    $scope.pagination = Pagination.getNew($scope.numberOfPagesinLogs);
                    $scope.pagination.numPages = Math.ceil($scope.logs_conf.length / $scope.pagination.perPage);
                })
                .error(function(data, status) {
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

            var action = "Nuevo Servicio: " + newService + " ($" + newPrice + ".00)";
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
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error creando el nuevo servicio.");
                });
        };

        $scope.populateModificarService = function(ID, Servicio, Precio){
            document.getElementById("modificar_service_config").value = Servicio; 
            document.getElementById("modificar_pago_config").value = Precio;
            document.getElementById("modificar_ID_config").value = ID;


            $scope.storeTempModifications_service();

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

            var cambios = $scope.checkWhichIsDiff_service($scope.tempModifications_service, Service, Price);
            var action = "Modifico Servicio: " + Service + " ($" + Price + ".00) modificacion en " + cambios;

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
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error modificando el servicio.");
                });
        };

        $scope.deleteService = function() {
            var ID = document.getElementById('modificar_ID_config').value;
            var SERVICIO = document.getElementById('modificar_service_config').value;
            var PAGO = document.getElementById('modificar_pago_config').value;
            
            var action = "Borro Servicio: " + SERVICIO + " ($" + PAGO + ".00)";

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
                    $scope.insertLog(action);
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
            var action = "Nuevo Usuario: " + nombre + " " + apellido + " (" + perm + ")";
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
                    $scope.insertLog(action);
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

            $scope.storeTempModifications_users();

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
            var cambios = $scope.checkWhichIsDiff_users($scope.tempModifications_users, nombre, apellido, usuario, pass, perm);
            var action = "Modifico Usuario: " + nombre + " " + apellido + " modificacion en " + cambios;

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
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error modificando el usuario.");
                });
        };
        
        $scope.deleteUser = function() {
            var ID = document.getElementById('modify_user_ID_config').value;

            var nF = document.getElementById('modify_user_first').value;
            var nL = document.getElementById('modify_user_Last').value;
            var ro = document.getElementById('modify_user_role').value;

            var action = "Borro Usuario: " + nF + " " + nL + " (" + ro + ")";

            $http({
                    method: 'DELETE',
                    url: 'https://api.parse.com/1/classes/users/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    $scope.prepareField();
                    $('#modificar_user_modal').modal('hide');
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error borrando el usuario.");
                });
        };

        $scope.prepareField();

    }]);

    app.controller("eTicketsCtrl", ['$scope', '$http', function($scope, $http) {

        $scope.tickets;
        $scope.users = [];
        $scope.tc;
        $scope.t;
        $scope.dateChosen;
        $scope.tickets_selectedItem_edit;
        $scope.tempModifications;

        $scope.insertLog = function(Action) {
            var USER = document.getElementById('user_header').innerText;
            var ROL =  document.getElementById('role_header').innerText;
            var FECHA = $scope.generateDate();

            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/log',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        usuario: USER,
                        rol: ROL,
                        accion: Action,
                        fecha: FECHA
                    }
                }).success(function(data, status) {
                    
                })
                .error(function(data, status) {
                });
        };

        $scope.generateDate = function() {
            var date = new Date();
            var mo = date.getMonth() + 1;
            var day = date.getDate();
            var y = date.getFullYear();
            var h = date.getHours();
            var m = date.getMinutes();

            var newDate = mo + '/' + day +'/'+ y;
   
            h = ("0" + h).slice(-2);
            m = ("0" + m).slice(-2);

            var fourDigitTime = h +''+ m;


            var hours24 = parseInt(fourDigitTime.substring(0, 2),10);
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? ' PM' : ' AM';
            var minutes = fourDigitTime.substring(2);

            newDate = newDate + ' ' + hours + ':' + minutes + amPm;
            return newDate;
        };

        $scope.storeTempModifications = function() {
            var cli = document.getElementById('t_cliente').value;
            var pue = document.getElementById('t_pueblo').value;
            var tel = document.getElementById('t_telefono').value;
            var fec = $('#datetimepicker5').data("DateTimePicker").date().format("MM/DD/YYYY h:mm A");
            var asu = document.getElementById('t_asunto').value;
            var enc = document.getElementById('t_encargado').value;

            $scope.tempModifications = {
                'cliente': cli,
                'pueblo': pue,
                'telefono': tel,
                'start': fec,
                'asunto': asu,
                'title' : asu,
                'tecnico': enc,
            };

        };

        $scope.checkWhichIsDiff = function(old, client, fecha, asu, tec, com, pue, tel) {
            var changes = "(";

            if (old.cliente != client) {
                changes += "nombre de cliente, ";
            }
            if (old.pueblo != pue) {
                changes += "pueblo de cliente, ";
            }
            if (old.telefono != tel) {
                changes += "telefono de cliente, ";
            }
            if (old.start != fecha) {
                changes += "fecha de expiracion de ticket, ";
            }
            if (old.asunto != asu || old.title != asu) {
                changes += "asunto de ticket, ";
            }
            if (old.tecnico != tec) {
                changes += "encargado de ticket, ";
            }
            
            changes += ".)";
            changes = changes.replace(", .", '');
            
            return changes;

        };

        $scope.populateCalendar = function() {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: (new Date()).toISOString(),
                editable: false,
                eventLimit: true,
                events: $scope.tickets,
                eventClick: function(calEvent, jsEvent, view) {
                    $scope.openTicket(calEvent);
                }
            });
        };

        $scope.getTickets = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/tickets',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {


                    $scope.tickets = data.results;
                    $scope.populateCalendar();
                })
                .error(function(data, status) {
                });
        };

        $scope.getUsers = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/users',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    for(var i = 0 ; i < data.results.length ; i++) {
                        if(data.results[i].role == 'tecnico') {
                            $scope.users.push(data.results[i]);
                        }
                    }
                })
                .error(function(data, status) {
                });
        };

        $scope.validateInputsNewTicket = function() {
            var client = document.getElementById("tickets_cliente").value;
            var fecha = $('#datetimepicker4').data("DateTimePicker").date().format("MM/DD/YYYY h:mm A");
            var asunto = document.getElementById("tickets_asunto").value;
            var encargado = document.getElementById("tickets_users").value;
            var pueblo = document.getElementById("tickets_pueblo").value;
            var telefono = document.getElementById("tickets_telefono").value;

            if((client == null || client == "") || (fecha == null || fecha == "") || (asunto == null || asunto == "") ||
                    (encargado == null || encargado == "") || (pueblo == null || pueblo == "") || (telefono == null || telefono == "")) {
                        document.getElementById("newTicket_alert").innerHTML = "Entre toda la informacion de el nuevo ticket.";
                        $("#newTicket_alert").show();
                        return;
            } else {
                var tec = $scope.users[parseInt(document.getElementById('tickets_users').value)].firstName;
                telefono = $scope.phoneFormat(telefono);
                $("#newTicket_alert").hide();
                $scope.insertNewTicket(client, fecha, asunto, tec, pueblo, telefono);
            }                       
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

        $scope.insertNewTicket = function(Client, HoraFecha, Asunto, Encargado, Pueblo, Telefono) {
            var action = "Nuevo Ticket: " + Client + " - " + Asunto; 
            $http({
                    method: 'POST',
                    url: 'https://api.parse.com/1/classes/tickets',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        title: Asunto,
                        start: HoraFecha,
                        asunto: Asunto,
                        cliente: Client,
                        status: 'pendiente',
                        tecnico: Encargado, 
                        color: '#F78181',
                        pueblo: Pueblo,
                        telefono: Telefono
                    }
                }).success(function(data, status) {
                    $scope.getTickets();
                    document.getElementById("tickets_cliente").value = "";
                    document.getElementById("tickets_asunto").value = "";
                    document.getElementById('tickets_users').value = 0;
                    document.getElementById("tickets_pueblo").value = "";
                    document.getElementById("tickets_telefono").value = "";

                    $('#calendar').fullCalendar( 'removeEventSource', $scope.tickets);
                    $scope.reGetTickets();
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error creando el nuevo ticket.");
                });
        }

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

        $scope.reGetTickets = function() {
            $http({
                    method: 'GET',
                    url: 'https://api.parse.com/1/classes/tickets',
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    $scope.tickets = data.results;
                    
                    $('#calendar').fullCalendar( 'addEventSource', $scope.tickets);         
                    $('#calendar').fullCalendar( 'refetchEvents' );
                    $("#add_ticket").modal('hide');
                })
                .error(function(data, status) {
                });
        };

        $scope.openTicket = function(obj) {

            var date = new Date(obj.start);
            var mo = date.getMonth() + 1;
            var day = date.getDate();
            var y = date.getFullYear();
            var h = date.getHours();
            var m = date.getMinutes();

            var newDate = mo + '/' + day +'/'+ y;
   
            h = ("0" + h).slice(-2);
            m = ("0" + m).slice(-2);

            var fourDigitTime = h +''+ m;


            var hours24 = parseInt(fourDigitTime.substring(0, 2),10);
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? ' PM' : ' AM';
            var minutes = fourDigitTime.substring(2);

            newDate = newDate + ' ' + hours + ':' + minutes + amPm;

            document.getElementById("t_cliente").value = obj.cliente;
            $('#datetimepicker5').data("DateTimePicker").date(newDate);
            document.getElementById("t_asunto").value = obj.title;
            document.getElementById('t_encargado').value = obj.tecnico;
            document.getElementById('t_telefono').value = obj.telefono;
            document.getElementById('t_pueblo').value = obj.pueblo;
            document.getElementById('ticketID').innerHTML = obj.objectId;
            document.getElementById('t_fecha_tecnicos').value = obj.start;


            if(obj.status == 'completado') {
                $('#respondAndClose').hide();
                $('#t_completed').show();
                $("#overdue_warning").hide();
                document.getElementById('t_comentario').value = obj.comentario;
                $("#t_comentario").prop('disabled', true);
                $("#restaurarTicket").show();
                $("#t_fecha_tecnicos").show();
                $('#datetimepicker5').data("DateTimePicker").hide();
            } else {
                $('#datetimepicker5').data("DateTimePicker").show();
                $("#restaurarTicket").hide();
                $('#respondAndClose').show();
                $("#t_fecha_tecnicos").hide();
                $('#t_completed').hide();
                $("#t_comentario").prop('disabled', false);
                document.getElementById('t_comentario').value = '';
                var date = new Date(newDate);
                date.setDate(date.getDate() + 1);
                if((date).getTime() < (new Date().getTime())) {
                    $("#overdue_warning").show();
                } else {
                    $("#overdue_warning").hide();
                }
            }
            if(document.getElementById("role_header").innerHTML == 'admin' || document.getElementById("role_header").innerHTML == 'operador') {
                $("#info_ticket").modal("show");
                if(obj.status == 'pendiente') {
                    $('#t_cliente').prop('disabled', false);
                    $('#t_asunto').prop('disabled', false);
                    $('#t_telefono').prop('disabled', false);
                    $('#t_pueblo').prop('disabled', false);
                    $("#editTicketBtn").show();
                    $("#t_users").show();
                    $("#varifyBtn").show();
                } else {
                    $('#t_cliente').prop('disabled', true);
                    $('#t_asunto').prop('disabled', true);
                    $('#t_telefono').prop('disabled', true);
                    $('#t_pueblo').prop('disabled', true);
                    $("#editTicketBtn").hide();
                    $("#t_users").hide();
                    $("#varifyBtn").hide();
                }
                
            } else {

                if(obj.tecnico == document.getElementById("user_tk_firstName").value) {
                    $("#restaurarTicket").hide();
                    $("#editTicketBtn").hide();
                    $("#t_users").hide();
                    $("#varifyBtn").hide();
                    $("#info_ticket").modal("show");
                    $('#datetimepicker5').data("DateTimePicker").hide();
                    $("#t_fecha_tecnicos").show();
                }
            }
            $scope.storeTempModifications();
        }; 

        $scope.respondTicket = function() {
            var commnt = document.getElementById('t_comentario').value;
            if(commnt == null || commnt == '') {
                $("#t_warning").show();
                return;
            } else {
                $("#t_warning").hide();
                var ID = document.getElementById('ticketID').innerText;
                $scope.changeTicket(ID, commnt);
            }
        };

        $scope.changeTicket = function(ID, comment) {
            var cliente = document.getElementById('t_cliente').value;
            var asunto = document.getElementById('t_asunto').value;
            var action = "Respondio Ticket: " + cliente + " - " + asunto + ' (' + comment + ')';
            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/tickets/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        color:'#00CC66',
                        status:'completado',
                        comentario:comment
                    }
                }).success(function(data, status) {
                    $('#calendar').fullCalendar( 'removeEventSource', $scope.tickets);
                    $scope.reGetTickets();
                    $("#info_ticket").modal("hide");
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un ERROR respondiendo el ticket.");
                });
        };

        $scope.deleteTicket = function() {

            var cliente = document.getElementById('t_cliente').value;
            var asunto = document.getElementById('t_asunto').value;
            var action = "Borro Ticket: " + cliente + " - " + asunto;

            var ID = document.getElementById('ticketID').innerHTML;
            $http({
                    method: 'DELETE',
                    url: 'https://api.parse.com/1/classes/tickets/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    }
                }).success(function(data, status) {
                    $('#calendar').fullCalendar( 'removeEventSource', $scope.tickets);
                    $scope.reGetTickets();
                    $('#info_ticket').modal('hide');
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un error borrando el ticket.");
                });
        };

        $scope.filterJobs = function() {
            $scope.tc = $scope.tc.firstName;
        };

        $scope.filterJobs2 = function() {
            $scope.t = $scope.t.firstName;
        };

        $scope.filterClear = function() {
            $scope.tc = "";
        };

        $scope.filterClear2 = function() {
            $scope.t = "";
        };

        $scope.verifyEvents = function() { 
            var D = $('#datetimepicker4').data("DateTimePicker").date().format("MM/DD/YYYY h:mm A");
            var dateTry = new Date(D);
            var events = "Tickets pendientes para " + (dateTry.getMonth() + 1) + '/' + dateTry.getDate() + '/' + dateTry.getFullYear() + ":"  + 
                        "<div class='table-responsive'><table class='table table-bordered table-hover'><thead>" + 
                        "<tr ><th>Cliente</th><th>Fecha</th><th>Asunto</th><th>Encargado</th></tr></thead><tbody>";
            var isThereTickets = false;  

            for(var i = 0 ; i < $scope.tickets.length ; i++) {
                var date2 = new Date($scope.tickets[i].start);
                if(dateTry.getFullYear() == date2.getFullYear() 
                    && dateTry.getMonth() == date2.getMonth()
                    && dateTry.getDate() == date2.getDate()) {
                    isThereTickets = true;
                    events += "<tr bgcolor='#FFFFFF'><th>" + $scope.tickets[i].cliente + "</th><th>" + $scope.tickets[i].start + "</th><th>" + $scope.tickets[i].title + "</th><th>" + $scope.tickets[i].tecnico + "</th></tr>";
                }      
            }

            events += "</tbody></table></div>";

            if(isThereTickets) {
                document.getElementById("fechaAlert").innerHTML = events;
                $("#fechaAlertGood").hide();
                $("#fechaAlert").show();

            } else {
                document.getElementById("fechaAlert").innerHTML = events;
                $("#fechaAlert").hide();
                $("#fechaAlertGood").show();
            }
        };

        $scope.verifyEvents2 = function() {  
            
            var D = $('#datetimepicker5').data("DateTimePicker").date().format("MM/DD/YYYY h:mm A");
            var dateTry = new Date(D);
            var events = "Tickets pendientes para " + (dateTry.getMonth() + 1) + '/' + dateTry.getDate() + '/' + dateTry.getFullYear() + ":"  + 
                        "<div class='table-responsive'><table class='table table-bordered table-hover'><thead>" + 
                        "<tr ><th>Cliente</th><th>Fecha</th><th>Asunto</th><th>Encargado</th></tr></thead><tbody>";
            var isThereTickets = false;  

            for(var i = 0 ; i < $scope.tickets.length ; i++) {
                var date2 = new Date($scope.tickets[i].start);
                if(dateTry.getFullYear() == date2.getFullYear() 
                    && dateTry.getMonth() == date2.getMonth()
                    && dateTry.getDate() == date2.getDate()) {
                    isThereTickets = true;
                    events += "<tr bgcolor='#FFFFFF'><th>" + $scope.tickets[i].cliente + "</th><th>" + $scope.tickets[i].start + "</th><th>" + $scope.tickets[i].title + "</th><th>" + $scope.tickets[i].tecnico + "</th></tr>";
                }      
            }

            events += "</tbody></table></div>";

            if(isThereTickets) {
                document.getElementById("fechaAlert_edit").innerHTML = events;
                $("#fechaAlertGood_edit").hide();
                $("#fechaAlert_edit").show();

            } else {
                document.getElementById("fechaAlert_edit").innerHTML = events;
                $("#fechaAlert_edit").hide();
                $("#fechaAlertGood_edit").show();
            }
        };

        $scope.updateEncargado = function() {    
            document.getElementById("t_encargado").value = $scope.tickets_selectedItem_edit.firstName;
            $scope.tickets_selectedItem_edit = ""
        };

        $scope.validateEdit = function() {
            var client = document.getElementById("t_cliente").value;
            var fecha = $('#datetimepicker5').data("DateTimePicker").date().format("MM/DD/YYYY h:mm A");
            var asunto = document.getElementById("t_asunto").value;
            var encargado = document.getElementById("t_encargado").value;
            var pueblo = document.getElementById("t_pueblo").value;
            var telefono = document.getElementById("t_telefono").value;
            var cmnt = document.getElementById("t_comentario").value;

            if((client == null || client == "") || (fecha == null || fecha == "") || (asunto == null || asunto == "") ||
                    (encargado == null || encargado == "") || (pueblo == null || pueblo == "") || (telefono == null || telefono == "")) {
                        document.getElementById("newTicket_alert_edit").innerHTML = "Entre toda la informacion del ticket.";
                        $("#newTicket_alert_edit").show();
                        return;
            } else {
                $("#newTicket_alert_edit").hide();
                telefono = $scope.phoneFormat(telefono);
                $scope.editTicket(client, fecha, asunto, encargado, cmnt, pueblo, telefono);
            }                     
        };

        $scope.editTicket = function(client, fecha, asu, tec, com, pue, tel) {
            var cambios = $scope.checkWhichIsDiff($scope.tempModifications, client, fecha, asu, tec, com, pue, tel);
            var action = "Modifico Ticket: " + client + " - modificacion en " + cambios;

            var ID = document.getElementById("ticketID").innerHTML;
            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/tickets/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        title:asu,
                        cliente:client,
                        start:fecha,
                        asunto:asu,
                        tecnico:tec,
                        pueblo:pue,
                        telefono:tel,
                        comentario:com
                    }
                }).success(function(data, status) {
                    $('#calendar').fullCalendar( 'removeEventSource', $scope.tickets);
                    $scope.reGetTickets();
                    $("#info_ticket").modal("hide");
                    $scope.insertLog(action); 
                })
                .error(function(data, status) {
                    alert("Se ha producido un ERROR editando el ticket.");
                });
        };  

        $scope.restaurarTicket = function() {
            var cliente = document.getElementById('t_cliente').value;
            var asunto = document.getElementById('t_asunto').value;
            var action = "Restauro Ticket: " + cliente + " - " + asunto;
            var ID = document.getElementById("ticketID").innerHTML;
            $http({
                    method: 'PUT',
                    url: 'https://api.parse.com/1/classes/tickets/' + ID,
                    headers: {
                        'X-Parse-Application-Id': 'eTTIg8J0wMN5GYb4ys3PH152xuMK8WdpNUy8u8S8',
                        'X-Parse-REST-API-Key': 'VmzCpgQRTiP4UYNEvIbeOiOEK8WB3ruA0WnAmmBU'
                    },
                    data: {
                        color:'#F78181',
                        status:'pendiente',
                        comentario:""
                    }
                }).success(function(data, status) {
                    $('#calendar').fullCalendar( 'removeEventSource', $scope.tickets);
                    $scope.reGetTickets();
                    $("#info_ticket").modal("hide");
                    $scope.insertLog(action);
                })
                .error(function(data, status) {
                    alert("Se ha producido un ERROR restaurando el ticket.");
                });
        };

        $scope.getUsers();
        $scope.getTickets();
    }]);

    app.controller("ventasCtrl", ['$scope', '$http', function($scope, $http) {

    }]);
})();