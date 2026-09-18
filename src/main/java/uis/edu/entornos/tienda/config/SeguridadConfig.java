package uis.edu.entornos.tienda.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Provee el PasswordEncoder usado para nunca guardar contrasenas en texto plano.
 * BCrypt agrega automaticamente un "salt" distinto en cada hash, por lo que dos
 * usuarios con la misma contrasena nunca tendran el mismo valor guardado en BD.
 */
@Configuration
public class SeguridadConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
