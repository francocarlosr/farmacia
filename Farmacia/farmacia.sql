-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema farmacia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema farmacia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `farmacia` DEFAULT CHARACTER SET utf8 ;
USE `farmacia` ;

-- -----------------------------------------------------
-- Table `farmacia`.`compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`compra` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `proveedor` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`producto` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `codigo` INT(11) NOT NULL,
  `precio` FLOAT NOT NULL,
  `stock` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`detallecompra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`detallecompra` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cantidad` INT(11) NOT NULL,
  `precio` FLOAT NOT NULL,
  `producto_id` INT(11) NOT NULL,
  `venta_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_DetalleCompra_Producto1_idx` (`producto_id` ASC) VISIBLE,
  INDEX `fk_DetalleCompra_Venta1_idx` (`venta_id` ASC) VISIBLE,
  CONSTRAINT `fk_DetalleCompra_Producto1`
    FOREIGN KEY (`producto_id`)
    REFERENCES `farmacia`.`producto` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_DetalleCompra_Venta1`
    FOREIGN KEY (`venta_id`)
    REFERENCES `farmacia`.`compra` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`rol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`rol` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_nombre` (`nombre` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`empleado` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `rol_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_nombre` (`nombre` ASC) VISIBLE,
  INDEX `rol_id` (`rol_id` ASC) VISIBLE,
  CONSTRAINT `empleado_ibfk_1`
    FOREIGN KEY (`rol_id`)
    REFERENCES `farmacia`.`rol` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`venta` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `cliente` VARCHAR(45) NOT NULL,
  `empleado_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_empleado_venta` (`empleado_id` ASC) VISIBLE,
  CONSTRAINT `fk_empleado_venta`
    FOREIGN KEY (`empleado_id`)
    REFERENCES `farmacia`.`empleado` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`detalleventa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`detalleventa` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cantidad` INT(11) NOT NULL,
  `precio` FLOAT NOT NULL,
  `compraVenta_id` INT(11) NOT NULL,
  `producto_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Detalle_CompraVenta1_idx` (`compraVenta_id` ASC) VISIBLE,
  INDEX `fk_Detalle_Producto1_idx` (`producto_id` ASC) VISIBLE,
  CONSTRAINT `fk_Detalle_CompraVenta1`
    FOREIGN KEY (`compraVenta_id`)
    REFERENCES `farmacia`.`venta` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Detalle_Producto1`
    FOREIGN KEY (`producto_id`)
    REFERENCES `farmacia`.`producto` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `farmacia`.`lote`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`lote` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `lote` VARCHAR(45) NOT NULL,
  `vencimiento` DATETIME NOT NULL,
  `cantidad` INT(11) NOT NULL,
  `producto_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Lote_Producto1_idx` (`producto_id` ASC) VISIBLE,
  CONSTRAINT `fk_Lote_Producto1`
    FOREIGN KEY (`producto_id`)
    REFERENCES `farmacia`.`producto` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
