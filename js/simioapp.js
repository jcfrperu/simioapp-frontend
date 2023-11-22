// variables globales
var gSimioConfig = new SimioConfigApp();         // configuracion de la BD
var gSimioDAO = new SimioDAO('dummy');           // agrupador de DAOs para manipular las tablas de la BD
var gSimioMaker = new SimioObjectMaker();        // objeto para crear beans con la estructura correcta para insertar en una tabla
var gTokenData = new SimioTokenData();           // datos recibidos al entrar en modo offline

var gDescargasConError = [];

function initApp() {

    // initBaseDatos();
    // initEventos();
    // initBarras();

    consoleLog( 'inicio de la app' );
}

function initEventos() {

    $('#btnDescargar').on('click', clickBtnDescargar);

}

function initBaseDatos() {

    // abrir la BD
    gSimioConfig.abrirCrearBD(function () {

        // inicializar correctamente el agrupador de DAO con el nombre de base de datos correcto
        gSimioDAO = new SimioDAO(gSimioConfig.getNombreBD());

        consoleLog('abrirCrearBD OK');

    }, function (error) {

        consoleLog('error en abrirCrearBD: ' + error);
    });

}

function initBarras() {

}

// TODO/FIXME: ver si se usa
function clickBtnDescargar(event) {

    preventDefaultEvent(event);

    gDescargasConError = [];

    // descargar tablas
    callAjaxDescargarTabla('area', '#divDescargaAreaID');
    callAjaxDescargarTabla('bien', '#divDescargaBienID');// esta tabla tiene errores, ver tabla y generador de codigo
    callAjaxDescargarTabla('catalogo', '#divDescargaCatalogoID');
    callAjaxDescargarTabla('catalogoBien', '#divDescargaCatalogoBienID');
    callAjaxDescargarTabla('clase', '#divDescargaClaseID');
    callAjaxDescargarTabla('cuenta', '#divDescargaCuentaID');
    callAjaxDescargarTabla('dependencia', '#divDescargaDependenciaID');
    callAjaxDescargarTabla('empleado', '#divDescargaEmpleadoID');
    callAjaxDescargarTabla('entidad', '#divDescargaEntidadID');
    callAjaxDescargarTabla('grupo', '#divDescargaGrupoID');
    callAjaxDescargarTabla('grupoClase', '#divDescargaGrupoClaseID');
    callAjaxDescargarTabla('locales', '#divDescargaLocalesID');
    callAjaxDescargarTabla('oficina', '#divDescargaOficinaID');
    callAjaxDescargarTabla('parametro', '#divDescargaParametroID');
    callAjaxDescargarTabla('ubigeo', '#divDescargaUbigeoID');
    callAjaxDescargarTabla('inventario', '#divDescargaInventarioID');
    callAjaxDescargarTabla('inventarioBien', '#divDescargaInventarioBienID');


    // descargar vistas
    callAjaxDescargarVista('vista01', '#divVista01ID');
    callAjaxDescargarVista('vista02', '#divVista02ID');
    // TODO/FIXME: aqui poner las vistas necesarias

    guardarDatosSession();
}

function guardarDatosSession() {

	var itemBD = gSimioMaker.makeTablaObject(TABLAS.session, null, null);

   	var formSiguiente = $('#form-siguiente');

	itemBD.usuario = formSiguiente.find( 'input[name="usuario"]' ).val();
	itemBD.usuarioNombre = ''; // TODO/FIXME: poner luego el nombre del usuario, no se esta enviando
	itemBD.entidad = formSiguiente.find( 'input[name="entidad"]' ).val();
	itemBD.entidadNombre = ''; // TODO/FIXME: poner luego el nombre de la entidad, no se esta enviando
	itemBD.inventario = formSiguiente.find( 'input[name="inventario"]' ).val();
	itemBD.inventarioNombre = ''; // TODO/FIXME: poner luego el nombre del inventario, no se esta enviando
	itemBD.token = formSiguiente.find( 'input[name="token"]' ).val();

	buildLocalKey(itemBD);

    // guardar la data de la session/credenciales
	gSimioDAO.session.putItem(itemBD, function(info, event) {

		consoleLog('Datos de la session/credenciales se realizó con éxito');


	}, function(error, event) {

    	// indicador que ocurrio error en la descarga
		gDescargasConError.push('credenciales');

		showMensaje( 'Mensaje', 'No se pudo guardar los datos de la session/credenciales.' );

		handleErrorBD(error);
	});

}

function clickBtnIrModoOffline(event) {

	preventDefaultEvent(event);

	// solo sino hubo errores sigue al siguiente paso
	if ( estaDefinido( gDescargasConError ) && gDescargasConError.length == 0 ) {

		$('#form-siguiente').submit();

	} else {

		showMensaje('Mensaje', 'Ocurrieron errores en la descarga. Favor revisar' );
	}

}


function callAjaxDescargarTabla(nombreTabla, divID) {

    // Metodo que recibe el nombre de la tabla a descargar, asi como el ID del div donde
    // se generan las cajitas con los resultados de la migracion

    callAjax(true, '/admin.htm?action=descargarTabla', {
        'nombreTabla': nombreTabla,
        'keyREST': buildKeyREST('DESCARGAR_TABLAVISTA')
    }, function (response) {

        var txDAO = gSimioDAO.crearTXDAO([nombreTabla]);

        txDAO.execute(function (transaction) {

            txDAO.clearItems(transaction, nombreTabla);

            // recorrer todos los items de la peticion
            var posicion = 0;
            var listaSize = response.dataJson.lista.length;

            if (listaSize > 0) {

                $.each(response.dataJson.lista, function (i, item) {

                    var itemBD = gSimioMaker.makeTablaObject(nombreTabla, item, true);

                    txDAO.addItem(transaction, itemBD, nombreTabla);

                    posicion++;
                    actualizarBarraEnProceso(divID, parseInt(100 * posicion / listaSize));
                });

            }

        }, function (info) {

            actualizarBarraExito(divID, 'Descarga de la tabla ' + nombreTabla + ' se realizó con éxito');
            consoleLog('se terminó de descargar la tabla: ' + nombreTabla);

        }, function (error) {

        	// indicador que ocurrio error en la descarga
        	gDescargasConError.push(nombreTabla);

            actualizarBarraError(divID, 'Ocurrió un error al descargar tabla ' + nombreTabla);
            handleErrorBD(error);
        });

    }, function (esErrorAjax, response, error) {

    	// indicador que ocurrio error en la descarga
    	gDescargasConError.push(nombreTabla);
    });
}

function callAjaxDescargarVista(nombreVista, divID) {

    var urlVista = buildURL('/html/toma-inventario/' + nombreVista + '.html');

    var jqxhr = $.get(urlVista, function (data) {

    	consoleLog("se descargó con éxito la vista " +nombreVista);

    	var itemBD = gSimioMaker.makeVistaObject(null, null);

    	itemBD.html = data;
    	itemBD.vistaID = nombreVista;

    	buildLocalKey( itemBD );

    	gSimioDAO.vista.putItem(itemBD, function(info, event) {

    		consoleLog('Descarga de la vista ' + nombreVista + ' se realizó con éxito');

    		actualizarBarraExito(divID, 'Descarga de la vista ' + nombreVista + ' se realizó con éxito');


    	}, function(error, event) {

        	// indicador que ocurrio error en la descarga
    		gDescargasConError.push(nombreVista);

    		actualizarBarraError(divID, 'Ocurrió un error al descargar vista ' + nombreVista);

    		handleErrorBD(error);
    	});


    }).fail(function () {

    	// indicador que ocurrio error en la descarga
    	gDescargasConError.push(nombreVista);

    	$(divID).html( data );

    	consoleLog("hubo error en la descarga de la vista " +nombreVista);

    });
}

function actualizarBarraExito(divID, mensaje) {

    $(divID).children().css('width', '100%');
    $(divID).children().removeClass('progress-bar-primary');
    $(divID).children().addClass('progress-bar-success');
    $(divID).children().html(mensaje);
}

function actualizarBarraError(divID, mensaje) {

    $(divID).children().css('width', '100%');
    $(divID).children().removeClass('progress-bar-primary');
    $(divID).children().addClass('progress-bar-danger');
    $(divID).children().html(mensaje);
}

function actualizarBarraEnProceso(divID, porcentajeAvance) {

    $(divID).children().css('width', porcentajeAvance + '%');
}

function callAjaxDescargarTablaSinTransaccionMenosRapido(nombreTabla) {

    callAjax(true, '/admin.htm?action=descargarTabla', {
        'nombreTabla': nombreTabla,
        'keyREST': buildKeyREST('DESCARGAR_TABLAVISTA')
    }, function (response) {

        // borrar toda la tabla
        gSimioDAO[nombreTabla].clearItems(function (info, event) {

            consoleLog('se borraron los items');

            // recorrer todos los items de la peticion
            $.each(response.dataJson.lista, function (i, item) {

                // crea un bean de la tabla 'nombreTabla' y a la vez lo llena con la data que viene en 'item'
                var itemBD = gSimioMaker.makeTablaObject(nombreTabla, item, true);

                // de forma dinamica de acceder al dao especifico de la tabla nombreTabla
                gSimioDAO[nombreTabla].addItem(itemBD, function (info, event) {

                    consoleLog('se inserto ' + info);

                }, function (info, event) {

                    handleErrorBD(info);
                });

            });

        }, function (info, event) {
            handleErrorBD(info);
        });

    }, function (esErrorAjax, response, error) {

    });
}

function callAjaxDescargarTablaUsandoTransaction(nombreTabla) {

    callAjax(true, '/admin.htm?action=descargarTabla', {
        'nombreTabla': nombreTabla,
        'keyREST': buildKeyREST('DESCARGAR_TABLAVISTA')
    }, function (response) {

        var txDAO = gSimioDAO.crearTXDAO([nombreTabla]);

        txDAO.execute(function (transaction) {

            txDAO.clearItems(transaction, nombreTabla);

            // recorrer todos los items de la peticion
            $.each(response.dataJson.lista, function (i, item) {

                var itemBD = gSimioMaker.makeTablaObject(nombreTabla, item, true);

                txDAO.addItem(transaction, itemBD, nombreTabla);

            });

        }, function (info) {

            consoleLog('se terminaron de insertar todos los items correctamente');

        }, function (error) {

            handleErrorBD(error);
        });

    }, function (esErrorAjax, response, error) {

    });
}

function ejemploInvocacionAJAX() {

    // forma no administrada (normal que usa jQuery)
    callAjax(true, '/admin.htm?action=descargarTabla', {
        'nombreTabla': 'catalogoBien',
        'keyREST': buildKeyREST('DESCARGAR_TABLAVISTA')
    }).done(function (response) {

        // comportamiento por default si hubo error ajax
        if (huboErrorJson(response)) {
            handleErrorJson(response);
            return;
        }

        // continuar con la logica en caso de exito

    }).fail(function (error) {

        // comportamiento por default si hubo error
        handleError(error);
    });
}