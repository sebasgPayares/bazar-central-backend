package uis.edu.entornos.tienda.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

	private static final String ESQUEMA_JWT = "bearerAuth";

	@Bean
	OpenAPI tiendaGenericaOpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("API REST - Tienda Generica")
						.description("API REST para la gestion de usuarios y catalogo de productos de una tienda generica, "
								+ "desarrollada con Spring Boot, Spring Data JPA y MySQL. "
								+ "Taller de Entornos de Programacion - UIS.")
						.version("1.0.0")
						.contact(new Contact().name("Entornos de Programacion").email("soporte@uis.edu.co")))
				// Define el esquema "bearerAuth": un token JWT enviado como
				// "Authorization: Bearer <token>". Esto es lo que hace aparecer
				// el boton "Authorize" (con el candado) en Swagger UI.
				.components(new Components().addSecuritySchemes(ESQUEMA_JWT,
						new SecurityScheme()
								.name(ESQUEMA_JWT)
								.type(SecurityScheme.Type.HTTP)
								.scheme("bearer")
								.bearerFormat("JWT")))
				// Lo aplica por defecto a TODOS los endpoints. Los que son publicos
				// (login, registro, GET de productos) igual funcionan sin token
				// porque Spring Security los dejo pasar; esto solo hace que Swagger
				// muestre el candado abierto/cerrado en cada endpoint como referencia.
				.addSecurityItem(new SecurityRequirement().addList(ESQUEMA_JWT));
	}
}
