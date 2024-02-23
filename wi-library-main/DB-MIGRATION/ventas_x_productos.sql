CREATE TABLE `ventas_x_productos` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_libro` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio` int NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `fk_libros_idx` (`id_libro`),
  CONSTRAINT `fk_libro` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`),
  CONSTRAINT `fk_ventas` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_ventas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
