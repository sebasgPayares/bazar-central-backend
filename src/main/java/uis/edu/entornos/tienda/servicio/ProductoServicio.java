package uis.edu.entornos.tienda.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import uis.edu.entornos.tienda.excepcion.RecursoNoEncontradoException;
import uis.edu.entornos.tienda.excepcion.SolicitudInvalidaException;
import uis.edu.entornos.tienda.modelo.Producto;
import uis.edu.entornos.tienda.repositorio.ProductoRepositorio;

@Service
@Transactional
public class ProductoServicio implements IProductoServicio {

	@Autowired
	ProductoRepositorio productoRepositorio;

	@Override
	public List<Producto> getProductos() {
		return productoRepositorio.findAll();
	}

	@Override
	public List<Producto> buscarPorCategoria(String categoria) {
		return productoRepositorio.findByCategoriaIgnoreCase(categoria);
	}

	@Override
	public List<Producto> buscarPorNombre(String nombre) {
		return productoRepositorio.findByNombreContainingIgnoreCase(nombre);
	}

	@Override
	public Producto buscarProducto(Long id) {
		return productoRepositorio.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un producto con id " + id));
	}

	@Override
	public Producto nuevoProducto(Producto producto) {
		producto.setId(null);
		return productoRepositorio.save(producto);
	}

	@Override
	public Producto actualizarProducto(Long id, Producto producto) {
		Producto existente = buscarProducto(id);

		existente.setNombre(producto.getNombre());
		existente.setDescripcion(producto.getDescripcion());
		existente.setCategoria(producto.getCategoria());
		existente.setPrecio(producto.getPrecio());
		existente.setStock(producto.getStock());
		existente.setImagenUrl(producto.getImagenUrl());

		return productoRepositorio.save(existente);
	}

	@Override
	public void borrarProducto(Long id) {
		buscarProducto(id);
		productoRepositorio.deleteById(id);
	}

	@Override
	public Producto ajustarStock(Long id, int cantidad) {
		// cantidad positiva = entra mercancia (reabastecer)
		// cantidad negativa = sale mercancia (una venta)
		Producto producto = buscarProducto(id);
		int nuevoStock = producto.getStock() + cantidad;
		if (nuevoStock < 0) {
			throw new SolicitudInvalidaException(
					"No hay suficiente stock de '" + producto.getNombre() + "' para esta operacion");
		}
		producto.setStock(nuevoStock);
		return productoRepositorio.save(producto);
	}

}
