package uis.edu.entornos.tienda.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uis.edu.entornos.tienda.excepcion.RecursoNoEncontradoException;
import uis.edu.entornos.tienda.modelo.Tipodocumento;
import uis.edu.entornos.tienda.repositorio.TipoDocumentoRepositorio;

@Service
public class TipoDocumentoServicio {

	@Autowired
	TipoDocumentoRepositorio tipoDocumentoRepositorio;

	public List<Tipodocumento> getTiposDocumento() {
		return tipoDocumentoRepositorio.findAll();
	}

	public Tipodocumento buscarTipoDocumento(Long id) {
		return tipoDocumentoRepositorio.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un tipo de documento con id " + id));
	}
}
