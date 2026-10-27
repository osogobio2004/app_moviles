-- Tablas de Manual 17
CREATE TABLE IF NOT EXISTS origenes_ejemplo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL
);

INSERT IGNORE INTO origenes_ejemplo (id, codigo, nombre) VALUES
(1, 'app_ionic', 'Aplicación Ionic'),
(2, 'importacion', 'Importación');

CREATE TABLE IF NOT EXISTS ejemplos_campos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NULL,
  sitio_web VARCHAR(100) NULL,
  descripcion TEXT NULL,
  edad INT NULL,
  monto DECIMAL(10,2) NOT NULL,
  tipo ENUM('curso','taller') NOT NULL,
  modalidad ENUM('presencial','en_linea') NOT NULL DEFAULT 'presencial',
  tecnologias JSON NULL,
  canales JSON NULL,
  acepta_terminos TINYINT(1) NOT NULL DEFAULT 0,
  recibir_avisos TINYINT(1) NOT NULL DEFAULT 0,
  prioridad INT NOT NULL DEFAULT 3,
  fecha_evento DATE NULL,
  hora_evento TIME NULL,
  origen INT NOT NULL,
  estado ENUM('pendiente','confirmado','cancelado') NOT NULL DEFAULT 'pendiente',
  fecha_envio DATETIME NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ejemplos_campos_origen FOREIGN KEY (origen) REFERENCES origenes_ejemplo(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tablas de Manual 18
CREATE TABLE IF NOT EXISTS marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NULL
);

INSERT IGNORE INTO marcas (id, nombre, descripcion) VALUES
(1, 'AulaTech', 'Marca oficial de prácticas y desarrollo.'),
(2, 'Logitech', 'Periféricos y accesorios.'),
(3, 'Kingston', 'Memorias y almacenamiento.'),
(4, 'Corsair', 'Componentes para computadoras.'),
(5, 'Sony', 'Audio y electrónica.');

CREATE TABLE IF NOT EXISTS proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NULL,
  telefono VARCHAR(20) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1
);

INSERT IGNORE INTO proveedores (id, nombre, correo, telefono, activo) VALUES
(1, 'Distribuidora Aula', 'contacto@distribuidora-aula.com', '555-123-4567', 1);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NULL,
  telefono VARCHAR(20) NULL
);

INSERT IGNORE INTO clientes (id, nombre, correo, telefono) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', '555-987-6543');

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

INSERT IGNORE INTO categorias (id, nombre) VALUES
(1, 'Periféricos'),
(2, 'Almacenamiento'),
(3, 'Audio'),
(4, 'Cómputo');

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  marca INT NULL,
  proveedor INT NULL,
  imagen VARCHAR(36) NULL,
  fecha_registro DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_marca FOREIGN KEY (marca) REFERENCES marcas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_productos_proveedor FOREIGN KEY (proveedor) REFERENCES proveedores(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT IGNORE INTO productos (id, nombre, descripcion, precio, stock, marca, proveedor) VALUES
(1, 'Producto del manual 18', 'Producto inicial de prueba', 450.00, 10, 1, 1),
(2, 'Mouse Óptico', 'Mouse ergonómico USB', 450.00, 25, 2, 1),
(3, 'Producto Nuevo', 'Producto secundario', 12.34, 50, 1, 1);

CREATE TABLE IF NOT EXISTS productos_categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productos_id INT NOT NULL,
  categorias_id INT NOT NULL,
  CONSTRAINT fk_prod_cat_producto FOREIGN KEY (productos_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_prod_cat_categoria FOREIGN KEY (categorias_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT IGNORE INTO productos_categorias (id, productos_id, categorias_id) VALUES
(1, 1, 1),
(2, 2, 1);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente INT NOT NULL,
  producto INT NULL,
  cantidad INT NULL,
  estado ENUM('pendiente','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  observaciones TEXT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente) REFERENCES clientes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_producto FOREIGN KEY (producto) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tablas de Manual 19
CREATE TABLE IF NOT EXISTS pedidos_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido INT NOT NULL,
  producto INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CONSTRAINT fk_pedidos_detalle_pedido FOREIGN KEY (pedido) REFERENCES pedidos(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pedidos_detalle_producto FOREIGN KEY (producto) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_pedidos_detalle_cantidad CHECK (cantidad >= 1 AND cantidad <= 9999),
  CONSTRAINT chk_pedidos_detalle_precio CHECK (precio_unitario >= 0),
  UNIQUE KEY uq_pedido_producto (pedido, producto)
);

INSERT IGNORE INTO pedidos (id, cliente, estado, observaciones, fecha_creacion) VALUES
(1, 1, 'entregado', 'Pedido inicial de práctica', CURRENT_TIMESTAMP);

INSERT IGNORE INTO pedidos_detalle (id, pedido, producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 2, 450.00);

-- Registro en directus_collections
INSERT IGNORE INTO directus_collections (collection) VALUES
('origenes_ejemplo'),
('ejemplos_campos'),
('marcas'),
('proveedores'),
('clientes'),
('categorias'),
('productos'),
('productos_categorias'),
('pedidos'),
('pedidos_detalle');

-- Registro en directus_fields para alias y JSON
INSERT IGNORE INTO directus_fields (collection, field, special, interface) VALUES
('pedidos', 'detalles', 'o2m', 'list-o2m'),
('productos', 'categorias', 'm2m', 'list-m2m'),
('ejemplos_campos', 'tecnologias', 'cast-json', 'select-multiple-checkbox'),
('ejemplos_campos', 'canales', 'cast-json', 'select-multiple-checkbox');

-- Registro en directus_relations
INSERT IGNORE INTO directus_relations (many_collection, many_field, one_collection, one_field, junction_field, one_deselect_action) VALUES
('pedidos_detalle', 'pedido', 'pedidos', 'detalles', NULL, 'delete'),
('pedidos_detalle', 'producto', 'productos', NULL, NULL, 'nullify'),
('pedidos', 'cliente', 'clientes', NULL, NULL, 'nullify'),
('pedidos', 'producto', 'productos', NULL, NULL, 'nullify'),
('productos', 'marca', 'marcas', NULL, NULL, 'nullify'),
('productos', 'proveedor', 'proveedores', NULL, NULL, 'nullify'),
('productos_categorias', 'productos_id', 'productos', 'categorias', 'categorias_id', 'delete'),
('productos_categorias', 'categorias_id', 'categorias', NULL, 'productos_id', 'nullify'),
('ejemplos_campos', 'origen', 'origenes_ejemplo', NULL, NULL, 'nullify');

-- Registro de Permisos en directus_permissions para la politica autenticada
INSERT IGNORE INTO directus_permissions (policy, collection, action, fields)
SELECT 'abf8a154-5b1c-4a46-ac9c-7300570f4f17', col.name, act.name, '*'
FROM (
  SELECT 'origenes_ejemplo' AS name UNION ALL
  SELECT 'ejemplos_campos' UNION ALL
  SELECT 'marcas' UNION ALL
  SELECT 'proveedores' UNION ALL
  SELECT 'clientes' UNION ALL
  SELECT 'categorias' UNION ALL
  SELECT 'productos' UNION ALL
  SELECT 'productos_categorias' UNION ALL
  SELECT 'pedidos' UNION ALL
  SELECT 'pedidos_detalle'
) AS col
CROSS JOIN (
  SELECT 'create' AS name UNION ALL
  SELECT 'read' UNION ALL
  SELECT 'update' UNION ALL
  SELECT 'delete'
) AS act;
