CREATE TABLE `libros` (
  `id_libro` int NOT NULL AUTO_INCREMENT,
  `id_autor` int NOT NULL,
  `id_categoria` int NOT NULL,
  `id_editorial` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `nombre` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `año` datetime NOT NULL,
  `tipo` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `isbn` int NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_libro`),
  KEY `fk_autor_idx` (`id_autor`),
  KEY `fk_categoria_idx` (`id_categoria`),
  KEY `fk_editorial_idx` (`id_editorial`),
  KEY `fk_proveedor_idx` (`id_proveedor`),
  CONSTRAINT `fk_autor` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`),
  CONSTRAINT `fk_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categorias`),
  CONSTRAINT `fk_editorial` FOREIGN KEY (`id_editorial`) REFERENCES `editorial` (`id_editorial`),
  CONSTRAINT `fk_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

