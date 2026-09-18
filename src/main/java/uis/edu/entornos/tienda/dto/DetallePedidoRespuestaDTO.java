package uis.edu.entornos.tienda.dto;

import java.math.BigDecimal;

import lombok.Data;
import uis.edu.entornos.tienda.modelo.DetallePedido;

@Data
public class DetallePedidoRespuestaDTO {

	private Long productoId;
	private String nombreProducto;
	private Integer cantidad;
	private BigDecimal precioUnitario;
	private BigDecimal subtotal;

	public static DetallePedidoRespuestaDTO desde(DetallePedido detalle) {
		DetallePedidoRespuestaDTO dto = new DetallePedidoRespuestaDTO();
		dto.setProductoId(detalle.getProducto() != null ? detalle.getProducto().getId() : null);
		dto.setNombreProducto(detalle.getNombreProducto());
		dto.setCantidad(detalle.getCantidad());
		dto.setPrecioUnitario(detalle.getPrecioUnitario());
		dto.setSubtotal(detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad())));
		return dto;
	}

}
