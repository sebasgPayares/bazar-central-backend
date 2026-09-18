package uis.edu.entornos.tienda.modelo;

/**
 * CLIENTE: cualquiera que se registra por su cuenta (autoservicio).
 * ADMIN: gestiona la tienda completa. Nunca se asigna desde el registro
 * publico — solo se crea manualmente en la base de datos o por otro admin.
 */
public enum Rol {
	CLIENTE,
	ADMIN
}
