package uis.edu.entornos.tienda.servicio;

import java.util.List;

import uis.edu.entornos.tienda.modelo.Producto;

public interface IProductoServicio {

	List<Producto> getProductos();

	List<Producto> buscarPorCategoria(String categoria);

	List<Producto> buscarPorNombre(String nombre);

	Producto buscarProducto(Long id);

	Producto nuevoProducto(Producto producto);

	Producto actualizarProducto(Long id, Producto producto);

	void borrarProducto(Long id);

	Producto ajustarStock(Long id, int cantidad);

}
