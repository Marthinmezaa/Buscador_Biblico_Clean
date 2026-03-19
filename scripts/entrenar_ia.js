/**
 * SCRIPT QUIRÚRGICO: ENTRENAMIENTO DE IA (Versión 2.0)
 * Reconstruye la tabla 'sinonimos' preparándola para medir intensidad,
 * sin tocar ni borrar los versículos de tu base de datos.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

console.log(
  "Entrenando la Inteligencia Artificial (Cargando diccionario V2)...",
);

db.serialize(() => {
  // 1. Borramos SOLO la tabla de sinónimos (Tus versículos están a salvo en otra tabla)
  db.run("DROP TABLE IF EXISTS sinonimos");

  // 2. Creamos la tabla de sinónimos desde cero, ahora con las columnas extra que necesitamos
  db.run(`CREATE TABLE sinonimos (
      palabra_clave TEXT UNIQUE,
      emocion_oficial TEXT,
      intensidad INTEGER,
      tipo_match TEXT
  )`);

  // 3. Inyectamos las traducciones, incluyendo la intensidad, el tipo y el Amor
  const sql = `INSERT INTO sinonimos (palabra_clave, emocion_oficial, intensidad, tipo_match) VALUES 
        ('goz', 'Gozo/Alegría', 2, 'raiz'),
        ('alegr', 'Gozo/Alegría', 2, 'raiz'),
        ('paz', 'Paz', 3, 'exacta'),
        
        ('ansios', 'Ansiedad/Preocupación', 2, 'raiz'),
        ('preocupad', 'Ansiedad/Preocupación', 1, 'raiz'),
        ('ansie', 'Ansiedad/Preocupación', 2, 'raiz'),
        
        ('miedo', 'Miedo/Temor', 2, 'raiz'),
        ('temor', 'Miedo/Temor', 2, 'raiz'),
        ('panico', 'Miedo/Temor', 3, 'raiz'),
        
        ('triste', 'Tristeza/Aflicción', 2, 'raiz'),
        ('llorar', 'Tristeza/Aflicción', 2, 'raiz'),
        ('bajon' ,'Tristeza/Aflicción', 1, 'raiz'),
        ('deprimid', 'Tristeza/Aflicción', 3, 'raiz'),
        
        ('angusti', 'Angustia/Desesperación', 2, 'raiz'),
        ('desespera', 'Angustia/Desesperación', 3, 'raiz'),
        
        ('ira', 'Ira/Enojo', 3, 'exacta'),
        ('enoj', 'Ira/Enojo', 2, 'raiz'),
        ('nervi', 'Ira/Enojo', 1, 'raiz'),
        
        ('culp', 'Culpa/Remordimiento', 2, 'raiz'),
        ('remordim', 'Culpa/Remordimiento', 2, 'raiz'),
        ('verguen', 'Verguenza', 2, 'raiz'),
        ('avergon', 'Verguenza', 2, 'raiz'),

        ('amor', 'Amor/Afecto', 3, 'exacta'),
        ('enamor', 'Amor/Afecto', 3, 'raiz'),
        ('cariñ', 'Amor/Afecto', 2, 'raiz'),
        ('afect', 'Amor/Afecto', 2, 'raiz'),
        ('amab', 'Amor/Afecto', 1, 'raiz')
    `;

  db.run(sql, (err) => {
    if (err) {
      console.error("Error al poblar diccionario:", err.message);
    } else {
      console.log(
        "¡Diccionario cargado con éxito! Tu IA ya sabe traducir emociones, medir intensidad y evitar errores.",
      );
    }

    // 4. Cerramos la conexión de forma 100% segura
    db.close((errClose) => {
      if (errClose) {
        console.error("Error al cerrar la base de datos:", errClose.message);
      } else {
        console.log("Conexión a la base de datos cerrada de forma segura.");
      }
    });
  });
});
