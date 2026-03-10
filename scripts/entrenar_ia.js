/**
 * SCRIPT QUIRÚRGICO: ENTRENAMIENTO DE IA
 * Pobla la tabla 'sinonimos' sin borrar los versículos existentes.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

console.log("Entrenando la Inteligencia Artificial (Cargando diccionario)...");

db.serialize(() => {
  // 1. Limpiamos solo el diccionario por si había datos viejos
  db.run("DELETE FROM sinonimos");

  // 2. Inyectamos las traducciones.
  // Izquierda: lo que el usuario escribe. Derecha: tu hashtag oficial.
  const sql = `INSERT INTO sinonimos (palabra_clave, emocion_oficial) VALUES 
        ('ansios', 'Ansiedad/Preocupación'),
        ('preocupad', 'Ansiedad/Preocupación'),
        ('ansie', 'Ansiedad/Preocupación'),
        ('miedo', 'Miedo/Temor'),
        ('temor', 'Miedo/Temor'),
        ('panico', 'Miedo/Temor'),
        ('paz', 'Paz'),
        ('triste', 'Tristeza/Aflicción'),
        ('llorar', 'Tristeza/Aflicción'),
        ('bajon' ,'Tristeza/Aflicción'),
        ('deprimid', 'Tristeza/Aflicción'),
        ('angusti', 'Angustia/Desesperación'),
        ('desespera', 'Angustia/Desesperación')
    `;

  db.run(sql, (err) => {
    if (err) {
      console.error("Error al poblar diccionario:", err.message);
    } else {
      console.log(
        "¡Diccionario cargado con éxito! Tu buscador ya sabe traducir.",
      );
    }
  });
});

// Cerramos la conexión de forma segura
setTimeout(() => {
  db.close();
}, 1000);
