package uis.edu.entornos.tienda.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import uis.edu.entornos.tienda.modelo.EstadoPedido;
import uis.edu.entornos.tienda.modelo.Pedido;

@Data
public class PedidoRespuestaDTO {

	private Long id;
	private LocalDateTime fecha;
	private EstadoPedido estado;
	private BigDecimal total;
	private Long clienteId;
	private String nombreCliente;
	private String nombreUsuarioCliente;
	private List<DetallePedidoRespuestaDTO> items;

	public static PedidoRespuestaDTO desde(Pedido pedido) {
		PedidoRespuestaDTO dto = new PedidoRespuestaDTO();
		dto.setId(pedido.getId());
		dto.setFecha(pedido.getFecha());
		dto.setEstado(pedido.getEstado());
		dto.setTotal(pedido.getTotal());
		dto.setClienteId(pedido.getUsuario().getId());
		dto.setNombreCliente(pedido.getUsuario().getNombre());
		dto.setNombreUsuarioCliente(pedido.getUsuario().getNombreUsuario());
		dto.setItems(pedido.getItems().stream().map(DetallePedidoRespuestaDTO::desde).toList());
		return dto;
	}

}
