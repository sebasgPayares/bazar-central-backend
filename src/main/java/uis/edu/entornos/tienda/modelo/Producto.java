package uis.edu.entornos.tienda.modelo;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = Producto.TABLE_NAME)
public class Producto {

	public static final String TABLE_NAME = "producto";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "El nombre del producto es obligatorio")
	@Size(max = 120, message = "El nombre no debe superar 120 caracteres")
	private String nombre;

	@Size(max = 500, message = "La descripcion no debe superar 500 caracteres")
	private String descripcion;

	@NotBlank(message = "La categoria es obligatoria")
	@Size(max = 60, message = "La categoria no debe superar 60 caracteres")
	private String categoria;

	@NotNull(message = "El precio es obligatorio")
	@DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
	private BigDecimal precio;

	@NotNull(message = "El stock es obligatorio")
	@Min(value = 0, message = "El stock no puede ser negativo")
	private Integer stock;

	@Size(max = 300, message = "La url de la imagen no debe superar 300 caracteres")
	private String imagenUrl;

}
