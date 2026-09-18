package uis.edu.entornos.tienda.excepcion;

/**
 * Excepcion lanzada cuando se busca, actualiza o elimina un recurso
 * (por ejemplo un Usuario o un TipoDocumento) que no existe en la base de datos.
 */
public class RecursoNoEncontradoException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public RecursoNoEncontradoException(String mensaje) {
		super(mensaje);
	}
}
