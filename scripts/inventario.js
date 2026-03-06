/**
 * SCRIPT DE MANTENIMIENTO: INVENTARIO BÍBLICO
 * Imprime en la consola un reporte detallado de los versículos cargados.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// 1. Escudo antibalas para la ruta absoluta de la base de datos
const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

console.log("\nINVENTARIO DETALLADO DE VERSÍCULOS:");
console.log("========================================");

// 2. Consulta SQL con JOIN para cruzar las 3 tablas
const consulta = `
    SELECT e.nombre as Emocion, v.libro as Libro, v.capitulo as Capitulo, v.numero_versiculo as Versiculo
    FROM etiquetas e
    JOIN versiculo_etiqueta ve ON e.id = ve.etiqueta_id
    JOIN versiculos v ON ve.versiculo_id = v.id
    ORDER BY e.nombre ASC, v.libro ASC, v.capitulo ASC
`;

// 3. Ejecución e impresión de resultados
db.all(consulta, [], (err, filas) => {
  if (err) return console.error("Error al leer la base de datos:", err.message);

  if (filas.length === 0) {
    console.log(
      "Tu base de datos está completamente vacía. ¡Es hora de cargar datos!",
    );
  } else {
    let emocionActual = ""; // Variable de control para agrupar por emoción

    filas.forEach((fila) => {
      // Imprime el título de la emoción solo cuando cambia
      if (fila.Emocion !== emocionActual) {
        console.log(`\n${fila.Emocion.toUpperCase()}:`);
        emocionActual = fila.Emocion;
      }

      // Imprime los versículos como lista
      console.log(`   - ${fila.Libro} ${fila.Capitulo}:${fila.Versiculo}`);
    });
  }

  console.log("\n========================================\n");
  db.close();
});
