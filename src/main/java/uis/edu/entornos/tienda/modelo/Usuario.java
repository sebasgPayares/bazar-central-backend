package uis.edu.entornos.tienda.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = Usuario.TABLE_NAME)
public class Usuario {

	public static final String TABLE_NAME = "usuario";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "El tipo de documento es obligatorio")
	@ManyToOne
	@JoinColumn(name = "idTipoDocumento")
	private Tipodocumento idTipoDocumento;

	@NotBlank(message = "El numero de documento es obligatorio")
	@Size(max = 20, message = "El numero de documento no debe superar 20 caracteres")
	private String numeroDocumento;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre no debe superar 100 caracteres")
	private String nombre;

	@NotBlank(message = "La contrasena es obligatoria")
	@Size(min = 6, message = "La contrasena debe tener al menos 6 caracteres")
	private String password;

	@NotBlank(message = "El nombre de usuario es obligatorio")
	@Size(min = 4, max = 30, message = "El nombre de usuario debe tener entre 4 y 30 caracteres")
	private String nombreUsuario;

	@NotBlank(message = "El correo es obligatorio")
	@Email(message = "El correo no tiene un formato valido")
	private String email;

	@NotNull(message = "El rol es obligatorio")
	@Enumerated(EnumType.STRING)
	private Rol rol;

}
