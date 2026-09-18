package uis.edu.entornos.tienda.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import uis.edu.entornos.tienda.dto.CambiarEstadoDTO;
import uis.edu.entornos.tienda.dto.CrearPedidoDTO;
import uis.edu.entornos.tienda.dto.PedidoRespuestaDTO;
import uis.edu.entornos.tienda.modelo.Pedido;
import uis.edu.entornos.tienda.servicio.PedidoServicio;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedido", description = "Creacion y gestion de pedidos: el cliente compra, el admin gestiona el estado")
public class PedidoControlador {

	@Autowired
	PedidoServicio pedidoServicio;

	@Operation(summary = "Crear pedido", description = "Crea un pedido a partir del carrito del usuario autenticado. "
			+ "Valida stock disponible y lo descuenta del catalogo.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Pedido creado correctamente"),
			@ApiResponse(responseCode = "404", description = "Algun producto del carrito no existe"),
			@ApiResponse(responseCode = "409", description = "Stock insuficiente para algun producto") })
	@PostMapping
	public ResponseEntity<PedidoRespuestaDTO> crear(@Valid @RequestBody CrearPedidoDTO datos, Authentication auth) {
		Pedido pedido = pedidoServicio.crearPedido(auth.getName(), datos);
		return new ResponseEntity<>(PedidoRespuestaDTO.desde(pedido), HttpStatus.CREATED);
	}

	@Operation(summary = "Mis pedidos", description = "Lista los pedidos del usuario autenticado, mas reciente primero")
	@GetMapping("/mis-pedidos")
	public ResponseEntity<List<PedidoRespuestaDTO>> misPedidos(Authentication auth) {
		List<PedidoRespuestaDTO> pedidos = pedidoServicio.listarPorUsuario(auth.getName()).stream()
				.map(PedidoRespuestaDTO::desde).toList();
		return new ResponseEntity<>(pedidos, HttpStatus.OK);
	}

	@Operation(summary = "Listar todos los pedidos", description = "Solo ADMIN: los pedidos de todos los clientes")
	@GetMapping
	public ResponseEntity<List<PedidoRespuestaDTO>> listarTodos() {
		List<PedidoRespuestaDTO> pedidos = pedidoServicio.listarTodos().stream()
				.map(PedidoRespuestaDTO::desde).toList();
		return new ResponseEntity<>(pedidos, HttpStatus.OK);
	}

	@Operation(summary = "Ver detalle de un pedido", description = "El ADMIN puede ver cualquier pedido; "
			+ "un CLIENTE solo puede ver los suyos.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Pedido encontrado"),
			@ApiResponse(responseCode = "403", description = "El pedido no le pertenece al cliente autenticado"),
			@ApiResponse(responseCode = "404", description = "Pedido no encontrado") })
	@GetMapping("/{id}")
	public ResponseEntity<PedidoRespuestaDTO> buscarPorId(@PathVariable Long id, Authentication auth) {
		boolean esAdmin = auth.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
		Pedido pedido = esAdmin
				? pedidoServicio.buscarPedido(id)
				: pedidoServicio.buscarPedidoDeUsuario(id, auth.getName());
		return new ResponseEntity<>(PedidoRespuestaDTO.desde(pedido), HttpStatus.OK);
	}

	@Operation(summary = "Cambiar estado del pedido", description = "Solo ADMIN. "
			+ "Si el nuevo estado es CANCELADO, el stock reservado vuelve al catalogo. "
			+ "Un pedido COMPLETADO o CANCELADO ya no puede cambiar de estado.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Estado actualizado correctamente"),
			@ApiResponse(responseCode = "404", description = "Pedido no encontrado"),
			@ApiResponse(responseCode = "409", description = "El pedido ya esta en un estado definitivo") })
	@PatchMapping("/{id}/estado")
	public ResponseEntity<PedidoRespuestaDTO> cambiarEstado(@PathVariable Long id,
			@Valid @RequestBody CambiarEstadoDTO datos) {
		Pedido pedido = pedidoServicio.cambiarEstado(id, datos.getEstado());
		return new ResponseEntity<>(PedidoRespuestaDTO.desde(pedido), HttpStatus.OK);
	}

}
