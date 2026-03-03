// 1. IMPORTACIONES
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");

// 2. INICIALIZACION
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARES
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static("public"));

// 4. RUTAS BASE
app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola Usuario! El servidor del Buscador Biblico esta vivo.",
  });
});

// Importar rutas específicas
const apiRoutes = require("./src/routes/apiRoutes");

// Las rutas API comienzen con '/api'
app.use("/api", apiRoutes);

// 5. ENCENDIDO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo perfectamente en http://localhost:${PORT}`);
});
