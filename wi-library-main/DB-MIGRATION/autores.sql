CREATE TABLE `autores` (
  `id_autor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `apellido` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `nacionalidad` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `biografia` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fecha_nacimiento` datetime NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_autor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
