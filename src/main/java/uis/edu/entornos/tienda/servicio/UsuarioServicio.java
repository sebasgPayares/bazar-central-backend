package uis.edu.entornos.tienda.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import uis.edu.entornos.tienda.excepcion.RecursoNoEncontradoException;
import uis.edu.entornos.tienda.excepcion.SolicitudInvalidaException;
import uis.edu.entornos.tienda.modelo.Tipodocumento;
import uis.edu.entornos.tienda.modelo.Usuario;
import uis.edu.entornos.tienda.repositorio.TipoDocumentoRepositorio;
import uis.edu.entornos.tienda.repositorio.UsuarioRepositorio;

@Service
@Transactional
public class UsuarioServicio implements IUsuarioServicio {

	// Atributo
	// Tipo repositorio
	@Autowired
	UsuarioRepositorio usuarioRepositorio;

	@Autowired
	TipoDocumentoRepositorio tipoDocumentoRepositorio;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public List<Usuario> getUsuarios() {
		return usuarioRepositorio.findAll();
	}

	@Override
	public Usuario buscarUsuario(Long id) {
		return usuarioRepositorio.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un usuario con id " + id));
	}

	@Override
	public Usuario buscarPorNombreUsuario(String nombreUsuario) {
		return usuarioRepositorio.findByNombreUsuario(nombreUsuario)
				.orElseThrow(() -> new uis.edu.entornos.tienda.excepcion.CredencialesInvalidasException(
						"Usuario o contrasena incorrectos"));
	}

	@Override
	public Usuario nuevoUsuario(Usuario usuario) {
		// Se ignora cualquier id que venga en el body: si el cliente envia un id
		// existente, JPA lo interpretaria como una actualizacion y fallaria porque
		// esa fila no existe. Al crear, el id SIEMPRE lo genera la base de datos.
		usuario.setId(null);
		validarTipoDocumento(usuario);
		validarDuplicados(usuario, false);
		usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
		return usuarioRepositorio.save(usuario);
	}

	@Override
	public Usuario actualizarUsuario(Long id, Usuario usuario) {
		Usuario existente = buscarUsuario(id);

		validarTipoDocumento(usuario);
		usuario.setId(id);
		validarDuplicados(usuario, true);

		existente.setEmail(usuario.getEmail());
		existente.setIdTipoDocumento(usuario.getIdTipoDocumento());
		existente.setNombre(usuario.getNombre());
		existente.setNombreUsuario(usuario.getNombreUsuario());
		existente.setNumeroDocumento(usuario.getNumeroDocumento());
		existente.setPassword(passwordEncoder.encode(usuario.getPassword()));
		existente.setRol(usuario.getRol());

		return usuarioRepositorio.save(existente);
	}

	@Override
	public void borrarUsuario(Long id) {
		// Verifica que exista antes de borrar; si no, lanza RecursoNoEncontradoException
		buscarUsuario(id);
		usuarioRepositorio.deleteById(id);
	}

	// ---- Validaciones de negocio ----

	private void validarTipoDocumento(Usuario usuario) {
		if (usuario.getIdTipoDocumento() == null || usuario.getIdTipoDocumento().getId() == null) {
			throw new SolicitudInvalidaException("Debe indicar el id del tipo de documento");
		}
		Long idTipo = usuario.getIdTipoDocumento().getId();
		Tipodocumento tipo = tipoDocumentoRepositorio.findById(idTipo)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un tipo de documento con id " + idTipo));
		usuario.setIdTipoDocumento(tipo);
	}

	private void validarDuplicados(Usuario usuario, boolean esActualizacion) {
		boolean nombreUsuarioRepetido = esActualizacion
				? usuarioRepositorio.existsByNombreUsuarioAndIdNot(usuario.getNombreUsuario(), usuario.getId())
				: usuarioRepositorio.existsByNombreUsuario(usuario.getNombreUsuario());
		if (nombreUsuarioRepetido) {
			throw new SolicitudInvalidaException(
					"El nombre de usuario '" + usuario.getNombreUsuario() + "' ya esta en uso");
		}

		boolean emailRepetido = esActualizacion
				? usuarioRepositorio.existsByEmailAndIdNot(usuario.getEmail(), usuario.getId())
				: usuarioRepositorio.existsByEmail(usuario.getEmail());
		if (emailRepetido) {
			throw new SolicitudInvalidaException("El correo '" + usuario.getEmail() + "' ya esta registrado");
		}
	}

}