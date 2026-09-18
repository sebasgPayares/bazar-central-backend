package uis.edu.entornos.tienda.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import uis.edu.entornos.tienda.modelo.EstadoPedido;

@Data
public class CambiarEstadoDTO {

	@NotNull(message = "El estado es obligatorio")
	private EstadoPedido estado;

}
