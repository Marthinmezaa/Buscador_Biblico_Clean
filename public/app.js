/**
 * BUSCADOR BÍBLICO - LÓGICA DE CLIENTE (FRONTEND)
 * Maneja la interfaz de usuario, eventos del DOM y peticiones a la API.
 */

// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const btnMenu = document.getElementById("btn-menu");
const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const contenedorEtiquetas = document.getElementById("contenedor-etiquetas");
const contenedorResultados = document.getElementById("contenedor-resultados");
const indicadorBusqueda = document.getElementById("indicador-busqueda");

const inputBusqueda = document.getElementById("input-busqueda");
const btnBuscar = document.getElementById("btn-buscar");

// ==========================================
// 2. CONTROL DEL MENÚ LATERAL
// ==========================================
btnMenu.addEventListener("click", () => menuLateral.classList.add("activo"));
btnCerrarMenu.addEventListener("click", () =>
  menuLateral.classList.remove("activo"),
);

// ==========================================
// 3. CARGA DE MENÚ DINÁMICO (Acordeón Anidado)
// ==========================================
async function cargarEtiquetas() {
  try {
    const respuesta = await fetch("/api/etiquetas");
    const etiquetas = await respuesta.json();

    contenedorEtiquetas.innerHTML = "";

    // --- NIVEL 1: Botón Principal "Atajos Emocionales" ---
    const btnAtajos = document.createElement("button");
    btnAtajos.textContent = "Atajos Emocionales ▾";
    btnAtajos.classList.add("btn-acordeon-principal");
    contenedorEtiquetas.appendChild(btnAtajos);

    // Contenedor que guardará las categorías (Oculto por defecto)
    const panelCategorias = document.createElement("div");
    panelCategorias.classList.add("panel-oculto");
    contenedorEtiquetas.appendChild(panelCategorias);

    // Lógica para abrir/cerrar "Atajos Emocionales"
    btnAtajos.addEventListener("click", () => {
      btnAtajos.classList.toggle("activo");
      panelCategorias.style.display =
        panelCategorias.style.display === "block" ? "none" : "block";
    });

    // --- NIVEL 2: Las Categorías (Positivos, Neutros, Negativos) ---
    const ordenCategorias = ["Positivos", "Neutros", "Negativos"];

    ordenCategorias.forEach((nombreCat) => {
      const etiquetasDeEstaCat = etiquetas.filter(
        (e) => e.categoria === nombreCat,
      );

      if (etiquetasDeEstaCat.length > 0) {
        // Botón de la Categoría
        const btnCategoria = document.createElement("button");
        btnCategoria.textContent = `${nombreCat} ▾`;
        btnCategoria.classList.add("btn-acordeon-secundario");
        panelCategorias.appendChild(btnCategoria);

        // Contenedor de las etiquetas finales (Oculto por defecto)
        const panelEtiquetas = document.createElement("div");
        panelEtiquetas.classList.add("panel-oculto", "panel-etiquetas");
        panelCategorias.appendChild(panelEtiquetas);

        // Lógica para abrir/cerrar la Categoría
        btnCategoria.addEventListener("click", () => {
          btnCategoria.classList.toggle("activo");
          panelEtiquetas.style.display =
            panelEtiquetas.style.display === "block" ? "none" : "block";
        });

        // --- NIVEL 3: Los hashtags clickeables ---
        etiquetasDeEstaCat.forEach((etiqueta) => {
          const boton = document.createElement("button");
          boton.classList.add("btn-etiqueta");
          boton.textContent = `#${etiqueta.nombre}`;

          boton.addEventListener("click", () => {
            buscarVersiculos(etiqueta.nombre);
            menuLateral.classList.remove("activo"); // Cierra el menú al buscar
          });

          panelEtiquetas.appendChild(boton);
        });
      }
    });
  } catch (error) {
    console.error("Error al cargar el menú dinámico:", error);
  }
}

// ==========================================
// 4. BÚSQUEDA Y RENDERIZADO DE VERSÍCULOS
// ==========================================
async function buscarVersiculos(emocion) {
  // Estado de carga visual
  contenedorResultados.innerHTML =
    '<p class="mensaje-bienvenida">Buscando en la Biblia...</p>';

  indicadorBusqueda.innerHTML = `Última búsqueda: <strong>"${emocion}"</strong>`;

  try {
    const respuesta = await fetch(`/api/buscar/${encodeURIComponent(emocion)}`);
    const datos = await respuesta.json();

    contenedorResultados.innerHTML = "";

    // Manejo de errores desde el servidor (ej: emoción no encontrada)
    if (!respuesta.ok) {
      contenedorResultados.innerHTML = `<p class="mensaje-bienvenida">${datos.mensaje}</p>`;
      return;
    }

    // Renderizado de tarjetas de versículos
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
    console.error("Error en la petición de búsqueda:", error);
    contenedorResultados.innerHTML =
      '<p class="mensaje-bienvenida">Hubo un problema de conexión con el servidor.</p>';
  }
}

// ==========================================
// 5. MOTOR DE BÚSQUEDA
// ==========================================
function procesarBusqueda() {
  let fraseEscrita = inputBusqueda.value.trim();
  if (fraseEscrita === "") return;

  buscarVersiculos(fraseEscrita);

  inputBusqueda.value = "";
}

// Listeners del buscador central
btnBuscar.addEventListener("click", procesarBusqueda);
inputBusqueda.addEventListener("keypress", (evento) => {
  if (evento.key === "Enter") procesarBusqueda();
});

// ==========================================
// 6. INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
cargarEtiquetas();
