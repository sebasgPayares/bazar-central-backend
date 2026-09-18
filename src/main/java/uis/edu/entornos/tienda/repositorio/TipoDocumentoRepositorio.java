package uis.edu.entornos.tienda.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import uis.edu.entornos.tienda.modelo.Tipodocumento;

public interface TipoDocumentoRepositorio extends JpaRepository<Tipodocumento, Long> {

}
