package uis.edu.entornos.tienda.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import uis.edu.entornos.tienda.modelo.Tipodocumento;
import uis.edu.entornos.tienda.servicio.TipoDocumentoServicio;

/**
 * Controlador de solo lectura. Se agrega para poder consultar facilmente
 * los ids de TipoDocumento validos al probar el CRUD de Usuario.
 */
@RestController
@RequestMapping("/api/tipos-documento")
@Tag(name = "TipoDocumento", description = "Consulta de tipos de documento (solo lectura)")
public class TipoDocumentoControlador {

	@Autowired
	TipoDocumentoServicio tipoDocumentoServicio;

	@Operation(summary = "Listar tipos de documento")
	@GetMapping
	public ResponseEntity<List<Tipodocumento>> listar() {
		return new ResponseEntity<>(tipoDocumentoServicio.getTiposDocumento(), HttpStatus.OK);
	}

	@Operation(summary = "Buscar tipo de documento por id")
	@GetMapping("/{id}")
	public ResponseEntity<Tipodocumento> buscarPorId(@PathVariable Long id) {
		return new ResponseEntity<>(tipoDocumentoServicio.buscarTipoDocumento(id), HttpStatus.OK);
	}
}
