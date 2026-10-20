
package uis.edu.entornos.tienda.controlador;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import uis.edu.entornos.tienda.modelo.Proveedor;
import uis.edu.entornos.tienda.servicio.ProveedorServicio;

@RestController
@RequestMapping("/api/proveedores")
@Tag(name = "Proveedores", description = "Gestión de proveedores")
public class ProveedorControlador {

    @Autowired
    private ProveedorServicio proveedorServicio;

    @GetMapping
    @Operation(summary = "Listar todos los proveedores")
    public List<Proveedor> listar() {
        return proveedorServicio.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar proveedor por ID")
    public Proveedor buscar(@PathVariable Long id) {
        return proveedorServicio.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar un proveedor")
    public Proveedor crear(@Valid @RequestBody Proveedor proveedor) {
        return proveedorServicio.crear(proveedor);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un proveedor")
    public Proveedor actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Proveedor proveedor) {
        return proveedorServicio.actualizar(id, proveedor);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un proveedor")
    public void eliminar(@PathVariable Long id) {
        proveedorServicio.eliminar(id);
    }
}
