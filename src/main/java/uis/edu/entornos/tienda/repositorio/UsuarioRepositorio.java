package uis.edu.entornos.tienda.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import uis.edu.entornos.tienda.modelo.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

	java.util.Optional<Usuario> findByNombreUsuario(String nombreUsuario);

	boolean existsByNombreUsuario(String nombreUsuario);

	boolean existsByEmail(String email);

	boolean existsByNombreUsuarioAndIdNot(String nombreUsuario, long id);

	boolean existsByEmailAndIdNot(String email, long id);

}
