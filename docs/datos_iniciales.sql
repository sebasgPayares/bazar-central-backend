-- ============================================================
-- Voltio · Datos iniciales (ejecutar DESPUES de esquema_bd.sql)
-- Motor: MySQL / MariaDB · Base: tiendagenericaII2026
--
-- 1. Tipos de documento: OBLIGATORIOS. El registro de usuarios y el
--    DataInitializer (que crea el usuario admin al arrancar el backend)
--    necesitan que exista al menos un tipo de documento.
-- 2. Productos de ejemplo: opcionales, para que el catalogo no arranque vacio.
--
-- El usuario ADMIN no se inserta aqui: lo crea el backend al arrancar
-- (clase config/DataInitializer) con la contrasena cifrada en BCrypt.
-- ============================================================

USE tiendagenericaII2026;

-- ---------- Tipos de documento ----------
INSERT INTO tipodocumento (tipo) VALUES
  ('Cédula de ciudadanía'),
  ('Tarjeta de identidad'),
  ('Cédula de extranjería'),
  ('Pasaporte');

-- ---------- Productos de ejemplo ----------
-- imagenUrl en NULL: el frontend muestra el icono de la categoria.
INSERT INTO producto (nombre, descripcion, categoria, precio, stock, imagenUrl) VALUES
  ('Smartphone Nova X12 256GB', 'Pantalla AMOLED de 6.7", 256 GB de almacenamiento y cámara triple de 50 MP.', 'Celulares', 2899000.00, 12, NULL),
  ('Smartphone Pulse A7 128GB', 'Gama media con pantalla de 120 Hz, 128 GB y batería de 5000 mAh.', 'Celulares', 1199000.00, 24, NULL),
  ('Smartphone Lite S3 64GB', 'Gama de entrada, 64 GB, doble cámara y lector de huella.', 'Celulares', 549000.00, 39, NULL),
  ('Portátil Gamer Titan 15', 'Core i7, 16 GB RAM, SSD 512 GB, RTX 4050. Pantalla 15.6" de 144 Hz.', 'Computadores', 4599000.00, 5, NULL),
  ('Portátil Ultra Air 14', 'Ultraliviano de 1.2 kg, Ryzen 5, 16 GB RAM, SSD 512 GB.', 'Computadores', 3199000.00, 9, NULL),
  ('Tablet Orbit 11 128GB', 'Pantalla de 11", 128 GB y lápiz compatible.', 'Tablets', 1499000.00, 13, NULL),
  ('Audífonos Bluetooth Aura ANC', 'Cancelación activa de ruido y 30 horas de batería.', 'Audio', 389000.00, 30, NULL);
