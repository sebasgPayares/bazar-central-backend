package uis.edu.entornos.tienda.modelo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = Pedido.TABLE_NAME)
public class Pedido {

	public static final String TABLE_NAME = "pedido";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "El pedido debe tener un usuario asociado")
	@ManyToOne
	@JoinColumn(name = "idUsuario")
	private Usuario usuario;

	@NotNull
	private LocalDateTime fecha;

	@NotNull
	@Enumerated(EnumType.STRING)
	private EstadoPedido estado;

	@NotNull
	@DecimalMin(value = "0.0", inclusive = true)
	private BigDecimal total;

	@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DetallePedido> items = new ArrayList<>();

}
