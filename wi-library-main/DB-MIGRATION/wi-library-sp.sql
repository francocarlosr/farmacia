
DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_all_libros`()
BEGIN
	SELECT 
	l.id_libro,
	l.nombre as libro_nombre,
	l.año as libro_año,
	l.tipo as libro_tipo,
	l.isbn as libro_isbn,
	l.fecha_alta as libro_fecha_alta,
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
	INNER JOIN proveedores as p ON l.id_proveedor = p.id_proveedor;
END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_all_stock`()
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
	INNER JOIN libros as l ON l.id_libro = l.id_libro;
	
END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_all_usuarios`()
BEGIN
SELECT  
u.id_usuario,
u.username as usuario,
u.`password` as contraseña,
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

END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_all_ventaProducto`()
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

END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_all_ventas`()
BEGIN
SELECT 
	v.id_venta,
	v.fecha_alta as venta_fecha_alta,
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
END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_libro`(in id INT)
BEGIN
SELECT 
l.id_libro,
l.nombre as libro_nombre,
l.año as libro_año,
l.tipo as libro_tipo,
l.isbn as libro_isbn,
l.fecha_alta as libro_fecha_alta,

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

END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_stock`(in id INT)
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

END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_usuario`(in id int)
BEGIN
SELECT  
u.id_usuario,
u.username as usuario,
u.`password` as contraseña,
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
END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_ventaProducto`(in id INT)
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
END$$
DELIMITER ;

DELIMITER $$
USE `u519644842_wilibrary`$$
CREATE  PROCEDURE `get_ventas`()
BEGIN
SELECT 
	v.id_venta,
	v.fecha_alta as venta_fecha_alta,
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
END$$
DELIMITER ;
