package uis.edu.entornos.tienda.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import uis.edu.entornos.tienda.modelo.Producto;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

	List<Producto> findByCategoriaIgnoreCase(String categoria);

	List<Producto> findByNombreContainingIgnoreCase(String nombre);

	/**
	 * Quita la referencia al producto en los detalles de pedidos ya hechos.
	 * El detalle conserva su nombreProducto y precioUnitario, asi que el
	 * historial de pedidos sigue mostrandose igual despues de borrar el producto.
	 */
	@Modifying
	@Query("UPDATE DetallePedido d SET d.producto = NULL WHERE d.producto.id = :id")
	int desvincularDeDetalles(@Param("id") Long id);

}
