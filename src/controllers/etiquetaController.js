/**
 * CONTROLADOR DE ETIQUETAS (Etiqueta Controller)
 * Intermediario entre las peticiones web (Rutas) y la base de datos (Modelo).
 * Procesa la solicitud, pide los datos al modelo y responde al cliente (Frontend).
 */

// ==========================================
// 1. IMPORTACIÓN DEL MODELO
// ==========================================
const Etiqueta = require("../models/etiquetaModel");

// ==========================================
// 2. LÓGICA DEL CONTROLADOR
// ==========================================
const etiquetaController = {
  // Método para obtener todas las etiquetas y enviarlas al frontend
  listarEtiquetas: (req, res) => {
    // Le pedimos al Modelo (el experto en bases de datos) que traiga la información
    Etiqueta.obtenerTodas((err, datos) => {
      // Si el Modelo reporta un error (ej. la base de datos está caída), respondemos con status 500
      if (err) {
        console.error("Error en la base de datos:", err);
        return res
          .status(500)
          .json({ error: "Error interno al obtener las etiquetas" });
      }

      // Si todo sale bien, enviamos los datos en formato JSON con un status 200 (OK)
      res.status(200).json(datos);
    });
  },
};

module.exports = etiquetaController;
