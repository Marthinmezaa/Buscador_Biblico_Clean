/**
 * SCRIPT QUIRÚRGICO: ENTRENAMIENTO DE IA (Versión 2.7)
 * Reconstruye la tabla 'sinonimos'.
 * ¡Nueva emoción negativa agregada: Frustración!
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

console.log(
  "Entrenando la Inteligencia Artificial (Cargando diccionario V2.7)...",
);

db.serialize(() => {
  // 1. Borramos SOLO la tabla de sinónimos
  db.run("DROP TABLE IF EXISTS sinonimos");

  // 2. Creamos la tabla de sinónimos desde cero
  db.run(`CREATE TABLE sinonimos (
      palabra_clave TEXT UNIQUE,
      emocion_oficial TEXT,
      intensidad INTEGER,
      tipo_match TEXT
  )`);

  // 3. Inyectamos las traducciones ordenadas lógicamente
  const sql = `INSERT INTO sinonimos (palabra_clave, emocion_oficial, intensidad, tipo_match) VALUES 
        -- Gozo / Alegría
        ('goz', 'Gozo/Alegría', 2, 'raiz'),
        ('alegr', 'Gozo/Alegría', 2, 'raiz'),
        
        -- Paz / Serenidad
        ('paz', 'Paz / Serenidad', 3, 'exacta'),
        ('seren', 'Paz / Serenidad', 2, 'raiz'),
        ('tranquil', 'Paz / Serenidad', 2, 'raiz'),
        ('calm', 'Paz / Serenidad', 2, 'raiz'),
        
        -- Esperanza
        ('esperanz', 'Esperanza', 3, 'raiz'),
        ('ilusio', 'Esperanza', 2, 'raiz'),
        ('optimis', 'Esperanza', 2, 'raiz'),
        ('aguard', 'Esperanza', 2, 'raiz'),

        -- Confianza / Fe
        ('confianz', 'Confianza/Fe', 3, 'raiz'),
        ('confia', 'Confianza/Fe', 3, 'raiz'),
        ('confio', 'Confianza/Fe', 3, 'raiz'),
        ('fe', 'Confianza/Fe', 3, 'exacta'),
        ('cree', 'Confianza/Fe', 2, 'raiz'),
        ('segur', 'Confianza/Fe', 2, 'raiz'),

        -- Valentía / Coraje
        ('valen', 'Valentía/Coraje', 3, 'raiz'),
        ('coraj', 'Valentía/Coraje', 3, 'raiz'),
        ('esforz', 'Valentía/Coraje', 2, 'raiz'),
        ('valeros', 'Valentía/Coraje', 2, 'raiz'),
        ('anim', 'Valentía/Coraje', 2, 'raiz'),

        -- Gratitud
        ('agradec', 'Gratitud', 3, 'raiz'),
        ('gracias', 'Gratitud', 3, 'exacta'),
        ('gratitud', 'Gratitud', 3, 'raiz'),

        -- Compasión / Misericordia
        ('compasi', 'Compasión/Misericordia', 3, 'raiz'),
        ('misericord', 'Compasión/Misericordia', 3, 'raiz'),
        ('perdon', 'Compasión/Misericordia', 3, 'raiz'),
        ('piedad', 'Compasión/Misericordia', 2, 'raiz'),
        ('bondad', 'Compasión/Misericordia', 2, 'raiz'),
        
        -- Ansiedad / Preocupación
        ('ansios', 'Ansiedad/Preocupación', 2, 'raiz'),
        ('preocupad', 'Ansiedad/Preocupación', 1, 'raiz'),
        ('ansie', 'Ansiedad/Preocupación', 2, 'raiz'),
        
        -- Miedo / Temor
        ('miedo', 'Miedo/Temor', 2, 'raiz'),
        ('temor', 'Miedo/Temor', 2, 'raiz'),
        ('panico', 'Miedo/Temor', 3, 'raiz'),
        
        -- Tristeza / Aflicción
        ('triste', 'Tristeza/Aflicción', 2, 'raiz'),
        ('llorar', 'Tristeza/Aflicción', 2, 'raiz'),
        ('bajon' ,'Tristeza/Aflicción', 1, 'raiz'),
        ('deprimid', 'Tristeza/Aflicción', 3, 'raiz'),
        
        -- Angustia / Desesperación
        ('angusti', 'Angustia/Desesperación', 2, 'raiz'),
        ('desespera', 'Angustia/Desesperación', 3, 'raiz'),
        
        -- Ira / Enojo
        ('ira', 'Ira/Enojo', 3, 'exacta'),
        ('enoj', 'Ira/Enojo', 2, 'raiz'),
        ('nervi', 'Ira/Enojo', 1, 'raiz'),

        -- Frustración
        ('frustr', 'Frustración', 3, 'raiz'),
        ('impoten', 'Frustración', 3, 'raiz'),
        ('decepcion', 'Frustración', 2, 'raiz'),
        ('hart', 'Frustración', 2, 'raiz'),
        
        -- Culpa / Vergüenza
        ('culp', 'Culpa/Remordimiento', 2, 'raiz'),
        ('remordim', 'Culpa/Remordimiento', 2, 'raiz'),
        ('verguen', 'Verguenza', 2, 'raiz'),
        ('avergon', 'Verguenza', 2, 'raiz'),

        -- Amor / Afecto
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
        "¡Diccionario cargado con éxito! Ahora tu IA reconoce la Frustración y la Impotencia.",
      );
    }

    // 4. Cerramos la conexión
    db.close((errClose) => {
      if (errClose) {
        console.error("Error al cerrar la base de datos:", errClose.message);
      } else {
        console.log("Conexión a la base de datos cerrada de forma segura.");
      }
    });
  });
});
