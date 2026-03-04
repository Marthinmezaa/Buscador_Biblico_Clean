const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./biblia.db");

console.log("Iniciando limpieza extrema de la base de datos...");

db.serialize(() => {
  // 1. Vaciamos todas las tablas
  db.run("DELETE FROM versiculo_etiqueta");
  db.run("DELETE FROM versiculos");
  db.run("DELETE FROM etiquetas");

  // 2. Reiniciamos los contadores de ID para empezar desde cero
  db.run("DELETE FROM sqlite_sequence WHERE name='versiculos'");
  db.run("DELETE FROM sqlite_sequence WHERE name='etiquetas'");
});

// Le damos 1 segundo al servidor para terminar
setTimeout(() => {
  console.log("¡Base de datos completamente vacía y como nueva!");
  db.close();
}, 1000);
