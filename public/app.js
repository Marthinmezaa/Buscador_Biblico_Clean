// 1. Seleccion de elementos HTML
const btnMenu = document.getElementById("btn-menu");
const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const contenedorEtiquetas = document.getElementById("contenedor-etiquetas");
const contenedorResultados = document.getElementById("contenedor-resultados");

// Gancho del buscador
const inputBusqueda = document.getElementById("input-busqueda");
const btnBuscar = document.getElementById("btn-buscar");

// 2. Abrir y cerrar el menu
btnMenu.addEventListener("click", () => {
  menuLateral.classList.add("activo");
});

btnCerrarMenu.addEventListener("click", () => {
  menuLateral.classList.remove("activo");
});

// 3.Carga de menu dinamico
async function cargarEtiquetas() {
  try {
    const respuesta = await fetch("/api/etiquetas");
    const etiquetas = await respuesta.json();

    contenedorEtiquetas.innerHTML = "";

    etiquetas.forEach((etiqueta) => {
      const boton = document.createElement("button");
      boton.classList.add("btn-etiqueta");

      boton.textContent = `# ${etiqueta.nombre}`;

      boton.addEventListener("click", () => {
        buscarVersiculos(etiqueta.nombre);
        menuLateral.classList.remove("activo");
      });

      contenedorEtiquetas.appendChild(boton);
    });
  } catch (error) {
    console.error("Error al cargar el menú:", error);
  }
}

// 4. Busqueda de versiculos
async function buscarVersiculos(emocion) {
  contenedorResultados.innerHTML = "";

  // Mostrar el mensaje de carga
  contenedorResultados.innerHTML =
    '<p class="mensaje-bienvenida">Buscando en la Biblia...</p>';

  try {
    const respuesta = await fetch(`/api/buscar/${emocion}`);
    const datos = await respuesta.json();

    contenedorResultados.innerHTML = "";

    if (!respuesta.ok) {
      contenedorResultados.innerHTML = `<p class="mensaje-bienvenida">${datos.mensaje}</p>`;
      return;
    }

    datos.forEach((versiculo) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("tarjeta-versiculo");

      tarjeta.innerHTML = `
                <span class="cita-biblica">${versiculo.libro} ${versiculo.capitulo}:${versiculo.numero_versiculo} (NVI)</span>
                <p class="texto-versiculo">"${versiculo.texto}"</p>
            `;

      contenedorResultados.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error al buscar:", error);
    contenedorResultados.innerHTML =
      '<p class="mensaje-bienvenida">Hubo un problema de conexión.</p>';
  }
}

// 5. ENCENDIDO INICIAL
cargarEtiquetas();

// 6. Logica del buscador central estilo IA
function interpretarEmocion(frase) {
  // Pasar a minúsculas para facilitar la comparación
  let texto = frase.toLowerCase();

  // Filtros de inteligencia artificial casera
  if (
    texto.includes("ansios") ||
    texto.includes("ansiedad") ||
    texto.includes("preocupad")
  )
    return "Ansiedad";
  if (
    texto.includes("miedo") ||
    texto.includes("asustad") ||
    texto.includes("temor") ||
    texto.includes("panico")
  )
    return "Miedo";
  if (
    texto.includes("paz") ||
    texto.includes("tranquil") ||
    texto.includes("calma")
  )
    return "Paz";
  if (
    texto.includes("triste") ||
    texto.includes("deprimid") ||
    texto.includes("llorar") ||
    texto.includes("mal")
  )
    return "Tristeza";
  if (
    texto.includes("cansad") ||
    texto.includes("agotad") ||
    texto.includes("estresad") ||
    texto.includes("sin fuerzas")
  )
    return "Cansancio";
  if (
    texto.includes("enojad") ||
    texto.includes("rabia") ||
    texto.includes("ira") ||
    texto.includes("furia")
  )
    return "Enojo";

  // Si no encuentra coincidencia en el diccionario se devuelve la primera palabra con mayúscula inicial por defecto
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function procesarBusqueda() {
  let fraseEscrita = inputBusqueda.value.trim();

  if (fraseEscrita === "") return;

  // Pasamos la frase del usuario por nuestro "cerebro" traductor
  let emocionOficial = interpretarEmocion(fraseEscrita);

  buscarVersiculos(emocionOficial);
  inputBusqueda.value = ""; // Limpiamos la barra
}

btnBuscar.addEventListener("click", procesarBusqueda);

inputBusqueda.addEventListener("keypress", (evento) => {
  if (evento.key === "Enter") {
    procesarBusqueda();
  }
});
