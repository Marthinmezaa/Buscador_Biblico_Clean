/**
 * CONTROLADOR DE BÚSQUEDA (Busqueda Controller)
 * Maneja la lógica cuando un usuario intenta buscar versículos por emoción.
 */

const Versiculo = require("../models/versiculoModel");

const busquedaController = {
  /**
   * Procesa la petición GET para buscar versículos asociados a una emoción.
   * Extrae el parámetro de la URL y coordina la respuesta con el Modelo.
   */
  buscarPorEmocion: (req, res) => {
    // 1. Capturamos la palabra clave que el usuario escribió en la URL
    const emocionBuscada = req.params.emocion;

    // 2. Le ordenamos al modelo que ejecute la consulta SQL
    Versiculo.buscarPorEtiqueta(emocionBuscada, (err, resultados) => {
      // Manejo de Error Crítico (Status 500: Internal Server Error)
      if (err) {
        console.error("Error en la base de datos al buscar:", err);
        return res
          .status(500)
          .json({ error: "Error interno del servidor al buscar." });
      }

      // Manejo de Búsqueda sin Resultados (Status 404: Not Found)
      // La consulta funcionó, pero no hay versículos en esa etiqueta aún.
      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: `Aún no tenemos versículos registrados para: ${emocionBuscada}`,
        });
      }

      // Caso de Éxito (Status 200: OK)
      // Devolvemos el array de versículos en formato JSON al Frontend.
      res.status(200).json(resultados);
    });
  },
};

module.exports = busquedaController;
