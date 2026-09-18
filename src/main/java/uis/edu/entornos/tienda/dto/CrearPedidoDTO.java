package uis.edu.entornos.tienda.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CrearPedidoDTO {

	@NotEmpty(message = "El pedido debe tener al menos un producto")
	@Valid
	private List<ItemPedidoDTO> items;

}
