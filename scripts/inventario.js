const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

// 1. Clasificación manual (puedes mover emociones aquí)
const clasificacion = {
  POSITIVAS: ["AMOR", "GOZO/ALEGRÍA", "PAZ"],
  NEGATIVAS: [
    "ANGUSTIA/DESESPERACIÓN",
    "ANSIEDAD/PREOCUPACIÓN",
    "CULPA/REMORDIMIENTO",
    "IRA/ENOJO",
    "MIEDO/TEMOR",
    "TRISTEZA/AFLICCIÓN",
    "VERGUENZA",
  ],
  NEUTRAS: [],
};

const consulta = `
    SELECT e.nombre as Emocion, v.libro as Libro, v.capitulo as Capitulo, v.numero_versiculo as Versiculo
    FROM etiquetas e
    JOIN versiculo_etiqueta ve ON e.id = ve.etiqueta_id
    JOIN versiculos v ON ve.versiculo_id = v.id
    ORDER BY e.nombre ASC, v.libro ASC, v.capitulo ASC
`;

db.all(consulta, [], (err, filas) => {
  if (err) return console.error("Error:", err.message);

  console.log("\nINVENTARIO CATEGORIZADO POR SENTIMIENTOS:");
  console.log("==========================================");

  // Estructura temporal para agrupar
  const reporte = { POSITIVAS: {}, NEGATIVAS: {}, NEUTRAS: {}, OTRAS: {} };

  filas.forEach((fila) => {
    const emo = fila.Emocion.toUpperCase();
    let catEncontrada = "OTRAS";

    // Corregido: Buscamos la categoría
    for (const [cat, lista] of Object.entries(clasificacion)) {
      if (lista.includes(emo)) {
        catEncontrada = cat;
        break;
      }
    }

    if (!reporte[catEncontrada][emo]) reporte[catEncontrada][emo] = [];
    reporte[catEncontrada][emo].push(
      `${fila.Libro} ${fila.Capitulo}:${fila.Versiculo}`,
    );
  });

  // Impresión final
  for (const [categoria, emociones] of Object.entries(reporte)) {
    const subEmociones = Object.keys(emociones);
    if (subEmociones.length === 0) continue;

    console.log(`\n>>> ${categoria} (${subEmociones.length} emociones) <<<`);

    for (const [emocion, versiculos] of Object.entries(emociones)) {
      console.log(`\n  [${emocion}] - ${versiculos.length} versículos`);
      versiculos.forEach((v) => console.log(`     - ${v}`));
    }
    console.log("\n------------------------------------------");
  }

  db.close();
});
