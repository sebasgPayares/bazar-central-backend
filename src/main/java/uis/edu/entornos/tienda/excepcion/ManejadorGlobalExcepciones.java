package uis.edu.entornos.tienda.excepcion;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Centraliza el manejo de excepciones de la API para que todas
 * las respuestas de error tengan el mismo formato (ErrorRespuesta).
 */
@RestControllerAdvice
public class ManejadorGlobalExcepciones {

	// 404 - recurso no encontrado (ej: usuario o tipo de documento inexistente)
	@ExceptionHandler(RecursoNoEncontradoException.class)
	public ResponseEntity<ErrorRespuesta> manejarRecursoNoEncontrado(RecursoNoEncontradoException ex,
			WebRequest request) {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.NOT_FOUND.value(), "Recurso no encontrado",
				ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	// 401 - credenciales incorrectas al iniciar sesion
	@ExceptionHandler(CredencialesInvalidasException.class)
	public ResponseEntity<ErrorRespuesta> manejarCredencialesInvalidas(CredencialesInvalidasException ex,
			WebRequest request) {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.UNAUTHORIZED.value(), "No autorizado",
				ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}

	// 409 - regla de negocio violada (ej: nombreUsuario o email duplicado)
	@ExceptionHandler(SolicitudInvalidaException.class)
	public ResponseEntity<ErrorRespuesta> manejarSolicitudInvalida(SolicitudInvalidaException ex,
			WebRequest request) {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.CONFLICT.value(), "Solicitud invalida", ex.getMessage(),
				request.getDescription(false));
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	// 400 - errores de validacion de los campos del @RequestBody (@NotBlank, @Email, etc.)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorRespuesta> manejarValidacion(MethodArgumentNotValidException ex, WebRequest request) {
		Map<String, String> campos = new HashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(fe -> campos.put(fe.getField(), fe.getDefaultMessage()));

		ErrorRespuesta error = new ErrorRespuesta(java.time.LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(),
				"Error de validacion", "Uno o mas campos no son validos", request.getDescription(false), campos);
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	// 409 - violacion de integridad de datos (ej: llave duplicada o foranea)
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorRespuesta> manejarIntegridadDatos(DataIntegrityViolationException ex,
			WebRequest request) {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.CONFLICT.value(), "Conflicto de datos",
				"La operacion viola una restriccion de la base de datos (dato duplicado o referencia invalida)",
				request.getDescription(false));
		return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	}

	// 400 - el JSON que mandaron esta mal formado (comas de mas, comillas faltantes, etc.)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorRespuesta> manejarJsonMalFormado(HttpMessageNotReadableException ex,
			WebRequest request) {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.BAD_REQUEST.value(), "JSON invalido",
				"El cuerpo de la peticion no es un JSON valido. Revisa comas, comillas y llaves.",
				request.getDescription(false));
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	// 500 - cualquier otro error no controlado
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorRespuesta> manejarError(Exception ex, WebRequest request) {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error interno",
				ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
