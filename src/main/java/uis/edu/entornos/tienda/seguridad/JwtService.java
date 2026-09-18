package uis.edu.entornos.tienda.seguridad;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import uis.edu.entornos.tienda.modelo.Usuario;

/**
 * Un JWT es como una "credencial firmada": contiene quien es el usuario
 * (su nombreUsuario) y su rol, todo firmado con una clave secreta que solo
 * el servidor conoce. El cliente lo guarda y lo reenvia en cada peticion
 * (header Authorization: Bearer <token>) en vez de mandar usuario/password
 * en cada llamada.
 */
@Component
public class JwtService {

	@Value("${jwt.secret}")
	private String secreto;

	@Value("${jwt.expiration-ms}")
	private long expiracionMs;

	private SecretKey obtenerClave() {
		return Keys.hmacShaKeyFor(secreto.getBytes());
	}

	public String generarToken(Usuario usuario) {
		Date ahora = new Date();
		Date expira = new Date(ahora.getTime() + expiracionMs);

		return Jwts.builder()
				.subject(usuario.getNombreUsuario())
				.claim("rol", usuario.getRol().name())
				.claim("id", usuario.getId())
				.issuedAt(ahora)
				.expiration(expira)
				.signWith(obtenerClave())
				.compact();
	}

	public Claims validarYObtenerClaims(String token) {
		return Jwts.parser()
				.verifyWith(obtenerClave())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	public String obtenerNombreUsuario(String token) {
		return validarYObtenerClaims(token).getSubject();
	}

	public String obtenerRol(String token) {
		return validarYObtenerClaims(token).get("rol", String.class);
	}

	public boolean esValido(String token) {
		try {
			validarYObtenerClaims(token);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}
}
