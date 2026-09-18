package uis.edu.entornos.tienda.modelo;

/**
 * Ciclo de vida de un pedido:
 *
 * PENDIENTE      -> se acaba de crear, el stock ya se descontó (reservado)
 * EN_PREPARACION -> el admin ya empezó a prepararlo
 * COMPLETADO     -> entregado, ya no se puede modificar
 * CANCELADO      -> se cancela y el stock reservado vuelve al catalogo
 *
 * Un pedido COMPLETADO o CANCELADO es un estado final: ya no puede
 * cambiar de estado despues de eso (ver PedidoServicio.cambiarEstado).
 */
public enum EstadoPedido {
	PENDIENTE,
	EN_PREPARACION,
	COMPLETADO,
	CANCELADO
}
