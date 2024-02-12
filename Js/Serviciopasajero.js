import { AsignarFechaActual, urlGlobal } from "./Globales.js"
const url = urlGlobal;
const tbodyPasajeros = document.querySelector("tbody");
const formProveedores = document.querySelector("form");
const btnMostrarPasajerosTodos = document.getElementById("btnMostrarPasajerosTodos");
const IngresoServicio = document.getElementById("IngresoServicio");
const btnIngresarPasajero = document.getElementById("btnIngresarPasajero");
const btCancelarIngresoPax = document.getElementById("btCancelarIngresoPax");
const BuscarPasajero = document.getElementById("BuscarPasajero");
let fechaservicio = document.getElementById("fechaservicio");
let titulo = document.getElementById("titulo");

//VARIABLES GLOBALES
let ArrayPasajerosExistentes = [];

fechaservicio.value = AsignarFechaActual();

btnCreaServicio.addEventListener("click", () => {
  MostrarServicio.style.display = "block"
  btnCreaServicio.style.display = "none"
  ComboComunas(0);
});

BuscarPasajero.addEventListener("input", (e) => {
  MostrarMostrarPasajeros(e.target.value.toUpperCase().trim());
});

btCancelarServicio.addEventListener("click", () => {
  MostrarServicio.style.display = "none"
  btnCreaServicio.style.display = "block"
});

btnMostrarPasajerosTodos.addEventListener("click", () => {
  IngresoPasajero.style.display = "none"
  MostrarServicio.style.display = "none"
  MostrarPasajerosTodos.style.display = "block"
  cabecera.style.display = "none"
  titulo.innerHTML = "PASAJEROS"
  MostrarPasajeros()
});

btCancelarIngresoPax.addEventListener("click", () => {
  IngresoPasajero.style.display = "none"
  MostrarServicio.style.display = "block"
  cabecera.style.display = "block"
  titulo.innerHTML = "MANTENEDOR SERVICIOS"
});

btnIngresarPasajero.addEventListener("click", () => {
  MostrarPasajerosTodos.style.display = "none"
  IngresoPasajero.style.display = "block"
  MostrarServicio.style.display = "none"
});



// btnSalir.addEventListener('click', () => {
//   window.history.back();
// })

function ComboComunas(cod) {
  fetch(url + "comunas")
    .then((response) => response.json())
    .then((data) => ComboComunasDos(data, cod))
    .catch((error) => console.log(error));
}

function ComboComunasDos(comunas, cod) {
  selectcomuna.innerHTML = "";
  comunas.forEach((item) => {
    if (item.codcomuna == cod) {
      selectcomuna.innerHTML += `<option selected value=${item.codcomuna}>${item.nombre}</option>`;
    } else {
      selectcomuna.innerHTML += `<option value=${item.codcomuna}>${item.nombre}</option>`;
    }
  });
}

// function MostrarPasajeros() {
//   fetch(url + "pasajeros")
//     .then((response) => response.json())
//     .then((data) =>
//       LlenaArrayPaxExistentes(data))
//     .catch((error) => console.log(error));
// }

const MostrarPasajeros = async () => {
  try {
    const response = await fetch("http://localhost:3000/pasajeros")
    const data = await response.json();
    LlenaArrayPaxExistentes(data)
  } catch (error) {
    alert(error);
  }
}

function LlenaArrayPaxExistentes(data) {
  for (let i = 0; i < data.length; i++) {
    AgregarPasajerosExistente(
      data[i].id,
      data[i].nombre,
      data[i].direccion,
      data[i].codcomuna,
      data[i].celular
    );
  }
  console.log(data);
  MostrarPasajerosDos(ArrayPasajerosExistentes);
}

function AgregarPasajerosExistente(id, nombre, direccion, codcomuna, celular) {
  let nuevo = {
    id: id,
    nombre: nombre,
    direccion: direccion,
    codcomuna: codcomuna,
    celular: celular,
  };
  ArrayPasajerosExistentes.push(nuevo);
}

const MostrarPasajerosDos = (data) => {
  let resultados = "";
  data.forEach((item) => {
    resultados +=
      `<tr>
        <td><div style="display:flex;justify-content: space-between;font-size: 20px;">
              <div>
                <input type="checkbox" id="SumaPasajero"></input>
                ${item.nombre}
              </div>
              <div>
                ${item.celular}
              </div>
            </div>
        </td>
        <td class="d-none">${item.id}</td>
        <td class="d-none">${item.nombre}</td>
        <td class="d-none">${item.direccion}</td>
        <td class="d-none">${item.codcomuna}</td>
        <td class="d-none">${item.celular}</td>
      </tr>`;
  });
  tbodyPasajeros.innerHTML = resultados;
};

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

function MostrarMostrarPasajeros(valor) {
  const mostrarFiltrado = ArrayPasajerosExistentes.filter((pasajero) =>
    pasajero.nombre.toUpperCase().startsWith(valor)
  );
  MostrarPasajerosDos(mostrarFiltrado);
}