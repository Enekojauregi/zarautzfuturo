
const propuestas = [
  { id: "empleo", nombre: "Empleo verde" },
  { id: "energia", nombre: "Hogares eficientes" },
  { id: "igualdad", nombre: "Igualdad de oportunidades" },
  { id: "medioambiente", nombre: "Municipio sostenible" }
];

const CLAVE = "votos-zarautz-uf3";

const formulario = document.querySelector("#formulario");
const mensaje = document.querySelector("#mensaje");
const grafico = document.querySelector("#grafico");
const total = document.querySelector("#total");

function leerVotos() {
  try {
    const votos = JSON.parse(localStorage.getItem(CLAVE) || "[]");
    return Array.isArray(votos)
      ? votos.filter(id => propuestas.some(p => p.id === id))
      : [];
  } catch {
    return [];
  }
}

function mostrarResultados() {
  const votos = leerVotos();

  total.textContent =
    `${votos.length} ${votos.length === 1 ? "voto" : "votos"}`;

  grafico.innerHTML = "";

  propuestas.forEach(propuesta => {
    const cantidad = votos.filter(
      voto => voto === propuesta.id
    ).length;

    const porcentaje = votos.length
      ? Math.round(cantidad / votos.length * 100)
      : 0;

    const fila = document.createElement("div");
    fila.className = "fila";

    const titulo = document.createElement("div");
    titulo.className = "fila-titulo";

    const nombre = document.createElement("span");
    nombre.textContent = propuesta.nombre;

    const cifra = document.createElement("span");
    cifra.textContent = `${cantidad} (${porcentaje}%)`;

    titulo.append(nombre, cifra);

    const barra = document.createElement("div");
    barra.className = "barra";

    const relleno = document.createElement("div");
    relleno.className = "relleno";
    relleno.style.width = `${porcentaje}%`;

    barra.appendChild(relleno);
    fila.append(titulo, barra);
    grafico.appendChild(fila);
  });
}

formulario.addEventListener("submit", event => {
  event.preventDefault();

  const datos = new FormData(formulario);
  const propuesta = datos.get("propuesta");

  if (!propuesta) {
    mensaje.textContent = "Selecciona una propuesta.";
    return;
  }

  const votos = leerVotos();
  votos.push(propuesta);

  try {
    localStorage.setItem(CLAVE, JSON.stringify(votos));
    mostrarResultados();
    formulario.reset();
    mensaje.textContent = "¡Gracias! Tu voto se ha registrado en este navegador.";
  } catch {
    mensaje.textContent = "No se ha podido guardar el voto en este navegador.";
  }
});

document.querySelectorAll(".elegir").forEach(boton => {
  boton.addEventListener("click", () => {
    const radio = formulario.querySelector(
      `input[value="${boton.dataset.voto}"]`
    );

    if (radio) {
      radio.checked = true;
      document.querySelector("#vota").scrollIntoView({
        behavior: "smooth"
      });
      mensaje.textContent = "Propuesta seleccionada. Pulsa Enviar mi voto.";
    }
  });
});

document.querySelector("#reiniciar").addEventListener("click", () => {
  if (confirm("¿Quieres borrar los votos de este navegador?")) {
    localStorage.removeItem(CLAVE);
    mostrarResultados();
    mensaje.textContent = "Resultados reiniciados.";
  }
});

mostrarResultados();
