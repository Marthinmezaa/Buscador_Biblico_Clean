const db = require("../config/db");

const Versiculo = {
  // Funcion para buscar versiculos por etiqueta
  buscarPorEtiqueta: (nombreEtiqueta, callback) => {
    // Consulta SQL para obtener los versiculos asociado a una etiqueta
    const sql = `
            SELECT v.libro, v.capitulo, v.numero_versiculo, v.texto 
            FROM versiculos v
            INNER JOIN versiculo_etiqueta ve ON v.id = ve.versiculo_id
            INNER JOIN etiquetas e ON ve.etiqueta_id = e.id
            WHERE e.nombre = ?
        `;

    // Ejecutar la consulta
    db.all(sql, [nombreEtiqueta], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, rows);
    });
  },
};

module.exports = Versiculo;
