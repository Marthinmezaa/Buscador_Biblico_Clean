/**
 * SCRIPT DE MANTENIMIENTO: IMPORTADOR DE DATOS JSON
 * Lee el archivo datos.json y puebla las tablas relacionales en SQLite.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path"); // <-- Nueva herramienta nativa de Node.js

// 1. Ruta absoluta a la base de datos (Sube un nivel hacia la raíz de forma segura)
const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

// 2. Ruta a tus datos.
// ASUMIENDO QUE MOVISTE datos.json ADENTRO DE LA CARPETA scripts:
const datos = require("../datos.json");

// (Nota: Si dejaste datos.json afuera en la raíz, cambia la línea de arriba por: require("../datos.json"); )

console.log("Iniciando la importación masiva de versículos...");

db.serialize(() => {
  datos.forEach((dato) => {
    // 1. Inserción condicional: Crear la etiqueta/categoría solo si no existe
    db.run(`INSERT INTO etiquetas (nombre, categoria) 
                SELECT '${dato.emocion}', '${dato.categoria}' 
                WHERE NOT EXISTS (SELECT 1 FROM etiquetas WHERE nombre = '${dato.emocion}')`);

    // 2. Insertar el versículo en su tabla principal
    db.run(
      `INSERT INTO versiculos (libro, capitulo, numero_versiculo, texto) VALUES (?, ?, ?, ?)`,
      [dato.libro, dato.capitulo, dato.versiculo, dato.texto],
      function (err) {
        if (err)
          return console.error("Error al insertar versículo:", err.message);

        const versiculoId = this.lastID; // Captura el ID recién generado

        // 3. Relacionar versículo con su etiqueta en la tabla puente
        db.get(
          `SELECT id FROM etiquetas WHERE nombre = ?`,
          [dato.emocion],
          (err, row) => {
            if (row) {
              db.run(
                `INSERT INTO versiculo_etiqueta (versiculo_id, etiqueta_id) VALUES (?, ?)`,
                [versiculoId, row.id],
              );
            }
          },
        );
      },
    );
  });
});

// Timeout de seguridad para asegurar que las transacciones asíncronas terminen
setTimeout(() => {
  console.log(
    "¡Importación terminada con éxito! Ya puedes probarlos en tu buscador.",
  );
  db.close();
}, 2000);
