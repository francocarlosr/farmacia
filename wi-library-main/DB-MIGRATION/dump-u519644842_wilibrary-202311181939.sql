-- MariaDB dump 10.19  Distrib 10.5.22-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: u519644842_wilibrary
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `autores`
--

DROP TABLE IF EXISTS `autores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autores`
--

LOCK TABLES `autores` WRITE;
/*!40000 ALTER TABLE `autores` DISABLE KEYS */;
INSERT INTO `autores` VALUES (1,'Esteban','Martin','Argentino','Argentino','1990-07-28 00:00:00','1990-07-28 00:00:00','1990-07-28 00:00:00'),(2,'John','Doe','Estadounidense','Autor reconocido','1980-08-25 00:00:00','2023-10-27 09:40:47','2023-10-27 09:40:47'),(3,'Jimi','Carrasco','Estadounidense','Autor reconocido','1993-08-25 00:00:00','2023-10-27 09:42:15','2023-10-27 09:42:15'),(4,'Pupi','Papi','Pepuniano','Esto es una biografía','2023-11-08 00:00:00','2023-11-18 17:42:37','2023-11-18 17:42:37');
/*!40000 ALTER TABLE `autores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (5,'MISTERIO','2023-11-04 17:06:18','2023-11-04 17:06:18'),(6,'Cientifica','2023-11-04 17:06:31','2023-11-04 17:06:31'),(7,'Infantil','2023-11-04 22:09:51','2023-11-04 22:09:51');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editorial`
--

DROP TABLE IF EXISTS `editorial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `editorial` (
  `id_editorial` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_editorial`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editorial`
--

LOCK TABLES `editorial` WRITE;
/*!40000 ALTER TABLE `editorial` DISABLE KEYS */;
INSERT INTO `editorial` VALUES (4,'Alvarez','1990-07-28 00:00:00','1990-07-28 00:00:00');
/*!40000 ALTER TABLE `editorial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libros`
--

DROP TABLE IF EXISTS `libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libros` (
  `id_libro` int NOT NULL AUTO_INCREMENT,
  `id_autor` int NOT NULL,
  `id_categoria` int NOT NULL,
  `id_editorial` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `nombre` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `año` int NOT NULL,
  `tipo` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `isbn` varchar(20) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  `precio` float NOT NULL,
  PRIMARY KEY (`id_libro`),
  KEY `fk_autor_idx` (`id_autor`),
  KEY `fk_categoria_idx` (`id_categoria`),
  KEY `fk_editorial_idx` (`id_editorial`),
  KEY `fk_proveedor_idx` (`id_proveedor`),
  CONSTRAINT `fk_autor` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_editorial` FOREIGN KEY (`id_editorial`) REFERENCES `editorial` (`id_editorial`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libros`
--

LOCK TABLES `libros` WRITE;
/*!40000 ALTER TABLE `libros` DISABLE KEYS */;
INSERT INTO `libros` VALUES (15,2,5,4,1,'El Principito',2344,'Fisico','23-23232-232222','2023-11-16 18:01:27','2023-11-16 18:01:27',200),(16,1,6,4,1,'La Metamorfosis',2022,'Fisico','23-23232-232322','2023-11-16 18:04:59','2023-11-16 18:04:59',1200),(17,1,6,4,1,'Mil leguas de viaje submarino',1680,'fisico','23-23232-232323','2023-11-16 18:05:30','2023-11-16 18:05:30',233);
/*!40000 ALTER TABLE `libros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personas`
--

DROP TABLE IF EXISTS `personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personas` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellido` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `email` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` bigint NOT NULL,
  `direccion` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  `tipo` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personas`
--

LOCK TABLES `personas` WRITE;
/*!40000 ALTER TABLE `personas` DISABLE KEYS */;
INSERT INTO `personas` VALUES (1,'esteban','martin','est@gmail.com',3804556776,'groeber','2023-10-28 22:21:25','2023-11-11 18:25:25','cliente'),(3,'Carlos','Navarro','est@gmail.com',3804556776,'groeber','2023-10-28 22:21:25','2023-11-11 18:25:25','cliente'),(4,'Pedro','martin','est@gmail.com',3804556776,'groeber','2023-10-28 22:21:25','2023-11-11 18:25:25','cliente'),(8,'asdas','asdasdas','asdasdsa@gmail.com',21321321,'sadas  asdasd ','2023-11-18 17:50:01','2023-11-18 17:50:01','cliente');
/*!40000 ALTER TABLE `personas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `direccion` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `telefono` bigint NOT NULL,
  `mail` varchar(45) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Alvaro','Calle ',3804937533,'svddsvsvs','1990-07-28 00:00:00','1990-07-28 00:00:00');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'Vendedor','2023-10-29 16:24:31','2023-10-29 16:26:48'),(5,'Administrador','2023-11-18 16:56:32','2023-11-18 16:56:32'),(6,'Repositor','2023-11-18 16:56:37','2023-11-18 16:56:37');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock` (
  `id_stock` int NOT NULL AUTO_INCREMENT,
  `id_libro` int NOT NULL,
  `cantidad` int NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_stock`),
  KEY `fk_libros_idx` (`id_libro`),
  CONSTRAINT `fk_libros` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (18,16,20,'2023-11-17 02:41:17','2023-11-17 02:41:17'),(20,17,30,'2023-11-17 19:11:37','2023-11-17 19:11:37'),(21,16,20,'2023-11-18 17:45:30','2023-11-18 17:45:30'),(22,15,5,'2023-11-18 19:04:58','2023-11-18 19:04:58');
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `username` varchar(45) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  `id_rol` int NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `fk_persona_idx` (`id_persona`),
  KEY `fk_rol_idx` (`id_rol`),
  CONSTRAINT `fk_persona` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (27,1,'administrador','$2a$08$F8uCYNUCylvIMVCqyt7LIeg2LX.kaEJCeO8Huu2ECL.MzaLQtatzq',5,'2023-11-18 16:51:54','2023-11-18 16:51:54'),(28,1,'allanos','$2a$08$TgLftcEti8E5G4nxqLM0quEz1FCmp4mBYFjWHEdqO9l0PI9Ai62Lm',2,'2023-11-18 16:51:54','2023-11-18 17:24:09'),(29,3,'fdelgado','$2a$08$hf55I9B9WX7aNKyCzvv0sOOp/kTTHfQW581jZh.1X9JFRnoWsoWx6',6,'2023-11-18 17:25:41','2023-11-18 17:25:41');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_vendedor` int NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime NOT NULL,
  `descuento` int DEFAULT NULL,
  `anulado` tinyint NOT NULL DEFAULT '0',
  `id_cliente` int NOT NULL,
  PRIMARY KEY (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (10,3,'2023-11-17 19:20:14','2023-11-17 21:07:33',50,1,1),(11,3,'2023-11-17 20:26:13','2023-11-17 21:11:21',20,1,1),(12,3,'2023-11-17 21:15:25','2023-11-17 21:15:43',0,1,3),(13,3,'2023-11-18 14:57:03','2023-11-18 14:57:57',50,1,1),(14,1,'2023-11-18 17:50:51','2023-11-18 17:52:41',50,1,8),(15,1,'2023-11-18 19:23:06','2023-11-18 19:23:06',0,0,1);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas_x_productos`
--

DROP TABLE IF EXISTS `ventas_x_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ventas_x_productos` (
  `id_venta` int NOT NULL,
  `id_libro` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio` float NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime DEFAULT NULL,
  `id_venta_producto` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_venta_producto`),
  KEY `fk_libros_idx` (`id_libro`),
  KEY `fk_ventas` (`id_venta`),
  CONSTRAINT `fk_libro` FOREIGN KEY (`id_libro`) REFERENCES `libros` (`id_libro`) ON UPDATE CASCADE,
  CONSTRAINT `fk_ventas` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_x_productos`
--

LOCK TABLES `ventas_x_productos` WRITE;
/*!40000 ALTER TABLE `ventas_x_productos` DISABLE KEYS */;
INSERT INTO `ventas_x_productos` VALUES (10,15,2,200,'2023-11-17 19:20:14','2023-11-17 19:20:14',12),(10,17,2,233,'2023-11-17 19:20:14','2023-11-17 19:20:14',13),(10,16,1,1200,'2023-11-17 19:20:14','2023-11-17 19:20:14',14),(11,15,2,200,'2023-11-17 20:26:13','2023-11-17 20:26:13',15),(11,16,1,1200,'2023-11-17 20:26:13','2023-11-17 20:26:13',16),(12,15,5,200,'2023-11-17 21:15:25','2023-11-17 21:15:25',17),(13,15,5,200,'2023-11-18 14:57:03','2023-11-18 14:57:03',18),(13,16,2,1200,'2023-11-18 14:57:03','2023-11-18 14:57:03',19),(14,17,10,233,'2023-11-18 17:50:51','2023-11-18 17:50:51',20),(15,15,2,200,'2023-11-18 19:23:06','2023-11-18 19:23:06',21),(15,16,3,1200,'2023-11-18 19:23:06','2023-11-18 19:23:06',22);
/*!40000 ALTER TABLE `ventas_x_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'u519644842_wilibrary'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_libros` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_libros`()
BEGIN
	SELECT 
	l.id_libro,
	l.nombre as libro_nombre,
	l.año as libro_año,
	l.tipo as libro_tipo,
	l.isbn as libro_isbn,
	l.fecha_alta as libro_fecha_alta,
    l.precio as libro_precio,
	a.id_autor,
	a.nombre as autor_nombre, 
	a.apellido as autor_apellido,
	a.nacionalidad as autor_nacionalidad,
	a.biografia as autor_biografia,
	a.fecha_nacimiento as autor_fecha_nacimiento,
	c.id_categoria,
	c.nombre as categoria_nombre,
	e.id_editorial,
	e.nombre as editorial_nombre,
	p.id_proveedor,
	p.nombre as proveedor_nombre,
	p.direccion as proveedor_direccion,
	p.telefono as proveedor_telefono,
	p.mail as proveedor_mail,
    (SELECT SUM(cantidad) AS stock FROM stock WHERE id_libro=l.id_libro) as stock,
    (SELECT SUM(vxp.cantidad) AS ventas 
     FROM ventas_x_productos as vxp
	 INNER JOIN ventas AS v ON v.id_venta = vxp.id_venta
     WHERE vxp.id_libro=l.id_libro AND v.anulado=0) as ventas
    FROM libros as l 
	INNER JOIN autores as a ON l.id_autor = a.id_autor
	INNER JOIN categorias as c ON l.id_categoria = c.id_categoria
	INNER JOIN editorial as e ON l.id_editorial = e.id_editorial
	INNER JOIN proveedores as p ON l.id_proveedor = p.id_proveedor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_stock` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_stock`()
BEGIN
	SELECT 
	s.id_stock,
	s.cantidad as stock_cantidad,
	s.fecha_alta as stock_fecha_alta,
	l.id_libro,
	l.nombre as libro_nombre,
	l.año as libro_año,
	l.tipo as libro_tipo,
	l.isbn as libro_isbn,
	l.fecha_alta as libro_fecha_alta
	FROM stock as s
	INNER JOIN libros as l ON s.id_libro = l.id_libro;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_usuarios` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_usuarios`()
BEGIN
SELECT  
u.id_usuario,
u.username as username,
u.`password` as `password`,
u.fecha_alta as fecha_alta,
p.id_persona,
p.nombre as persona_nombre,
p.apellido as persona_apellido,
p.email as persona_email,
p.telefono as persona_telefono,
p.direccion as persona_direccion,
p.tipo as persona_tipo,
r.id_rol,
r.nombre as rol_nombre
FROM usuarios as u
INNER JOIN personas as p ON u.id_persona = p.id_persona
INNER JOIN roles as r ON u.id_rol = r.id_rol;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_ventaProducto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_ventaProducto`()
BEGIN
SELECT
l.id_libro,
l.nombre as libro_nombre,
l.año as libro_año,
l.tipo as libro_tipo,
l.isbn as libro_isbn,
l.fecha_alta as libro_fecha_alta,
vxp.cantidad as vxp_cantidad,
vxp.precio as vxp_precio,
a.id_venta,
a.id_cliente,
a.id_vendedor,
a.descuento as ventas_descuento
FROM ventas_x_productos as vxp
INNER JOIN ventas as a ON vxp.id_venta= a.id_venta
INNER JOIN libros as l ON l.id_libro = vxp.id_libro;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_ventas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_ventas`()
BEGIN
SELECT 
	v.id_venta,
	v.fecha_alta as venta_fecha_alta,
    v.descuento as venta_descuento,
    v.anulado as venta_anulado,
	p.id_persona as id_vendedor,
	p.nombre as vendedor_nombre, 
	p.apellido as vendedor_apellido,
	p.email as vendedor_email,
	p.telefono as vendedor_telefono,
	p.direccion as vendedor_direccion,
	p.fecha_alta as vendedor_fecha_alta,
    pc.id_persona as id_cliente,
    pc.nombre as cliente_nombre, 
	pc.apellido as cliente_apellido,
	pc.email as cliente_email,
	pc.telefono as cliente_telefono,
	pc.direccion as cliente_direccion,
	pc.fecha_alta as cliente_fecha_alta
	FROM ventas as v
	INNER JOIN personas as p ON v.id_vendedor = p.id_persona
    INNER JOIN personas as pc ON v.id_cliente = pc.id_persona;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_libro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_libro`(in id INT)
BEGIN
SELECT 
l.id_libro,
l.nombre as libro_nombre,
l.año as libro_año,
l.tipo as libro_tipo,
l.isbn as libro_isbn,
l.fecha_alta as libro_fecha_alta,
l.precio as libro_precio,

a.id_autor,
a.nombre as autor_nombre, 
a.apellido as autor_apellido,
a.nacionalidad as autor_nacionalidad,
a.biografia as autor_biografia,
a.fecha_nacimiento as autor_fecha_nacimiento,

c.id_categoria,
c.nombre as categoria_nombre,

e.id_editorial,
e.nombre as editorial_nombre,

p.id_proveedor,
p.nombre as proveedor_nombre,
p.direccion as proveedor_direccion,
p.telefono as proveedor_telefono,
p.mail as proveedor_mail

FROM libros as l 
INNER JOIN autores as a ON l.id_autor = a.id_autor
INNER JOIN categorias as c ON l.id_categoria = c.id_categoria
INNER JOIN editorial as e ON l.id_editorial = e.id_editorial
INNER JOIN proveedores as p ON l.id_proveedor = p.id_proveedor

WHERE l.id_libro=id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_stock` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_stock`(in id INT)
BEGIN
	SELECT 
	s.id_stock,
	s.cantidad as stock_cantidad,
	s.fecha_alta as stock_fecha_alta,
	l.id_libro,
	l.nombre as libro_nombre,
	l.año as libro_año,
	l.tipo as libro_tipo,
	l.isbn as libro_isbn,
	l.fecha_alta as libro_fecha_alta
	FROM stock as s
	INNER JOIN libros as l ON s.id_libro = l.id_libro
    
    WHERE s.id_stock=id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_stock_libro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_stock_libro`(IN id int)
BEGIN
SELECT SUM(v.cantidad)-SUM(s.cantidad) as stock_total 
FROM ventas_x_productos as v 
INNER JOIN stock as s ON v.id_libro = s.id_libro 
WHERE v.id_libro=id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_usuario`(in id int)
BEGIN
SELECT  
u.id_usuario,
u.username as username,
u.`password` as `password`,
u.fecha_alta as fecha_alta,
p.id_persona,
p.nombre as persona_nombre,
p.apellido as persona_apellido,
p.email as persona_email,
p.telefono as persona_telefono,
p.direccion as persona_direccion,
p.tipo as persona_tipo,
r.id_rol,
r.nombre as rol_nombre
FROM `wi-libreria`.`usuarios` as u
INNER JOIN `wi-libreria`.personas as p ON u.id_persona = p.id_persona
INNER JOIN `wi-libreria`.roles as r ON u.id_rol = r.id_rol

WHERE u.id_usuario = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_ventaProducto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_ventaProducto`(in id INT)
BEGIN

SELECT
l.id_libro,
l.nombre as libro_nombre,
l.año as libro_año,
l.tipo as libro_tipo,
l.isbn as libro_isbn,
l.fecha_alta as libro_fecha_alta,
vxp.cantidad as vxp_cantidad,
vxp.precio as vxp_precio,
a.id_venta,
a.id_cliente,
a.id_vendedor,
a.descuento as ventas_descuento
FROM ventas_x_productos as vxp
INNER JOIN ventas as a ON vxp.id_venta= a.id_venta
INNER JOIN libros as l ON l.id_libro = vxp.id_libro
WHERE a.id_venta=id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_ventas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_ventas`(IN id INT)
BEGIN
SELECT 
	v.id_venta,
	v.fecha_alta as venta_fecha_alta,
    v.descuento as venta_descuento,
    v.anulado as venta_anulado,
	p.id_persona as id_vendedor,
	p.nombre as vendedor_nombre, 
	p.apellido as vendedor_apellido,
	p.email as vendedor_email,
	p.telefono as vendedor_telefono,
	p.direccion as vendedor_direccion,
	p.fecha_alta as vendedor_fecha_alta,
    pc.id_persona as id_cliente,
    pc.nombre as cliente_nombre, 
	pc.apellido as cliente_apellido,
	pc.email as cliente_email,
	pc.telefono as cliente_telefono,
	pc.direccion as cliente_direccion,
	pc.fecha_alta as cliente_fecha_alta
	FROM ventas as v
	INNER JOIN personas as p ON v.id_vendedor = p.id_persona
    INNER JOIN personas as pc ON v.id_cliente = pc.id_persona
    WHERE v.id_venta = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-18 19:39:06
