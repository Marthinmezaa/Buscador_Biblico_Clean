/**
 * MODELO DE ETIQUETAS (Etiqueta Model)
 * Interactúa directamente con la base de datos SQLite.
 * Aquí es donde viven todas las consultas SQL (El "Chef" de nuestro restaurante).
 */

const db = require("../config/db");

// ==========================================
// 1. DEFINICIÓN DEL MODELO
// ==========================================
const Etiqueta = {
  /**
   * Obtiene todas las etiquetas de la base de datos.
   * @param {Function} Callback - Función que maneja la respuesta (error, datos).
   */
  obtenerTodas: (Callback) => {
    // Usamos SELECT explícito (buenas prácticas) y ordenamos alfabéticamente
    const sql =
      "SELECT id, nombre, categoria FROM etiquetas ORDER BY nombre ASC";

    // Ejecutamos la consulta en la base de datos
    db.all(sql, [], (err, rows) => {
      if (err) {
        // Si la base de datos falla, pasamos el error al controlador
        return Callback(err, null);
      }
      // Si la consulta es exitosa, enviamos las filas (rows) al controlador
      return Callback(null, rows);
    });
  },
};

module.exports = Etiqueta;
