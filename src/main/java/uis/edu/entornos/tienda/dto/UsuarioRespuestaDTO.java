package uis.edu.entornos.tienda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uis.edu.entornos.tienda.modelo.Usuario;

/**
 * Lo que la API le muestra al mundo cuando devuelve un Usuario.
 * A proposito NO incluye el campo password: la contrasena (ni siquiera
 * su hash) debe viajar nunca en una respuesta JSON.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRespuestaDTO {

	private Long id;
	private String numeroDocumento;
	private String nombre;
	private String nombreUsuario;
	private String email;
	private String tipoDocumento;
	private String rol;

	public static UsuarioRespuestaDTO desde(Usuario usuario) {
		String tipo = usuario.getIdTipoDocumento() != null ? usuario.getIdTipoDocumento().getTipo() : null;
		return new UsuarioRespuestaDTO(usuario.getId(), usuario.getNumeroDocumento(), usuario.getNombre(),
				usuario.getNombreUsuario(), usuario.getEmail(), tipo, usuario.getRol().name());
	}
}
