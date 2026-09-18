package uis.edu.entornos.tienda.servicio;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import uis.edu.entornos.tienda.dto.CrearPedidoDTO;
import uis.edu.entornos.tienda.dto.ItemPedidoDTO;
import uis.edu.entornos.tienda.excepcion.RecursoNoEncontradoException;
import uis.edu.entornos.tienda.excepcion.SolicitudInvalidaException;
import uis.edu.entornos.tienda.modelo.DetallePedido;
import uis.edu.entornos.tienda.modelo.EstadoPedido;
import uis.edu.entornos.tienda.modelo.Pedido;
import uis.edu.entornos.tienda.modelo.Producto;
import uis.edu.entornos.tienda.modelo.Usuario;
import uis.edu.entornos.tienda.repositorio.PedidoRepositorio;
import uis.edu.entornos.tienda.repositorio.ProductoRepositorio;
import uis.edu.entornos.tienda.repositorio.UsuarioRepositorio;

@Service
@Transactional
public class PedidoServicio {

	@Autowired
	PedidoRepositorio pedidoRepositorio;

	@Autowired
	ProductoRepositorio productoRepositorio;

	@Autowired
	UsuarioRepositorio usuarioRepositorio;

	/**
	 * Crea un pedido a partir del carrito del usuario autenticado.
	 * Valida que haya stock suficiente de CADA producto antes de descontar
	 * nada; si uno falla, no se descuenta ningun stock (todo o nada).
	 */
	public Pedido crearPedido(String nombreUsuario, CrearPedidoDTO datos) {
		Usuario usuario = usuarioRepositorio.findByNombreUsuario(nombreUsuario)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + nombreUsuario));

		// Primero se valida TODO el pedido antes de tocar el stock de nadie.
		List<Producto> productos = new ArrayList<>();
		for (ItemPedidoDTO itemDTO : datos.getItems()) {
			Producto producto = productoRepositorio.findById(itemDTO.getProductoId())
					.orElseThrow(() -> new RecursoNoEncontradoException(
							"No existe un producto con id " + itemDTO.getProductoId()));

			if (producto.getStock() < itemDTO.getCantidad()) {
				throw new SolicitudInvalidaException("No hay suficiente stock de '" + producto.getNombre()
						+ "' (disponible: " + producto.getStock() + ", solicitado: " + itemDTO.getCantidad() + ")");
			}
			productos.add(producto);
		}

		Pedido pedido = new Pedido();
		pedido.setUsuario(usuario);
		pedido.setFecha(LocalDateTime.now());
		pedido.setEstado(EstadoPedido.PENDIENTE);

		BigDecimal total = BigDecimal.ZERO;
		List<DetallePedido> items = new ArrayList<>();

		for (int i = 0; i < datos.getItems().size(); i++) {
			ItemPedidoDTO itemDTO = datos.getItems().get(i);
			Producto producto = productos.get(i);

			// Descuenta el stock: se "reserva" apenas se crea el pedido.
			producto.setStock(producto.getStock() - itemDTO.getCantidad());
			productoRepositorio.save(producto);

			DetallePedido detalle = new DetallePedido();
			detalle.setPedido(pedido);
			detalle.setProducto(producto);
			detalle.setNombreProducto(producto.getNombre());
			detalle.setCantidad(itemDTO.getCantidad());
			detalle.setPrecioUnitario(producto.getPrecio());
			items.add(detalle);

			total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(itemDTO.getCantidad())));
		}

		pedido.setItems(items);
		pedido.setTotal(total);

		return pedidoRepositorio.save(pedido);
	}

	public List<Pedido> listarTodos() {
		return pedidoRepositorio.findAllByOrderByFechaDesc();
	}

	public List<Pedido> listarPorUsuario(String nombreUsuario) {
		Usuario usuario = usuarioRepositorio.findByNombreUsuario(nombreUsuario)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + nombreUsuario));
		return pedidoRepositorio.findByUsuarioIdOrderByFechaDesc(usuario.getId());
	}

	public Pedido buscarPedido(Long id) {
		return pedidoRepositorio.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un pedido con id " + id));
	}

	/** Para un CLIENTE viendo el detalle: solo puede ver SUS PROPIOS pedidos. */
	public Pedido buscarPedidoDeUsuario(Long id, String nombreUsuario) {
		Pedido pedido = buscarPedido(id);
		if (!pedido.getUsuario().getNombreUsuario().equals(nombreUsuario)) {
			throw new AccessDeniedException("Este pedido no te pertenece");
		}
		return pedido;
	}

	/**
	 * Cambia el estado de un pedido (solo lo llama un ADMIN).
	 * Un pedido COMPLETADO o CANCELADO es definitivo: ya no cambia de estado.
	 * Si se cancela, el stock que se habia reservado vuelve al catalogo.
	 */
	public Pedido cambiarEstado(Long id, EstadoPedido nuevoEstado) {
		Pedido pedido = buscarPedido(id);
		EstadoPedido anterior = pedido.getEstado();

		if (anterior == EstadoPedido.COMPLETADO || anterior == EstadoPedido.CANCELADO) {
			throw new SolicitudInvalidaException(
					"Un pedido en estado " + anterior + " ya no puede cambiar de estado");
		}

		if (nuevoEstado == EstadoPedido.CANCELADO) {
			for (DetallePedido item : pedido.getItems()) {
				Producto producto = item.getProducto();
				if (producto != null) {
					producto.setStock(producto.getStock() + item.getCantidad());
					productoRepositorio.save(producto);
				}
			}
		}

		pedido.setEstado(nuevoEstado);
		return pedidoRepositorio.save(pedido);
	}

}
