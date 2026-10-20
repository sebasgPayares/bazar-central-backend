
package uis.edu.entornos.tienda.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import uis.edu.entornos.tienda.modelo.Proveedor;

public interface ProveedorRepositorio extends JpaRepository<Proveedor, Long> {

    boolean existsByNit(String nit);

    boolean existsByNitAndIdNot(String nit, Long id);
}
