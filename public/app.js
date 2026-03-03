// Seleccion de elementos HTML
const btnMenu = document.getElementById("btn-menu");
const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const contenedorEtiquetas = document.getElementById("contenedor-etiquetas");
const contenedorResultados = document.getElementById("contenedor-resultados");

// Gancho del buscador
const inputBusqueda = document.getElementById("input-busqueda");
const btnBuscar = document.getElementById("btn-buscar");

// Abrir y cerrar el menu
btnMenu.addEventListener("click", () => {
  menuLateral.classList.add("activo");
});

btnCerrarMenu.addEventListener("click", () => {
  menuLateral.classList.remove("activo");
});

// Carga de menu dinamico
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

// Busqueda de versiculos
async function buscarVersiculos(emocion) {
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
                <span class="cita-biblica">${versiculo.libro} ${versiculo.capitulo}:${versiculo.numero_versiculo}</span>
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

// Función que lee lo que el usuario escribió y lo prepara
function procesarBusqueda() {
  let emocionEscrita = inputBusqueda.value.trim();

  if (emocionEscrita === "") {
    return;
  }

  let emocionCorregida =
    emocionEscrita.charAt(0).toUpperCase() +
    emocionEscrita.slice(1).toLowerCase();

  buscarVersiculos(emocionCorregida);

  inputBusqueda.value = "";
}

// Escuchar cuando el usuario hace CLIC en el botón "Buscar"
btnBuscar.addEventListener("click", procesarBusqueda);

// Escuchar cuando el usuario presiona la tecla ENTER en su teclado
inputBusqueda.addEventListener("keypress", (evento) => {
  if (evento.key === "Enter") {
    procesarBusqueda();
  }
});
