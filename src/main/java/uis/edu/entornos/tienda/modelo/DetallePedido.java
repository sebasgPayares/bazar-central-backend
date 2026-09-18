package uis.edu.entornos.tienda.modelo;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Una linea dentro de un pedido. Guarda nombreProducto y precioUnitario
 * como "fotografia" del momento de la compra: si despues el admin cambia
 * el precio o el nombre del producto en el catalogo, el pedido ya hecho
 * no debe cambiar retroactivamente.
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DetallePedido.TABLE_NAME)
public class DetallePedido {

	public static final String TABLE_NAME = "detalle_pedido";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "idPedido")
	private Pedido pedido;

	@ManyToOne
	@JoinColumn(name = "idProducto")
	private Producto producto;

	@NotBlank
	private String nombreProducto;

	@NotNull
	@Min(value = 1, message = "La cantidad debe ser al menos 1")
	private Integer cantidad;

	@NotNull
	@DecimalMin(value = "0.0", inclusive = true)
	private BigDecimal precioUnitario;

}
