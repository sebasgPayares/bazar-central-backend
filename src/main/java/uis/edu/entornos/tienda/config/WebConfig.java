package uis.edu.entornos.tienda.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Permite que el frontend (que corre en otro origen: otro puerto o un
 * archivo local abierto directamente) pueda llamar a esta API desde el
 * navegador. Se expone como CorsConfigurationSource porque asi es como
 * Spring Security (SecurityConfig) sabe aplicar estas reglas ANTES de
 * bloquear la peticion por falta de autenticacion.
 *
 * NOTA: "*" esta bien para desarrollo/portafolio. Si esto algun dia se
 * despliega en produccion para un cliente real, hay que cambiarlo por
 * el dominio exacto del frontend en vez de permitir cualquier origen.
 */
@Configuration
public class WebConfig {

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOriginPatterns(List.of("*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
