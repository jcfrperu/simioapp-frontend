/// <reference path="comunes.js" />
/// <reference path="jquery-simiosdb.js" />
/// <reference path="simioapp.js" />
/// <reference path="simioapp-config.js" />
/// <reference path="simioapp-dao.js" />
/// <reference path="simioapp-view.js" />
/// <reference path="simiosdb.js" />
/// <reference path="../../DefinitelyTyped-master/jquery/jquery.d.ts" />

// Tablas de la BD
function SimioTabla() {

    // tablas de la app bd
    this.area = 'area';
    this.bien = 'bien';
    this.catalogo = 'catalogo';
    this.catalogoBien = 'catalogoBien';
    this.clase = 'clase';
    this.cuenta = 'cuenta';
    this.dependencia = 'dependencia';
    this.empleado = 'empleado';
    this.entidad = 'entidad';
    this.grupo = 'grupo';
    this.grupoClase = 'grupoClase';
    this.locales = 'locales';
    this.oficina = 'oficina';
    this.parametro = 'parametro';
    this.ubigeo = 'ubigeo';
    this.inventario = 'inventario';
    this.inventarioBien = 'inventarioBien';

    // tablas de la app vista
    this.vista = 'vista';

    // otras
    this.test = 'test';
    this.session = 'session';
}

// Constantes de la App
function SimioConstantes() {

    this.XXX_XXX = '';
}

// instancias globales
var TABLAS = new SimioTabla();
var CONSTANTES = new SimioConstantes();