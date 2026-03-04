/**
 * MODELO DE VERSÍCULOS (Versiculo Model)
 * Encargado de las consultas a la tabla 'versiculos' y sus relaciones.
 */

const db = require("../config/db");

const Versiculo = {
  /**
   * Busca versículos asociados a una etiqueta específica y los devuelve en orden aleatorio.
   * @param {string} nombreEtiqueta - El nombre de la emoción/etiqueta a buscar.
   * @param {function} callback - Función que maneja el resultado (error, filas).
   */
  buscarPorEtiqueta: (nombreEtiqueta, callback) => {
    // Consulta SQL usando INNER JOIN para unir las 3 tablas relacionales.
    // Usamos ORDER BY RANDOM() para que el usuario no vea siempre los mismos versículos.
    const sql = `
            SELECT v.libro, v.capitulo, v.numero_versiculo, v.texto 
            FROM versiculos v
            INNER JOIN versiculo_etiqueta ve ON v.id = ve.versiculo_id
            INNER JOIN etiquetas e ON ve.etiqueta_id = e.id
            WHERE e.nombre = ?
            ORDER BY RANDOM()
        `;

    // Ejecutamos la consulta. Usamos [nombreEtiqueta] en lugar de inyectar la variable
    // directamente en el SQL para proteger la base de datos contra SQL Injection.
    db.all(sql, [nombreEtiqueta], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, rows);
    });
  },
};

module.exports = Versiculo;
