package uis.edu.entornos.tienda.seguridad;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Reglas de acceso de toda la API. Se leen de arriba a abajo: la primera
 * regla que haga match con la ruta pedida es la que aplica.
 *
 * Usamos JWT sin sesiones (STATELESS): el servidor no "recuerda" quien
 * esta logueado entre peticiones, cada peticion se autentica sola con
 * su token. Por eso no hay login por formulario tradicional de Spring.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthFiltro jwtAuthFiltro;

	@Autowired
	private PuntoEntradaNoAutenticado puntoEntradaNoAutenticado;

	@Autowired
	private ManejadorAccesoDenegado manejadorAccesoDenegado;

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable()) // no hace falta CSRF: no usamos cookies de sesion, usamos JWT
			.cors(cors -> {}) // usa el bean CorsConfigurationSource de WebConfig
			.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.exceptionHandling(handling -> handling
				.authenticationEntryPoint(puntoEntradaNoAutenticado) // sin token / token invalido -> 401 en JSON
				.accessDeniedHandler(manejadorAccesoDenegado))       // token valido, rol insuficiente -> 403 en JSON
			.authorizeHttpRequests(auth -> auth
				// Preflight de CORS: el navegador manda OPTIONS antes de POST/PUT/DELETE
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

				// Publico: registrarse, iniciar sesion, documentacion
				.requestMatchers("/api/auth/**").permitAll()
				.requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**").permitAll()

				// Publico: navegar el catalogo y ver tipos de documento (solo lectura)
				.requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/api/tipos-documento/**").permitAll()

				// Solo ADMIN puede modificar el catalogo o el stock
				.requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PATCH, "/api/productos/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")

				// Solo ADMIN puede gestionar usuarios desde el panel
				.requestMatchers("/api/usuarios/**").hasRole("ADMIN")

				// Pedidos: "mis-pedidos" es de cualquier usuario logueado (antes que la
				// regla general de abajo, porque el orden de las reglas importa).
				// Listar TODOS los pedidos y cambiar su estado es solo de ADMIN.
				// Crear un pedido y ver el detalle de uno especifico solo requiere estar
				// logueado (la pertenencia del pedido se valida dentro del controlador).
				.requestMatchers(HttpMethod.GET, "/api/pedidos/mis-pedidos").authenticated()
				.requestMatchers(HttpMethod.GET, "/api/pedidos").hasRole("ADMIN")
				.requestMatchers(HttpMethod.PATCH, "/api/pedidos/*/estado").hasRole("ADMIN")

				// Cualquier otra ruta: hay que estar logueado (con cualquier rol)
				.anyRequest().authenticated()
			)
			.addFilterBefore(jwtAuthFiltro, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
