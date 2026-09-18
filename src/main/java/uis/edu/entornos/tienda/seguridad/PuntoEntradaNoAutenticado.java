package uis.edu.entornos.tienda.seguridad;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import uis.edu.entornos.tienda.excepcion.ErrorRespuesta;

/**
 * Se activa cuando alguien pide un endpoint protegido SIN estar autenticado
 * (sin token, o con un token invalido/expirado). Sin esta clase, Spring
 * Security responde con un 401/403 de cuerpo vacio; con esta clase, responde
 * en el mismo formato ErrorRespuesta que usa el resto de la API.
 */
@Component
public class PuntoEntradaNoAutenticado implements AuthenticationEntryPoint {

	private final ObjectMapper objectMapper = new ObjectMapper()
			.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
			.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
			throws IOException {
		ErrorRespuesta error = new ErrorRespuesta(HttpStatus.UNAUTHORIZED.value(), "No autenticado",
				"Debes iniciar sesion (token JWT valido) para acceder a este recurso", request.getRequestURI());

		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write(objectMapper.writeValueAsString(error));
	}
}
