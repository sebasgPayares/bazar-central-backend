package uis.edu.entornos.tienda.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import uis.edu.entornos.tienda.dto.LoginRequestDTO;
import uis.edu.entornos.tienda.dto.LoginResponseDTO;
import uis.edu.entornos.tienda.dto.UsuarioRespuestaDTO;
import uis.edu.entornos.tienda.modelo.Usuario;
import uis.edu.entornos.tienda.seguridad.JwtService;
import uis.edu.entornos.tienda.servicio.UsuarioServicio;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacion", description = "Registro publico e inicio de sesion")
public class AuthControlador {

	@Autowired
	UsuarioServicio usuarioServicio;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	JwtService jwtService;

	@Operation(summary = "Registrarse", description = "Crea una cuenta nueva de tipo CLIENTE. "
			+ "El rol nunca se puede elegir desde aqui: registrarse siempre da CLIENTE.")
	@PostMapping("/registro")
	public ResponseEntity<UsuarioRespuestaDTO> registro(@Valid @RequestBody Usuario usuario) {
		// Se ignora cualquier "rol" que venga en el body: el registro publico
		// SIEMPRE crea un CLIENTE. Solo un ADMIN ya logueado puede crear otro
		// ADMIN, y eso pasa por /api/usuarios (protegido), nunca por aqui.
		usuario.setRol(uis.edu.entornos.tienda.modelo.Rol.CLIENTE);
		Usuario creado = usuarioServicio.nuevoUsuario(usuario);
		return new ResponseEntity<>(UsuarioRespuestaDTO.desde(creado), HttpStatus.CREATED);
	}

	@Operation(summary = "Iniciar sesion", description = "Devuelve un token JWT que se debe enviar "
			+ "en el header 'Authorization: Bearer <token>' en las peticiones que lo requieran.")
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO datos) {
		Usuario usuario = usuarioServicio.buscarPorNombreUsuario(datos.getNombreUsuario());

		if (!passwordEncoder.matches(datos.getPassword(), usuario.getPassword())) {
			throw new uis.edu.entornos.tienda.excepcion.CredencialesInvalidasException("Usuario o contrasena incorrectos");
		}

		String token = jwtService.generarToken(usuario);
		LoginResponseDTO respuesta = new LoginResponseDTO(
				token, usuario.getNombreUsuario(), usuario.getNombre(), usuario.getRol().name());
		return new ResponseEntity<>(respuesta, HttpStatus.OK);
	}
}
