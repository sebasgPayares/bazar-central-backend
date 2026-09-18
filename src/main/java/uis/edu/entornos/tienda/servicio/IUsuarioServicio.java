package uis.edu.entornos.tienda.servicio;

import java.util.List;

import uis.edu.entornos.tienda.modelo.Usuario;

public interface IUsuarioServicio {

	List<Usuario> getUsuarios();

	Usuario buscarUsuario(Long id);

	Usuario buscarPorNombreUsuario(String nombreUsuario);

	Usuario nuevoUsuario(Usuario usuario);

	Usuario actualizarUsuario(Long id, Usuario usuario);

	void borrarUsuario(Long id);

}
