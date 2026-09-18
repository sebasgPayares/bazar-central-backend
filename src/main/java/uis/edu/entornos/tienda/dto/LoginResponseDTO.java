package uis.edu.entornos.tienda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

	private String token;
	private String nombreUsuario;
	private String nombre;
	private String rol;
}
