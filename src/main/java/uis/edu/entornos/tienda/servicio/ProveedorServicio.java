
package uis.edu.entornos.tienda.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uis.edu.entornos.tienda.excepcion.RecursoNoEncontradoException;
import uis.edu.entornos.tienda.excepcion.SolicitudInvalidaException;
import uis.edu.entornos.tienda.modelo.Proveedor;
import uis.edu.entornos.tienda.repositorio.ProveedorRepositorio;

@Service
public class ProveedorServicio {

    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

    public List<Proveedor> listar() {
        return proveedorRepositorio.findAll();
    }

    public Proveedor buscar(Long id) {
        return proveedorRepositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un proveedor con id " + id));
    }

    public Proveedor crear(Proveedor proveedor) {
        if (proveedorRepositorio.existsByNit(proveedor.getNit())) {
            throw new SolicitudInvalidaException(
                    "Ya existe un proveedor con el NIT " + proveedor.getNit());
        }

        proveedor.setId(null);
        return proveedorRepositorio.save(proveedor);
    }

    public Proveedor actualizar(Long id, Proveedor datos) {
        Proveedor existente = buscar(id);

        if (proveedorRepositorio.existsByNitAndIdNot(datos.getNit(), id)) {
            throw new SolicitudInvalidaException(
                    "Ya existe otro proveedor con el NIT " + datos.getNit());
        }

        existente.setNombre(datos.getNombre());
        existente.setNit(datos.getNit());
        existente.setContacto(datos.getContacto());
        existente.setTelefono(datos.getTelefono());
        existente.setEmail(datos.getEmail());
        existente.setDireccion(datos.getDireccion());

        return proveedorRepositorio.save(existente);
    }

    public void eliminar(Long id) {
        proveedorRepositorio.delete(buscar(id));
    }
}
