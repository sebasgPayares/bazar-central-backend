package uis.edu.entornos.tienda.excepcion;

/**
 * Excepcion lanzada cuando una regla de negocio no se cumple,
 * por ejemplo un nombre de usuario o correo que ya existe.
 */
public class SolicitudInvalidaException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public SolicitudInvalidaException(String mensaje) {
		super(mensaje);
	}
}
