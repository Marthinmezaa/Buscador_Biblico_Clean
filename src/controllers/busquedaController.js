/**
 * CONTROLADOR DE BÚSQUEDA (Busqueda Controller)
 * Maneja la lógica cuando un usuario intenta buscar versículos por emoción.
 */

const Versiculo = require("../models/versiculoModel");
const Diccionario = require("../models/diccionarioModel");
const { sanitizeHtml } = require("../utils/sanitizer"); // Importamos el sanitizer

/**
 * Valida la entrada de emoción del usuario
 * @param {string} emotion - Emoción a validar
 * @returns {Object} Resultado de validación {isValid, error}
 */
const validateEmotionInput = (emotion) => {
  // Validar que no esté vacío
  if (!emotion || emotion.trim().length === 0) {
    return { isValid: false, error: "La emoción no puede estar vacía" };
  }

  // Validar longitud máxima
  if (emotion.length > 100) {
    return {
      isValid: false,
      error: "La emoción es demasiado larga (máximo 100 caracteres)",
    };
  }

  // Validar caracteres permitidos (letras, espacios, acentos básicos)
  const emotionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s/]+$/;
  if (!emotionRegex.test(emotion)) {
    return {
      isValid: false,
      error: "La emoción contiene caracteres no permitidos",
    };
  }

  return { isValid: true, error: null };
};

const busquedaController = {
  buscarPorEmocion: (req, res) => {
    // 1. Obtener la emoción de la URL (decodificar parámetros codificados)
    const fraseDelUsuario = decodeURIComponent(req.params.emocion);

    // 2. Validar entrada del usuario
    const validation = validateEmotionInput(fraseDelUsuario);
    if (!validation.isValid) {
      console.error("Validación de entrada fallida:", validation.error);
      return res.status(400).json({ error: validation.error });
    }

    // 3. Primero, pasamos la frase por nuestro Diccionario en la base de datos
    Diccionario.traducirFrase(fraseDelUsuario, (err, emocionOficial) => {
      if (err) {
        console.error("Error en el diccionario:", err);
        return res
          .status(500)
          .json({ error: "Error interno al interpretar la frase." });
      }

      // 4. Verificar que la emoción oficial exista
      if (!emocionOficial) {
        console.warn(
          `Emoción no encontrada en diccionario: "${fraseDelUsuario}"`,
        );
        return res.status(404).json({
          error: `La emoción "${fraseDelUsuario}" no está en nuestro diccionario.`,
        });
      }

      // 5. AHORA SÍ: Con la emoción oficial en mano, mandamos a buscar los versículos.
      Versiculo.buscarPorEtiqueta(emocionOficial, (err, resultados) => {
        if (err) {
          console.error("Error de búsqueda:", err);
          return res.status(500).json({
            error: "Error interno del servidor al buscar versículos.",
          });
        }

        if (resultados.length === 0) {
          return res.status(404).json({
            mensaje: `Aún no tenemos versículos registrados para: ${emocionOficial}`,
          });
        }

        // 6. Sanitizar resultados para prevenir XSS (defensa en profundidad)
        const resultadosSanitizados = resultados.map((versiculo) => ({
          ...versiculo,
          texto: sanitizeHtml(versiculo.texto), // Usamos el sanitizer importado
        }));

        // 7. Enviar respuesta segura
        res.status(200).json(resultadosSanitizados);
      });
    });
  },
};

module.exports = busquedaController;
