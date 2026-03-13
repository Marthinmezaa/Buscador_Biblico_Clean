/**
 * SERVIDOR PRINCIPAL - BUSCADOR BÍBLICO
 * Archivo de entrada (Entry point) que inicializa la aplicación Express.
 */

// 1. IMPORTACIONES PRINCIPALES
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db"); // Conexión a SQLite
const apiRoutes = require("./src/routes/apiRoutes"); // Enrutador modular

// 2. INICIALIZACIÓN
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARES (Filtros de capa intermedia)
app.use(cors()); // Permite peticiones cruzadas
app.use(express.json()); // Parsea los cuerpos de las peticiones a JSON
app.use(express.static("public")); // Sirve los archivos del frontend (HTML, CSS, JS)

// 4. RUTAS (Endpoints)
// Ruta de comprobación de salud del servidor (Health Check)
app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola Usuario! El servidor del Buscador Biblico esta vivo.",
  });
});

// Montaje del enrutador modular para la API
app.use("/api", apiRoutes);

// 5. ENCENDIDO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo perfectamente en el puerto ${PORT}`);
});
