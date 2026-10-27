
const preguntas = [
  ["¿Qué ayudaría más a la juventud?", ["Más empleo local", "Vivienda asequible", "Más actividades", "Mejor transporte"]],
  ["¿Es importante crear empleo verde?", ["Muchísimo", "Bastante", "Poco", "Nada"]],
  ["¿Harías un curso de sostenibilidad?", ["Sí", "Quizá", "No lo sé", "No"]],
  ["¿Qué sector verde te interesa?", ["Energías renovables", "Reciclaje", "Movilidad sostenible", "Naturaleza"]],
  ["¿Hay igualdad de oportunidades laborales?", ["Sí", "No", "Depende", "No lo sé"]],
  ["¿Qué mejoraría la igualdad de género?", ["Educación", "Conciliación", "Prevenir discriminación", "Más representación"]],
  ["¿Hay que repartir mejor las tareas de cuidados?", ["Totalmente", "Bastante", "Poco", "No lo sé"]],
  ["¿Te preocupa el precio de la energía?", ["Mucho", "Bastante", "Poco", "Nada"]],
  ["¿Qué medida energética priorizarías?", ["Aislar viviendas", "Placas solares", "Ayudas a familias", "Iluminación eficiente"]],
  ["¿Recicláis en casa?", ["Siempre", "Casi siempre", "A veces", "Casi nunca"]],
  ["¿Cómo te desplazas por Zarautz?", ["A pie o bici", "Transporte público", "Coche", "Varios medios"]],
  ["¿Qué reduciría el uso del coche?", ["Carriles bici", "Mejor transporte público", "Zonas peatonales", "Compartir coche"]],
  ["¿Hay suficientes zonas verdes?", ["Sí", "Más o menos", "No", "No lo sé"]],
  ["¿Cómo protegerías la costa?", ["Menos plásticos", "Educación ambiental", "Cuidar las dunas", "Todas las anteriores"]],
  ["¿Te preocupa el cambio climático?", ["Mucho", "Bastante", "Poco", "Nada"]],
  ["¿Qué haría más sostenible el comercio?", ["Menos envases", "Productos locales", "Ahorrar energía", "Reutilizar"]],
  ["¿Debe el ayuntamiento escuchar a la ciudadanía?", ["Sí, siempre", "Bastante", "Poco", "No es prioritario"]],
  ["¿Participarías en actividades sostenibles?", ["Sí", "Tal vez", "Si tengo tiempo", "No"]],
  ["¿Cuál es el reto más urgente?", ["Empleo", "Energía y vivienda", "Igualdad", "Medioambiente"]],
  ["¿Qué proyecto elegirías primero?", ["Empleo verde", "Hogares eficientes", "Igualdad", "Movilidad sostenible"]]
];

const proyectos = [
  "Escuela de empleo verde",
  "Hogares eficientes",
  "Plan de igualdad",
  "Movilidad y medioambiente"
];

// Resultados inventados para demostrar el gráfico.
// No representan una encuesta real.
const datosIniciales = [28, 35, 19, 38];

let numero = 0;
let respuestas = [];

function empezar() {
  numero = 0;
  respuestas = [];
  mostrarPregunta();
  document.getElementById("encuesta").scrollIntoView();
}

function mostrarPregunta() {
  const p = preguntas[numero];
  document.getElementById("progreso").textContent =
    `Pregunta ${numero + 1} de ${preguntas.length}`;

  document.getElementById("pregunta").innerHTML = `
    <h3>${p[0]}</h3>
    ${p[1].map((opcion, i) => `
      <label class="opcion">
        <input type="radio" name="respuesta" value="${i}">
        ${opcion}
      </label>
    `).join("")}
    <br>
    ${numero > 0 ? '<button onclick="anterior()">← Anterior</button>' : ""}
    ${numero < preguntas.length - 1
      ? '<button onclick="siguiente()">Siguiente →</button>'
      : '<button onclick="enviar()">Enviar respuestas ✓</button>'}
  `;
}

function guardarRespuesta() {
  const seleccion = document.querySelector('input[name="respuesta"]:checked');
  if (!seleccion) {
    alert("Selecciona una respuesta para continuar.");
    return false;
  }
  respuestas[numero] = Number(seleccion.value);
  return true;
}

function siguiente() {
  if (!guardarRespuesta()) return;
  numero++;
  mostrarPregunta();
}

function anterior() {
  numero--;
  mostrarPregunta();
  const guardada = respuestas[numero];
  if (guardada !== undefined) {
    const radio = document.querySelector(
      `input[name="respuesta"][value="${guardada}"]`
    );
    if (radio) radio.checked = true;
  }
}

function enviar() {
  if (!guardarRespuesta()) return;

  let envios = [];
  try {
    envios = JSON.parse(localStorage.getItem("votosZarautz") || "[]");
  } catch {
    envios = [];
  }

  envios.push(respuestas);
  localStorage.setItem("votosZarautz", JSON.stringify(envios));

  document.getElementById("pregunta").innerHTML = `
    <h3>¡Gracias por participar! 🎉</h3>
    <p>Tu encuesta se ha guardado en este navegador.</p>
    <button onclick="empezar()">Responder otra vez</button>
    <button onclick="verResultados()">Ver resultados →</button>
  `;

  dibujarGrafico();
}

function verResultados() {
  document.getElementById("resultados").scrollIntoView();
}

function dibujarGrafico() {
  let envios = [];
  try {
    envios = JSON.parse(localStorage.getItem("votosZarautz") || "[]");
  } catch {
    envios = [];
  }

  const datos = [...datosIniciales];

  // La pregunta 20 permite elegir uno de los cuatro proyectos.
  envios.forEach(respuesta => {
    const eleccion = respuesta[19];
    if (Number.isInteger(eleccion) && eleccion >= 0 && eleccion < 4) {
      datos[eleccion]++;
    }
  });

  const total = datos.reduce((a, b) => a + b, 0);
  const maximo = Math.max(...datos);

  document.getElementById("grafico").innerHTML = `
    <p><strong>${120 + envios.length} respuestas mostradas</strong></p>
    ${proyectos.map((proyecto, i) => `
      <div class="fila">
        <div class="fila-titulo">
          <strong>${proyecto}</strong>
          <span>${Math.round(datos[i] / total * 100)}% (${datos[i]})</span>
        </div>
        <div class="barra-fondo">
          <div class="barra" style="width:${datos[i] / maximo * 100}%"></div>
        </div>
      </div>
    `).join("")}
    <p class="aviso">Incluye datos iniciales simulados y respuestas de este navegador.</p>
  `;
}

dibujarGrafico();
