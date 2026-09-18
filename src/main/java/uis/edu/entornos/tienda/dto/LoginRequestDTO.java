package uis.edu.entornos.tienda.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {

	@NotBlank(message = "El nombre de usuario es obligatorio")
	private String nombreUsuario;

	@NotBlank(message = "La contrasena es obligatoria")
	private String password;
}
