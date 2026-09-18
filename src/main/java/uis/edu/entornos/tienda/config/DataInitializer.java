package uis.edu.entornos.tienda.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import uis.edu.entornos.tienda.modelo.Rol;
import uis.edu.entornos.tienda.modelo.Usuario;
import uis.edu.entornos.tienda.repositorio.TipoDocumentoRepositorio;
import uis.edu.entornos.tienda.repositorio.UsuarioRepositorio;

/**
 * Nadie puede registrarse como ADMIN desde /api/auth/registro (a proposito).
 * Este componente crea un ADMIN de arranque para que siempre haya alguien
 * que pueda entrar al panel la primera vez que se levanta el proyecto.
 *
 * Usuario: admin   Contrasena: Admin1234
 * Cambia esta contrasena (o borra este usuario y crea otro) antes de
 * usar esto en un entorno real.
 */
@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	UsuarioRepositorio usuarioRepositorio;

	@Autowired
	TipoDocumentoRepositorio tipoDocumentoRepositorio;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) {
		if (usuarioRepositorio.findByNombreUsuario("admin").isPresent()) {
			return; // ya existe, no hacer nada
		}

		if (tipoDocumentoRepositorio.count() == 0) {
			// application.properties tiene ddl-auto=update: si la BD esta vacia
			// (no corriste el script SQL), esto evita que falle por falta de datos.
			System.out.println("[DataInitializer] No hay tipos de documento: corre el script SQL primero, "
					+ "o crea al menos un Tipodocumento antes de usar /api/auth/registro.");
			return;
		}

		Usuario admin = new Usuario();
		admin.setNombre("Administrador");
		admin.setNombreUsuario("admin");
		admin.setEmail("admin@bazarcentral.com");
		admin.setNumeroDocumento("0000000000");
		admin.setIdTipoDocumento(tipoDocumentoRepositorio.findAll().get(0));
		admin.setPassword(passwordEncoder.encode("Admin1234"));
		admin.setRol(Rol.ADMIN);

		usuarioRepositorio.save(admin);
		System.out.println("[DataInitializer] Usuario ADMIN creado -> usuario: admin / contrasena: Admin1234");
	}
}
