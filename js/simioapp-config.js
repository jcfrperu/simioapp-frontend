// Clase SimioConfigApp
// Clase configuracion de la app: nombre de la bd, esquema de bd, servicios rest, etc
function SimioConfigApp() {

    // NOMBRE DE LA BD
    this.getNombreBD = function () {
        return 'simioBD';
    }

    // ESQUEMA DE LA BD
    this.getEsquemaBD = function () {

        var esquemaBD = {
            'schema': {
                '1': function (versionTransaction) {
                    // CREACION DE TABLAS

                    // EJEMPLO: creando la tabla nombre_tabla
                    /*
                    var nombre_tabla = versionTransaction.createObjectStore('nombre_tabla', {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // nombre_tabla.createIndex('price');
                    // nombre_tabla.createIndex('by_name', 'name', { unique : false });
                     */

                    // LLENADO DE TABLAS

                    // TABLA area
                    var area = versionTransaction.createObjectStore(TABLAS.area, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA bien
                    var bien = versionTransaction.createObjectStore(TABLAS.bien, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA catalogo
                    var catalogo = versionTransaction.createObjectStore(TABLAS.catalogo, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA catalogoBien
                    var catalogoBien = versionTransaction.createObjectStore(TABLAS.catalogoBien, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA clase
                    var clase = versionTransaction.createObjectStore(TABLAS.clase, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA cuenta
                    var cuenta = versionTransaction.createObjectStore(TABLAS.cuenta, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA dependencia
                    var dependencia = versionTransaction.createObjectStore(TABLAS.dependencia, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA empleado
                    var empleado = versionTransaction.createObjectStore(TABLAS.empleado, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA entidad
                    var entidad = versionTransaction.createObjectStore(TABLAS.entidad, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA grupo
                    var grupo = versionTransaction.createObjectStore(TABLAS.grupo, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA grupoClase
                    var grupoClase = versionTransaction.createObjectStore(TABLAS.grupoClase, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA locales
                    var locales = versionTransaction.createObjectStore(TABLAS.locales, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA oficina
                    var oficina = versionTransaction.createObjectStore(TABLAS.oficina, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA parametro
                    var parametro = versionTransaction.createObjectStore(TABLAS.parametro, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA ubigeo
                    var ubigeo = versionTransaction.createObjectStore(TABLAS.ubigeo, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA inventario
                    var inventario = versionTransaction.createObjectStore(TABLAS.inventario, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA inventarioBien
                    var inventarioBien = versionTransaction.createObjectStore(TABLAS.inventarioBien, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // TABLA vistas
                    var vistas = versionTransaction.createObjectStore(TABLAS.vista, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    // OTRAS TABLAS
                    var session = versionTransaction.createObjectStore(TABLAS.session, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                    var test = versionTransaction.createObjectStore(TABLAS.test, {
                        'keyPath': 'localKey',
                        'autoIncrement': false
                    });

                }
            }
        };

        // retornar el esquema
        return esquemaBD;
    }


    // ABRIR/CREAR Y ELIMINAR LA BD
    this.abrirCrearBD = function (functionOK, functionError) {

        $.simiosDB(this.getNombreBD(), this.getEsquemaBD()).then(functionOK, functionError);
    }

    this.eliminarBD = function (functionOK, functionError) {

        $.simiosDB(this.getNombreBD()).deleteDatabase().then(functionOK, functionError);
    }


    // URL SERVIDOR REST
    this.getServidorREST = function () {
        // NOTA: debe comenzar con http, y NO debe terminar en /
        return 'http://localhost:8081/simioapp';
    }


    // CREDENCIALES PARA PETICIONES REST
    this._keyRestValues = null;

    this.getKeyREST = function (claveKeyREST) {

        if (this._keyRestValues == null) {
            this._buildKeyRestValuesMap();
        }

        return $.trim(this._keyRestValues[claveKeyREST]);
    }

    this._buildKeyRestValuesMap = function () {

        this._keyRestValues = {};

        // TODO/FIXME: aqui hacer el llenado de los keys
        this._keyRestValues['DEFAULT'] = '*****';
        this._keyRestValues['DESCARGAR_TABLAVISTA'] = 'SiMI0RestDescargarTabla';
    }

}

// Clase SimioTokenData
// Clase con la data que el usuario recibe al entrar en modo offline
//TODO/FIXME: este token data es solo para pruebas. BLANQUEAR ATRIBUTOS PARA PRODUCCION
function SimioTokenData() {

    this.usuario = '*****';

    this.entidad = '911';

    this.inventario = 'inv001';

    this.token = '*****';

}