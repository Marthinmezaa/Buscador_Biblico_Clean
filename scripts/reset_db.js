const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta a prueba de balas hacia la raíz
const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

console.log("Destruyendo tablas antiguas y creando la nueva estructura...");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS versiculo_etiqueta");
  db.run("DROP TABLE IF EXISTS etiquetas");
  db.run("DROP TABLE IF EXISTS versiculos");

  db.run(`CREATE TABLE etiquetas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        categoria TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE versiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libro TEXT NOT NULL,
        capitulo INTEGER NOT NULL,
        numero_versiculo TEXT NOT NULL,
        texto TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE versiculo_etiqueta (
        versiculo_id INTEGER,
        etiqueta_id INTEGER,
        FOREIGN KEY(versiculo_id) REFERENCES versiculos(id),
        FOREIGN KEY(etiqueta_id) REFERENCES etiquetas(id)
    )`);
});

setTimeout(() => {
  console.log("¡Base de datos actualizada! Lista para recibir categorías.");
  db.close();
}, 1000);
