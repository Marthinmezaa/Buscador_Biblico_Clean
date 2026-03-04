/**
 * CONFIGURACIÓN DE LA BASE DE DATOS (Database Config)
 * Establece la conexión con SQLite y garantiza que la estructura de tablas exista.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// 1. Construcción de ruta absoluta para evitar errores de directorios al ejecutar Node
const dbPath = path.resolve(__dirname, "../../biblia.db");

// 2. Instanciamos la conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error crítico al conectar con SQLite:", err.message);
  } else {
    console.log("Conectado exitosamente a la base de datos (biblia.db).");
  }
});

// 3. Serialización: Garantiza que las tablas se creen en orden secuencial
db.serialize(() => {
  // Tabla Principal: Almacena los versículos puros
  db.run(`CREATE TABLE IF NOT EXISTS versiculos (
        id INTEGER PRIMARY KEY,
        libro TEXT NOT NULL,
        capitulo INTEGER NOT NULL,
        numero_versiculo TEXT NOT NULL,
        texto TEXT NOT NULL
        )`);

  // Tabla de Clasificación: Menú de emociones (Actualizada con 'categoria')
  db.run(`CREATE TABLE IF NOT EXISTS etiquetas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        categoria TEXT NOT NULL
        )`);

  // Tabla Puente (Relación Muchos a Muchos): Conecta un versículo con múltiples emociones
  db.run(`CREATE TABLE IF NOT EXISTS versiculo_etiqueta (
        versiculo_id INTEGER,
        etiqueta_id INTEGER,
        PRIMARY KEY (versiculo_id, etiqueta_id),
        FOREIGN KEY (versiculo_id) REFERENCES versiculos(id),
        FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id)
        )`);

  console.log("Estructura de tablas verificada y lista para operar.");
});

module.exports = db;
