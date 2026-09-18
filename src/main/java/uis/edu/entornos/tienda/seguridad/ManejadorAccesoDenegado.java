package uis.edu.entornos.tienda.seguridad;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import uis.edu.entornos.tienda.excepcion.ErrorRespuesta;

/**
 * Se activa cuando el usuario SI esta autenticado (tiene un token valido)
 * pero su rol no tiene permiso para esa accion (ej: un CLIENTE intentando
 * borrar un producto, que es solo-ADMIN).
 */
@Component
public class ManejadorAccesoDenegado implements AccessDeniedHandler {

	private final ObjectMapper objectMapper = new ObjectMapper()
			.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
			.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
			throws IOException {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.FORBIDDEN.value(), "Acceso denegado",
				"Tu cuenta no tiene permiso para realizar esta accion", request.getRequestURI());

		response.setStatus(HttpStatus.FORBIDDEN.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write(objectMapper.writeValueAsString(error));
	}
}
