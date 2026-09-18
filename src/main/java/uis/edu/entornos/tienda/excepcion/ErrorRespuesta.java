package uis.edu.entornos.tienda.excepcion;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Estructura estandar para devolver errores desde la API.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorRespuesta {

	private LocalDateTime fecha;
	private int estado;
	private String error;
	private String mensaje;
	private String ruta;
	private Map<String, String> camposInvalidos;

	public ErrorRespuesta(int estado, String error, String mensaje, String ruta) {
		this.fecha = LocalDateTime.now();
		this.estado = estado;
		this.error = error;
		this.mensaje = mensaje;
		this.ruta = ruta;
	}
}
