/**
 * SCRIPT DE ELIMINACIÓN MASIVA DE VERSÍCULOS POR EMOCIÓN
 *
 * Este script busca todos los versículos asociados a una emoción (etiqueta) específica
 * y los elimina por completo de la base de datos de forma segura.
 * Mantiene la "Integridad Referencial" eliminando primero todas las etiquetas
 * asociadas a esos versículos antes de purgar los registros principales.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const rutaDB = path.join(__dirname, "../biblia.db");
const db = new sqlite3.Database(rutaDB);

// =========================================================
// PARÁMETROS DE BÚSQUEDA
// Define la emoción/etiqueta cuyos versículos serán eliminados.
// =========================================================
const emocionABorrar = "Compasion/Misericordia";

console.log(
  `\nIniciando proceso de eliminación masiva para la emoción: "${emocionABorrar}"...`,
);

db.serialize(() => {
  /**
   * PASO 1: Búsqueda de la emoción en la tabla de etiquetas.
   * Asumimos que existe una tabla 'etiquetas' (o 'emociones') donde se guardan los nombres.
   */
  const consultaBuscarEmocion = "SELECT id FROM etiquetas WHERE nombre = ?";

  db.get(consultaBuscarEmocion, [emocionABorrar], (err, etiqueta) => {
    if (err) {
      return console.error("Error al buscar la emoción:", err.message);
    }

    if (!etiqueta) {
      console.log(
        "Emoción no encontrada. Verifica que el nombre esté escrito correctamente.",
      );
      return db.close();
    }

    const etiquetaId = etiqueta.id;
    console.log(
      `Emoción encontrada (ID: ${etiquetaId}). Buscando versículos asociados...`,
    );

    /**
     * PASO 2: Recopilar los IDs de todos los versículos que tienen esta emoción.
     */
    const consultaBuscarVersiculos =
      "SELECT versiculo_id FROM versiculo_etiqueta WHERE etiqueta_id = ?";

    db.all(consultaBuscarVersiculos, [etiquetaId], (err, filas) => {
      if (err) {
        return console.error("Error al buscar los versículos:", err.message);
      }

      if (filas.length === 0) {
        console.log(
          "No hay versículos asociados a esta emoción. La base de datos está intacta.",
        );
        return db.close();
      }

      // Extraemos solo los IDs en un array plano, ej: [14, 25, 103, ...]
      const idsVersiculos = filas.map((fila) => fila.versiculo_id);
      console.log(
        `Se encontraron ${idsVersiculos.length} versículo(s). Iniciando eliminación en cascada...`,
      );

      // Creamos los marcadores de posición dinámicos para la consulta SQL (?, ?, ?)
      const placeholders = idsVersiculos.map(() => "?").join(",");

      /**
       * PASO 3: Eliminación de dependencias.
       * Borramos TODAS las entradas en 'versiculo_etiqueta' que pertenezcan a los
       * versículos que vamos a eliminar. Esto evita datos huérfanos de otras emociones
       * que también estuvieran vinculadas a estos mismos versículos.
       */
      const consultaBorrarEtiquetas = `DELETE FROM versiculo_etiqueta WHERE versiculo_id IN (${placeholders})`;

      db.run(consultaBorrarEtiquetas, idsVersiculos, (err) => {
        if (err) {
          return console.error(
            "Error al eliminar las relaciones (etiquetas):",
            err.message,
          );
        }

        /**
         * PASO 4: Eliminación de los registros maestros.
         * Ahora es seguro borrar los versículos de la tabla principal.
         */
        const consultaBorrarVersiculos = `DELETE FROM versiculos WHERE id IN (${placeholders})`;

        db.run(consultaBorrarVersiculos, idsVersiculos, (err) => {
          if (err) {
            return console.error(
              "Error al eliminar los registros principales:",
              err.message,
            );
          }

          console.log(
            `¡Operación exitosa! Se han purgado ${idsVersiculos.length} versículo(s) del sistema.\n`,
          );

          // Cierre de la conexión
          db.close();
        });
      });
    });
  });
});
