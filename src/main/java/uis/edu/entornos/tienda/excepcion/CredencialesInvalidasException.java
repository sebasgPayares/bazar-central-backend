package uis.edu.entornos.tienda.excepcion;

/**
 * Usuario o contrasena incorrectos al iniciar sesion. Se usa un mensaje
 * generico a proposito: nunca hay que decirle al atacante si fallo el
 * usuario o la contrasena, eso facilita adivinar cuentas validas.
 */
public class CredencialesInvalidasException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CredencialesInvalidasException(String mensaje) {
		super(mensaje);
	}
}
