package uis.edu.entornos.tienda.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import uis.edu.entornos.tienda.modelo.Producto;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

	List<Producto> findByCategoriaIgnoreCase(String categoria);

	List<Producto> findByNombreContainingIgnoreCase(String nombre);

}
