package uis.edu.entornos.tienda.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import uis.edu.entornos.tienda.modelo.Producto;
import uis.edu.entornos.tienda.servicio.ProductoServicio;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "Producto", description = "Catalogo de productos de la tienda: alta, edicion, consulta y stock")
public class ProductoControlador {

	@Autowired
	ProductoServicio productoServicio;

	@Operation(summary = "Listar productos", description = "Obtiene el catalogo completo, o filtra por nombre/categoria")
	@GetMapping
	public ResponseEntity<List<Producto>> listar(
			@RequestParam(required = false) String nombre,
			@RequestParam(required = false) String categoria) {
		List<Producto> productos;
		if (nombre != null && !nombre.isBlank()) {
			productos = productoServicio.buscarPorNombre(nombre);
		} else if (categoria != null && !categoria.isBlank()) {
			productos = productoServicio.buscarPorCategoria(categoria);
		} else {
			productos = productoServicio.getProductos();
		}
		return new ResponseEntity<>(productos, HttpStatus.OK);
	}

	@Operation(summary = "Buscar producto por id")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Producto encontrado"),
			@ApiResponse(responseCode = "404", description = "Producto no encontrado") })
	@GetMapping("/{id}")
	public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
		return new ResponseEntity<>(productoServicio.buscarProducto(id), HttpStatus.OK);
	}

	@Operation(summary = "Crear producto", description = "Agrega un producto nuevo al catalogo")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Producto creado correctamente"),
			@ApiResponse(responseCode = "400", description = "Datos invalidos en la solicitud") })
	@PostMapping
	public ResponseEntity<Producto> agregar(@Valid @RequestBody Producto producto) {
		Producto obj = productoServicio.nuevoProducto(producto);
		return new ResponseEntity<>(obj, HttpStatus.CREATED);
	}

	@Operation(summary = "Actualizar producto", description = "Actualiza los datos de un producto existente")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Producto actualizado correctamente"),
			@ApiResponse(responseCode = "400", description = "Datos invalidos en la solicitud"),
			@ApiResponse(responseCode = "404", description = "Producto no encontrado") })
	@PutMapping("/{id}")
	public ResponseEntity<Producto> editar(@PathVariable Long id, @Valid @RequestBody Producto producto) {
		Producto obj = productoServicio.actualizarProducto(id, producto);
		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Ajustar stock", description = "Suma o resta unidades del stock. "
			+ "Usa un numero negativo para registrar una venta y positivo para reabastecer.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Stock ajustado correctamente"),
			@ApiResponse(responseCode = "404", description = "Producto no encontrado"),
			@ApiResponse(responseCode = "409", description = "Stock insuficiente para la operacion") })
	@PatchMapping("/{id}/stock")
	public ResponseEntity<Producto> ajustarStock(@PathVariable Long id, @RequestParam int cantidad) {
		return new ResponseEntity<>(productoServicio.ajustarStock(id, cantidad), HttpStatus.OK);
	}

	@Operation(summary = "Eliminar producto")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "204", description = "Producto eliminado correctamente"),
			@ApiResponse(responseCode = "404", description = "Producto no encontrado") })
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		productoServicio.borrarProducto(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
