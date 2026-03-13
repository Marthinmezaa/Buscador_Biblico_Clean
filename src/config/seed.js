/**
 * SCRIPT DE SIEMBRA (Seed Data)
 * Utilidad para poblar la base de datos con información inicial de prueba.
 * Útil para configurar entornos de desarrollo desde cero.
 */

const db = require("./db");

console.log("Iniciando la siembra de datos de prueba...");

// Ejecución secuencial para evitar conflictos de llaves foráneas
db.serialize(() => {
  // 1. Limpieza total de tablas (El orden importa para no romper relaciones)
  db.run("BEGIN TRANSACTION");
  db.run("DELETE FROM versiculo_etiqueta");
  db.run("DELETE FROM sinonimos");
  db.run("DELETE FROM etiquetas");
  db.run("DELETE FROM versiculos");
  db.run("COMMIT");

  // 2. Inserción de catálogo de etiquetas (Incluye la nueva columna 'categoria')
  db.run(
    `INSERT INTO etiquetas (id, nombre, categoria) VALUES
        (1, 'Miedo', 'Negativos'),
        (2, 'Ansiedad', 'Negativos'),
        (3, 'Paz', 'Positivos'),
        (4, 'Fuerza', 'Positivos'),
        (5, 'Esperanza', 'Positivos')`,
    (err) => {
      if (err) {
        console.error("Error al insertar etiquetas:", err.message);
      } else {
        console.log("Etiquetas insertadas con éxito.");
      }
    },
  );

  // 3. Inserción de catálogo de versículos principales
  db.run(
    `INSERT INTO versiculos (id, libro, capitulo, numero_versiculo, texto) VALUES 
        (101, 'Josué', 1, '9', 'Ya te lo he ordenado: ¡Sé fuerte y valiente! ¡No tengas miedo ni te desanimes!...'),
        (102, 'Filipenses', 4, '6', 'No se inquieten por nada; más bien, en toda ocasión, con oración...'),
        (103, 'Jeremías', 29, '11', 'Porque yo sé muy bien los planes que tengo para ustedes —afirma el Señor—...')`,
    (err) => {
      if (err) {
        console.error("Error al insertar versículos:", err.message);
      } else {
        console.log("Versículos insertados con éxito.");
      }
    },
  );

  // 4. Creación de relaciones (Vincular versículos con sus respectivas emociones)
  db.run(
    `INSERT INTO versiculo_etiqueta (versiculo_id, etiqueta_id) VALUES 
        (101, 1), (101, 4),
        (102, 2), (102, 3),
        (103, 5), (103, 3)`,
    (err) => {
      if (err) {
        console.error(
          "Error al vincular versículos con etiquetas:",
          err.message,
        );
      } else {
        console.log("Relaciones insertadas con éxito.");
      }
    },
  );

  // 5. Poblar el diccionario
  db.run(
    `INSERT INTO sinonimos (palabra_clave, emocion_oficial) VALUES 
        ('ansios', 'Ansiedad/Preocupación'),
        ('preocupad', 'Ansiedad/Preocupación'),
        ('miedo', 'Miedo/Temor'),
        ('panico', 'Miedo/Temor'),
        ('paz', 'Paz')`,
    (err) => {
      if (err) {
        console.error("Error al insertar sinonimos:", err.message);
      } else {
        console.log("Diccionario insertado con éxito.");
      }
    },
  );

  console.log("¡Base de datos poblada con éxito y lista para pruebas!");
});

// Cierre seguro de la conexión
db.close();
