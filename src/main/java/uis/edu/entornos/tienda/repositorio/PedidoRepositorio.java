package uis.edu.entornos.tienda.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import uis.edu.entornos.tienda.modelo.Pedido;

public interface PedidoRepositorio extends JpaRepository<Pedido, Long> {

	List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

	List<Pedido> findAllByOrderByFechaDesc();

}
