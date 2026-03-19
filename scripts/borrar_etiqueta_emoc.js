/**
 * SCRIPT DE ELIMINACIÓN DE ETIQUETA DUPLICADA
 *
 * Este script elimina una etiqueta específica (ej. "Amor") de la base de datos.
 * Primero borra las relaciones en la tabla 'versiculo_etiqueta' para no dejar
 * datos huérfanos, y luego elimina el registro de la tabla 'etiquetas'.
 * LOS VERSÍCULOS NO SE BORRAN.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

// =========================================================
// PARÁMETROS DE BÚSQUEDA
// Define el nombre exacto de la etiqueta que quieres eliminar.
// Nota: Asegúrate de incluir el "#" si lo guardas así en la BD.
// =========================================================
const etiquetaABorrar = "Amor";

console.log(
  `\nIniciando proceso de limpieza para la etiqueta: "${etiquetaABorrar}"...`,
);

db.serialize(() => {
  /**
   * PASO 1: Búsqueda del ID de la etiqueta.
   */
  const consultaBuscarEtiqueta = "SELECT id FROM etiquetas WHERE nombre = ?";

  db.get(consultaBuscarEtiqueta, [etiquetaABorrar], (err, etiqueta) => {
    if (err) {
      return console.error("Error al buscar la etiqueta:", err.message);
    }

    if (!etiqueta) {
      console.log("Etiqueta no encontrada. Verifica la exactitud del texto.");
      return db.close();
    }

    const etiquetaId = etiqueta.id;
    console.log(
      `Etiqueta encontrada (ID: ${etiquetaId}). Procediendo a desvincularla de los versículos...`,
    );

    /**
     * PASO 2: Eliminar las relaciones.
     * Borramos los registros en 'versiculo_etiqueta' que usan esta etiqueta.
     * Los versículos en la tabla 'versiculos' quedan completamente a salvo.
     */
    const consultaBorrarRelaciones =
      "DELETE FROM versiculo_etiqueta WHERE etiqueta_id = ?";

    db.run(consultaBorrarRelaciones, [etiquetaId], (err) => {
      if (err) {
        return console.error("Error al borrar las relaciones:", err.message);
      }

      console.log(
        "Relaciones desvinculadas exitosamente. Eliminando la etiqueta principal...",
      );

      /**
       * PASO 3: Eliminar la etiqueta.
       * Una vez que ningún versículo depende de esta etiqueta, la borramos.
       */
      const consultaBorrarEtiqueta = "DELETE FROM etiquetas WHERE id = ?";

      db.run(consultaBorrarEtiqueta, [etiquetaId], (err) => {
        if (err) {
          return console.error("Error al eliminar la etiqueta:", err.message);
        }

        console.log(
          `¡Operación exitosa! La etiqueta "${etiquetaABorrar}" ha sido eliminada del sistema.\n`,
        );

        // Cierre de la conexión
        db.close();
      });
    });
  });
});
