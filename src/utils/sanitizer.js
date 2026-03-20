const xss = require("xss");

/**
 * Sanitiza texto para prevenir XSS usando la libreria 'xss'
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto sanitizado (nuevo string, no modifica el original)
 */
function sanitizeHtml(text) {
  if (typeof text !== "string") {
    // Manejo proactivo de errores: devolvemos string vacio si no es string
    return "";
  }

  try {
    // Configuracion permisiva pero segura para nuestro caso
    // Solo permitimos tags de formato basico que podrian aparecer en versiculos
    return xss(text, {
      whiteList: {
        b: [],
        i: [],
        em: [],
        strong: [],
        u: [],
        br: [],
        p: [],
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script"],
    });
  } catch (error) {
    // Manejo de errores proactivo: en caso de falla, devolvemos texto escapado basico
    console.error("Error en sanitizacion XSS:", error);
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

module.exports = { sanitizeHtml };
