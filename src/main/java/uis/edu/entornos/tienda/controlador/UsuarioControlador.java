package uis.edu.entornos.tienda.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import uis.edu.entornos.tienda.dto.UsuarioRespuestaDTO;
import uis.edu.entornos.tienda.excepcion.ErrorRespuesta;
import uis.edu.entornos.tienda.modelo.Usuario;
import uis.edu.entornos.tienda.servicio.UsuarioServicio;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuario", description = "Operaciones CRUD sobre la tabla Usuario")
public class UsuarioControlador {

	// Atributos
	@Autowired
	UsuarioServicio usuarioServicio;

	@Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios registrados")
	@ApiResponse(responseCode = "200", description = "Listado obtenido correctamente")
	@GetMapping
	public ResponseEntity<List<UsuarioRespuestaDTO>> cargarUsuarios() {
		List<UsuarioRespuestaDTO> lista = usuarioServicio.getUsuarios().stream()
				.map(UsuarioRespuestaDTO::desde).toList();
		return new ResponseEntity<>(lista, HttpStatus.OK);
	}

	@Operation(summary = "Buscar usuario por id", description = "Obtiene un usuario a partir de su identificador")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Usuario encontrado"),
			@ApiResponse(responseCode = "404", description = "Usuario no encontrado",
					content = @Content(schema = @Schema(implementation = ErrorRespuesta.class))) })
	@GetMapping("/{id}")
	public ResponseEntity<UsuarioRespuestaDTO> buscarPorId(@PathVariable Long id) {
		return new ResponseEntity<>(UsuarioRespuestaDTO.desde(usuarioServicio.buscarUsuario(id)), HttpStatus.OK);
	}

	@Operation(summary = "Crear usuario", description = "Registra un nuevo usuario validando el tipo de documento y que no existan datos duplicados")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Usuario creado correctamente"),
			@ApiResponse(responseCode = "400", description = "Datos invalidos en la solicitud"),
			@ApiResponse(responseCode = "409", description = "Nombre de usuario o correo ya existente") })
	@PostMapping
	public ResponseEntity<UsuarioRespuestaDTO> agregar(@Valid @RequestBody Usuario usuario) {
		Usuario obj = usuarioServicio.nuevoUsuario(usuario);
		return new ResponseEntity<>(UsuarioRespuestaDTO.desde(obj), HttpStatus.CREATED);
	}

	@Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente identificado por id")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente"),
			@ApiResponse(responseCode = "400", description = "Datos invalidos en la solicitud"),
			@ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
			@ApiResponse(responseCode = "409", description = "Nombre de usuario o correo ya existente") })
	@PutMapping("/{id}")
	public ResponseEntity<UsuarioRespuestaDTO> editar(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
		Usuario obj = usuarioServicio.actualizarUsuario(id, usuario);
		return new ResponseEntity<>(UsuarioRespuestaDTO.desde(obj), HttpStatus.OK);
	}

	@Operation(summary = "Eliminar usuario", description = "Elimina un usuario a partir de su identificador")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente"),
			@ApiResponse(responseCode = "404", description = "Usuario no encontrado") })
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		usuarioServicio.borrarUsuario(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
