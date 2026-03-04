/**
 * ENRUTADOR PRINCIPAL DE LA API (API Routes)
 * Define los endpoints del backend y delega la lógica a los controladores.
 * Siguiendo la arquitectura MVC (Model-View-Controller).
 */

const express = require("express");
const router = express.Router();

// ==========================================
// 1. IMPORTACIÓN DE CONTROLADORES
// ==========================================
const etiquetaController = require("../controllers/etiquetaController");
const busquedaController = require("../controllers/busquedaController");

// ==========================================
// 2. DEFINICIÓN DE RUTAS (ENDPOINTS)
// ==========================================

// GET /api/etiquetas
// Obtiene la lista de todas las emociones (y sus categorías) para pintar el menú lateral.
router.get("/etiquetas", etiquetaController.listarEtiquetas);

// GET /api/buscar/:emocion
// Busca y devuelve los versículos asociados a una emoción específica en formato JSON.
router.get("/buscar/:emocion", busquedaController.buscarPorEmocion);

module.exports = router;
