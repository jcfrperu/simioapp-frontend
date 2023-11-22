function preventDefaultEvent(event) {
	if (estaDefinido(event)) {
		event.preventDefault();
	}
}

function consoleLog(consoleText) {
	if (window.console && window.console.log) {
		console.log(consoleText);
	}
}

function formToObject(formID, incluirDisabled) {

	// convierte todos los campos de un formulario a un objeto javascript.
	// se usa para poder deserializar directamente con los beans view object

	var formularioObject = {};
	var formularioArray = $('#' + formID).serializeArray();

	$.each(formularioArray, function (i, v) {
		formularioObject[v.name] = v.value;
	});

	if (estaDefinido(incluirDisabled) && incluirDisabled) {
		$('#' + formID).find('input:disabled, select:disabled').each(function (i, v) {
			formularioObject[v.name] = v.value;
		});
	}

	return formularioObject;
}

function copiarValores(fuenteFrom, destinoTo, parseToString) {
	// copia de fuenteFrom -> destinoTo
	// (NOTA: en destinoTo no se agregan nuevos campos/propiedades, solo copia las que tambien existen en fuenteFrom  )
	// fuenteFrom es el objeto javascript que contiene los datos a copiar
	// destinoTo es el objeto javascript que va recibir los datos de la fuente
	// parseToString, si se desea convertir todo a string

	var usarString = estaDefinido(parseToString) ? parseToString : false;

	// copia solo los campos de destinoTo(object) que existen en fuenteFrom (los demas que tenga destinoTo los ignora)
	$.each(destinoTo, function (key, value) {
		if (estaDefinido(fuenteFrom[key])) {
			destinoTo[key] = usarString ? String(fuenteFrom[key]) : fuenteFrom[key];
		}
	});
}

function huboErrorJson(data) {

    // solo si viene definido data, data.estado
    if (estaDefinido(data) && estaDefinido(data.estado)) {

		// data.estado = { ok, error, errorValidacio }
        if (data.estado != 'ok') {
            return true;
        }
    }

    return false;
}

function huboErrorValidacionJson(data) {
	// TODO/FIXME: revisar este metodo, no tiene el mismo comportamiento de huboErrorJson()
    return data != null && data.estado == 'errorValidacion';
}

function handleErrorJson(data) {

    // si no viene data
	if (!estaDefinido(data)) {

        showMensaje('Mensaje', 'Respuesta JSON no seteada');

        return true;
    }

    // si no viene estado
	if (!estaDefinido(data.estado)) {

        showMensaje('Mensaje', 'Atributo estado de respuesta JSON no seteado');

        return true;
    }

    // si viene error de aplicacion (data.estado = { ok, error, errorValidacio } )
    if (data.estado != 'ok') {

        showMensaje('Mensaje', data.msg);

        consoleLog('error app -> ' + data.msg);

        return true;
    }

    return false;
}

function handleErrorBD(info) {

	if (estaDefinido(info)) {

		var msg = 'Ha ocurrido un error en BD';

		if (estaDefinido(info.code)) {
			msg = msg + ', code: ' + info.code;
		}

		if (estaDefinido(info.message)) {
			msg = msg + ', message: ' + info.message;
		}

		if (estaDefinido(info.name)) {
			msg = msg + ', name: ' + info.name;
		}

		if (estaDefinido(info.type)) {
			msg = msg + ', type: ' + info.type;
		}

		consoleLog(msg);
	}
}

function handleError(error) {

	var msg = 'No se obtuvo respuesta del servidor';

	if (estaDefinido(error)) {
		msg = 'error -> status: ' + error.status + ', readyState: ' + error.readyState + ', statusText: ' + error.statusText;
	}

	alert(msg);
	consoleLog(msg);
}

function estaDefinido(valor) {
	return valor != null && (typeof valor != 'undefined');
}

function getTrimValue(inputQuery) {
	return $.trim($(inputQuery).val());
}

function toNumero(valor, defaultValue) {
	// valor por default en caso que no valor no sea número
	var defaultValueResult = !esNumero(defaultValue) ? 0.0 : Number(defaultValue);

	return !esNumero(valor) ? defaultValueResult : Number(valor);
}

function esNumero(valor) {
	// que no sea null, ni blanco, ni indefinido y que pase la validación de jquery isNumeric
	return estaDefinido(valor) && valor != '' && $.isNumeric(valor);
}


function roundComasMilesString(valor, digitos) {
	var val = roundString(valor, digitos);

	var parts = val.toString().split(".");

	// formato coma como separador de miles, punto como separador decimal
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function roundString(valor, digitos) {
	// redondear
	var round = roundNumero(digitos, parseFloat(valor));

	// formatear completando el nro de digitos en los decimales
	var result = round.toFixed(digitos) + '';

	// retorna una cadena formateada
	return result;
}

function roundNumero(valor, digitos) {

	var round = Math.round(parseFloat(valor) * Math.pow(10, digitos)) / Math.pow(10, digitos);

	return round;
}

function recortarDigitosEnteros(numeroString, maxDigEnteros) {

	if (!estaDefinido(numeroString)) return numeroString;

	var num = (numeroString + '').replace(/,/g, '');

	var posComa = num.indexOf('.');

	if (posComa >= 0) {

		var izq = num.substring(0, posComa);
		var der = num.substring(posComa + 1, num.length);

		if (izq.length > maxDigEnteros) {
			izq = izq.substring(0, maxDigEnteros);
		}

		num = izq + '.' + der;

	} else {

		if (num.length > maxDigEnteros) {
			num = num.substring(0, maxDigEnteros);
		}

	}

	return num;
}

function esHoraValida(hora) {
	return isValidoFormatHour(hora);
}

function esFechaValida(fecha) {
	var fechaTrim = $.trim(fecha);
	return fechaTrim != '' && checkdate(fechaTrim);
}

function esFechaMayor(fecha1, fecha2) {
	var result = compararFechas(fecha1, fecha2);
	return result == 1;
}

function esFechaMayorIgual(fecha1, fecha2) {
	var result = compararFechas(fecha1, fecha2);
	return result == 1 || result == 0;
}

function esFechaMenor(fecha1, fecha2) {
	var result = compararFechas(fecha1, fecha2);
	return result == 2;
}

function esFechaMenorIgual(fecha1, fecha2) {
	var result = compararFechas(fecha1, fecha2);
	return result == 2 || result == 0;
}

function esFechaIgual(fecha1, fecha2) {
	var result = compararFechas(fecha1, fecha2);
	return result == 0;
}

function compararFechas(fecha1, fecha2) {
	// se crea un wrapper por un bug en el compara fecha de sunat
	return checkcomparafecha($.trim(fecha1), $.trim(fecha2));
}

function checkcomparafecha(fecha1, fecha2) {

	/* -1: err, 1: f1>f2, 2: f1<f2, 0: f1=f2 */
	if (!checkdate(fecha1) || !checkdate(fecha2)) return -1;

	dia = fecha1.substring(0, 2)
	mes = fecha1.substring(3, 5)
	anho = fecha1.substring(6, 10)

	fecha1x = anho + mes + dia

	dia = fecha2.substring(0, 2)
	mes = fecha2.substring(3, 5)
	anho = fecha2.substring(6, 10)
	fecha2x = anho + mes + dia

	return (fecha1x > fecha2x ? 1 : (fecha1x < fecha2x ? 2 : 0));
}

function checkdate(fecha) {

	var err = 0

	if (fecha.length != 10) err = 1

	dia = fecha.substring(0, 2)
	slash1 = fecha.substring(2, 3)
	mes = fecha.substring(3, 5)
	slash2 = fecha.substring(5, 6)
	anho = fecha.substring(6, 10)

	if (dia < 1 || dia > 31) err = 1
	if (slash1 != '/') err = 1
	if (mes < 1 || mes > 12) err = 1
	if (slash1 == '/' && slash2 != '/') err = 1
	if (anho < 0 || anho > 2200) err = 1
	if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
		if (dia == 31) err = 1
	}

	if (mes == 2) {
		var g = parseInt(anho / 4)
		if (isNaN(g)) {
			err = 1
		}
		if (dia > 29) err = 1
		if (dia == 29 && ((anho / 4) != parseInt(anho / 4))) err = 1
	}

	return (!(err == 1));
}


function compararHoras(hora1, hora2) {

	/* -1: err, 1: f1>f2, 2: f1<f2, 0: f1=f2 */

	// validar que venga data
	if (!estaDefinido(hora1) || !estaDefinido(hora2)) return -1;

	var h1Split = $.trim(hora1).split(':');
	var h2Split = $.trim(hora2).split(':');

	// validar formato: validar que tenga un solo ':'
	if (h1Split == null || h1Split.length != 2) return -1;
	if (h2Split == null || h2Split.length != 2) return -1;

	// pasarlo todo a minutos
	var h1 = toNumero(h1Split[0]) * 60 + toNumero(h1Split[1]);
	var h2 = toNumero(h2Split[0]) * 60 + toNumero(h2Split[1]);

	if (h1 > h2) return 1;	// 1
	if (h1 < h2) return 2;	// 2

	return 0;
}

function convertirEnMinutos(horaHHMM) {

	// validar que venga data
	if (!estaDefinido(horaHHMM)) return -1;

	var horaSplit = $.trim(horaHHMM).split(':');
	// validar formato: validar que tenga un solo ':'
	if (horaSplit == null || horaSplit.length != 2) return -1;

	// pasarlo todo a minutos
	var minutos = toNumero(horaSplit[0]) * 60 + toNumero(horaSplit[1]);

	return minutos;
}

function roundDiferenciaHoras(horaMayorHHMM, horaMenorHHMM) {
	// PRE: horaMayorHHMM > horaMenorHHMM (en formato HH:MM )

	// convertir a minutos
	var mayorMins = convertirEnMinutos(horaMayorHHMM);
	var menorMins = convertirEnMinutos(horaMenorHHMM);

	// convertir a horas y redondear a 1 digito
	var roundDifHoras = roundString((mayorMins - menorMins) / 60.0, 1);

	return roundDifHoras;
}

function isValidoFormatDate(valueDate) {
	var formatDate = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
	var isValid = formatDate.test(valueDate);
	if (isValid && (valueDate.indexOf("-") > -1)) {
		isValid = false;
	}
    return isValid;
}

function isValidoFormatHour(valueHour) {
	var formatHour = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	var isValid = formatHour.test(valueHour);
    return isValid;
}

function showMensaje(titulo, mensaje, functionAceptar) {
	return showMensajeModal(titulo, mensaje, functionAceptar, 'primary');
}

function showMensajeExito(titulo, mensaje, functionAceptar) {
	return showMensajeModal(titulo, mensaje, functionAceptar, 'exito');
}

function showMensajeError(titulo, mensaje, functionAceptar) {
	return showMensajeModal(titulo, mensaje, functionAceptar, 'error');
}

function showMensajeAlert(titulo, mensaje, functionAceptar) {
	return showMensajeModal(titulo, mensaje, functionAceptar, 'alert');
}

function showMensajeInfo(titulo, mensaje, functionAceptar) {
	return showMensajeModal(titulo, mensaje, functionAceptar, 'info');
}

function showMensajeDefault(titulo, mensaje, functionAceptar) {
	return showMensajeModal(titulo, mensaje, functionAceptar, 'default');
}

function showMensajeModal(titulo, mensaje, functionAceptar, tipoMensaje) {

	// NOTA: En este sistema, no se usa el parámetro título.

	// por si se desea manejar los colores de bootstrap
	if (tipoMensaje == 'exito' || tipoMensaje == 'success') {
		$('#divPopupPanelClass').prop('class', 'panel panel-success');
	} else if (tipoMensaje == 'error' || tipoMensaje == 'danger') {
		$('#divPopupPanelClass').prop('class', 'panel panel-danger');
	} else if (tipoMensaje == 'alert' || tipoMensaje == 'warning') {
		$('#divPopupPanelClass').prop('class', 'panel panel-warning');
	} else if (tipoMensaje == 'info') {
		$('#divPopupPanelClass').prop('class', 'panel panel-info');
	} else if (tipoMensaje == 'default') {
		$('#divPopupPanelClass').prop('class', 'panel panel-default');
	} else {
		$('#divPopupPanelClass').prop('class', 'panel panel-primary');
	}

	var mensajeTrim = $.trim(mensaje);

	if (mensajeTrim.length < 50) {
		$('#divPopupContainerClass').prop('class', 'container appMsgConfirmContainer verticalAlignmentHelper');
	} else {
		$('#divPopupContainerClass').prop('class', 'container appMsgConfirmContainerBigger verticalAlignmentHelper');
	}

	if ($('#divModalPopup').length) {

		// si se tiene el div de popup
		$('#divPopupMensaje').html(mensajeTrim);

		$('#divModalPopup').modal({
			keyboard: false
		});

		$('#btnPopupAceptar').off('click');
		if (estaDefinido(functionAceptar)) {
			$('#btnPopupAceptar').on('click', functionAceptar);
		}

		// pone el foco el boton aceptar, y de paso fix el bug que deja el foco
		// en algún control de la pantalla padre y puede efectuar operaciones con él.
		setTimeout(function () {
			$('#btnPopupAceptar').focus();
		}, 200);

	} else {

		// sino imprimir un simple alert
		alert(mensaje);
	}

}

function showMensajeConfirm(titulo, mensaje, functionAceptar, functionCancelar) {

	// NOTA: En este sistema, no se usa el parámetro título.
	var mensajeTrim = $.trim(mensaje);

	if (mensajeTrim.length < 50) {
		$('#divPopupContainerClassSINO').prop('class', 'container appMsgConfirmContainer verticalAlignmentHelper');
	} else {
		$('#divPopupContainerClassSINO').prop('class', 'container appMsgConfirmContainerBigger verticalAlignmentHelper');
	}

	$('#divPopupPanelClassSINO').prop('class', 'panel panel-primary');

	if ($('#divModalPopupSINO').length) {

		// si se tiene el div de popup
		$('#divPopupMensajeSINO').html(mensajeTrim);

		$('#divModalPopupSINO').modal({
			keyboard: false
		});

		$('#btnPopupAceptarSINO').off('click');
		if (estaDefinido(functionAceptar)) {
			$('#btnPopupAceptarSINO').on('click', functionAceptar);
		}

		$('#btnPopupCancelarSINO').off('click');
		if (estaDefinido(functionCancelar)) {
			$('#btnPopupCancelarSINO').on('click', functionCancelar);
		}

		// pone el foco el boton aceptar, y de paso fix el bug que deja el foco
		// en algún control de la pantalla padre y puede efectuar operaciones con él.
		setTimeout(function () {
			$('#btnPopupAceptarSINO').focus();
		}, 200);

	}

}