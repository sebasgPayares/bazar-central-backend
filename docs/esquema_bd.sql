-- ============================================================
-- Bazar Central · Esquema de base de datos (solo estructura)
-- Motor: MySQL / MariaDB · Base: tiendagenericaII2026
-- Nota: en el proyecto, Hibernate (ddl-auto=update) crea/actualiza
-- estas tablas al arrancar. Este script es la referencia del diseño.
-- ============================================================

CREATE DATABASE IF NOT EXISTS tiendagenericaII2026
    CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE tiendagenericaII2026;

CREATE TABLE tipodocumento (
  id   BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id              BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idTipoDocumento BIGINT DEFAULT NULL,
  numeroDocumento VARCHAR(20)  NOT NULL,
  nombre          VARCHAR(100) NOT NULL,
  nombreUsuario   VARCHAR(30)  NOT NULL,
  email           VARCHAR(255) DEFAULT NULL,
  password        VARCHAR(255) DEFAULT NULL,           -- hash BCrypt
  rol             ENUM('ADMIN','CLIENTE') NOT NULL,
  CONSTRAINT fk_usuario_tipodocumento
    FOREIGN KEY (idTipoDocumento) REFERENCES tipodocumento(id)
) ENGINE=InnoDB;

CREATE TABLE producto (
  id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120)  NOT NULL,
  descripcion VARCHAR(500)  DEFAULT NULL,
  categoria   VARCHAR(60)   NOT NULL,
  precio      DECIMAL(38,2) NOT NULL,
  stock       INT           NOT NULL,
  imagenUrl   VARCHAR(300)  DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE pedido (
  id        BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idUsuario BIGINT NOT NULL,
  fecha     DATETIME(6)   NOT NULL,
  total     DECIMAL(38,2) NOT NULL,
  estado    ENUM('PENDIENTE','EN_PREPARACION','COMPLETADO','CANCELADO') NOT NULL,
  CONSTRAINT fk_pedido_usuario
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
) ENGINE=InnoDB;

CREATE TABLE detalle_pedido (
  id             BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idPedido       BIGINT DEFAULT NULL,
  idProducto     BIGINT DEFAULT NULL,
  nombreProducto VARCHAR(255)  NOT NULL,
  cantidad       INT           NOT NULL,
  precioUnitario DECIMAL(38,2) NOT NULL,
  CONSTRAINT fk_detalle_pedido   FOREIGN KEY (idPedido)   REFERENCES pedido(id),
  CONSTRAINT fk_detalle_producto FOREIGN KEY (idProducto) REFERENCES producto(id)
) ENGINE=InnoDB;

-- Tabla nueva (CRUD de Proveedores)
CREATE TABLE proveedor (
  id        BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(120) NOT NULL,
  nit       VARCHAR(30)  NOT NULL,
  contacto  VARCHAR(100) DEFAULT NULL,
  telefono  VARCHAR(20)  DEFAULT NULL,
  email     VARCHAR(150) DEFAULT NULL,
  direccion VARCHAR(200) DEFAULT NULL,
  CONSTRAINT uq_proveedor_nit UNIQUE (nit)
) ENGINE=InnoDB;
