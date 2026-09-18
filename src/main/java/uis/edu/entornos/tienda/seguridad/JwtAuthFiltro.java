package uis.edu.entornos.tienda.seguridad;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Se ejecuta en CADA peticion, antes de que llegue al controlador.
 * Busca el header "Authorization: Bearer <token>", lo valida, y si es
 * correcto le informa a Spring Security quien es el usuario y que rol
 * tiene para esta peticion en particular. Si no hay token, simplemente
 * deja pasar la peticion como anonima (SecurityConfig decide despues
 * si esa ruta requiere estar logueado o no).
 */
@Component
public class JwtAuthFiltro extends OncePerRequestFilter {

	@Autowired
	private JwtService jwtService;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {

		String header = request.getHeader("Authorization");

		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);

			if (jwtService.esValido(token)) {
				String nombreUsuario = jwtService.obtenerNombreUsuario(token);
				String rol = jwtService.obtenerRol(token);

				var authentication = new UsernamePasswordAuthenticationToken(
						nombreUsuario, null, List.of(new SimpleGrantedAuthority("ROLE_" + rol)));

				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}

		filterChain.doFilter(request, response);
	}
}
