// Importar el modelo de etiqueta
const Versiculo = require("../models/versiculoModel");

const busquedaController = {
  // Funcion activada cuando el usuario hace una busqueda por etiqueta
  buscarPorEtiqueta: (req, res) => {
    // Agarrar la palabra que viene del URL
    const emocionBusqueda = req.params.emocion;

    // Orden al modelos para que ejecute la consulta SQL
    Versiculo.buscarPorEtiqueta(emocionBuscada, (err, resultados) => {
      // Si hay error, esta seccion responde con un mensaje de vuelta
      if (err) {
        console.error("Error de busqueda:", err);
        return res
          .status(500)
          .json({ error: "Error interno del servidor al buscar." });
      }

      // Si hay busqueda exitosa, pero la equiqueta elegida no tiene versiculo
      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: `Aun no tenemos versiculos registrados para: ${emocionBusqueda}`,
        });
      }

      // Caso eitoso de busqueda de versiculos con etoqueta
      res.status(200).json(resultados);
    });
  },
};

module.exports = busquedaController;
