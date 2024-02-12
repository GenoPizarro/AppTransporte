//VARIABLES GLOBALES
//let dataTable;

let dataTableIsInitialized = false;
let dataTableIsInitialized2 = false;
let ArrayPasajerosExistentes = [];
let ArrayPasajerosViajan = [];
let ArregloAux = [];
let desde = 0;
let npax = 0;
let limite = 5;
let paginas = 0;
let paginaActiva = 1;

const TablaExisten = document.getElementById("TablaExisten");
const tbody_existen = document.getElementById("tbody_existen");
const TablaViajan = document.getElementById("TablaViajan");
const tbody_viajan = document.getElementById("tbody_viajan");
const navtablaviajan = document.getElementById("navtablaviajan");
const numeropax = document.getElementById("numeropax");
//const IdConfirmaAsignacionPax = document.getElementById("IdConfirmaAsignacionPax");

//***********************************************************************/
// INICIO DE ESTA PAGINA
//***********************************************************************/

window.addEventListener('load', async () => {
  await initDataTableExisten();
  //await initDataTableViajan();
});

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

//***********************************************************************/
// BOTONES BOTONES BOTONES BOTONES BOTONES BOTONES 
//***********************************************************************/

on(document, "click", "#btnSuma", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode;
  let indice = 0;
  let id = fila.children[3].innerHTML;
  let nombre = fila.children[4].innerHTML;
  let celular = fila.children[5].innerHTML;
  let direccion = fila.children[6].innerHTML;
  let comuna = fila.children[7].innerHTML;
  const pax = ArregloAux.find((pasajeros) => pasajeros.id === id);
  if (pax == undefined) {
    if (npax === 0) {
      navtablaviajan.style.display = "block"
      IdConfirmaAsignacionPax.style.display = "block"
    }
    npax = npax + 1;
    indice = npax;
    //AgregarPasajerosViajan(id,nombre,celular,direccion,comuna)
    AgregarPasajerosAux(id, nombre, celular, direccion, comuna, indice)
    //info = ArrayPasajerosViajan();
    MostrarPasajerosViajan();
    //console.log(ArregloAux)
  }
});

on(document, "click", "#btnResta", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode;
  console.log(fila.children);
  let indice = fila.children[2].innerHTML;
  const index = ArregloAux.findIndex((pasajeros) => pasajeros.id === indice);
  ArregloAux.splice(index, 1); // Pasajero se RESTA del ARRAY
  npax = npax - 1;
  if (npax === 0) {
    navtablaviajan.style.display = "none"
    btnasignarpax.style.display = "none"
  }else{
    MostrarPasajerosViajan();
  }
});

on(document, "click", "#ChkSiNo", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode;
  let indice = fila.children[3].innerHTML;
  const index = ArregloAux.findIndex((pasajeros) => pasajeros.id === indice);
  alert(index) // Pasajero se RESTA del ARRAY
  // const fila = e.target.parentNode.parentNode;
  // let indice = fila.children[3].innerHTML;
  // const index = ArregloAux.findIndex((pasajeros) => pasajeros.id === indice);
  // ArregloAux.splice(index, 1); // Pasajero se RESTA del ARRAY
  // npax = npax - 1;
  // if (npax === 0) {
  //   divtablaviajan.style.display = "none"
  //   btnasignarpax.style.display = "none"
  // }else{
  //   MostrarPasajerosViajan();
  // }
});

//********************************************************************************//
//************************    TABLA EXISTEN     **********************************//
//********************************************************************************//
const TraerPasajerosExistentes = async () => {
  try {
    const response = await fetch("http://localhost:3000/pasajeros")
    const data = await response.json();
    LlenaArrayPaxExistentes(data)
  } catch (error) {
    alert(error);
  }
}

let dataTableExisten = {
  pageLength: 5,
  destroy: true,
  dom: 'Bfrtip',
  buttons: [
    //'copy', 'csv', 'excel', 'pdf'
    '', '', '', ''
  ],
  language: {
    search: 'Buscar:',
    //infoThousands: ',',
    //infoEmpty: '',
    infoFiltered: '',
    //loadingRecords: 'Cargando...',
    paginate: {
      next: '>>',
      previous: '<<',
    },
    info: '',
  },
};

const initDataTableExisten = async () => {
  let dataTable;
  if (dataTableIsInitialized) {
    dataTable.destroy();
  }
  await TraerPasajerosExistentes();
  dataTable = $('#TablaExisten').DataTable(dataTableExisten);
  dataTableIsInitialized = true;
};

function LlenaArrayPaxExistentes(data) {
  for (let i = 0; i < data.length; i++) {
    AgregarPasajerosExistente(
      data[i].id,
      data[i].nombre,
      data[i].celular,
      data[i].direccion,
      data[i].nomcomuna,
    );
  }
  MostrarPasajerosExistentes(ArrayPasajerosExistentes);
}

function AgregarPasajerosExistente(id, nombre, celular, direccion, comuna) {
  let nuevo = {
    id: id,
    nombre: nombre,
    celular: celular,
    direccion: direccion,
    comuna: comuna,
  };
  ArrayPasajerosExistentes.push(nuevo);
}

const MostrarPasajerosExistentes = (data) => {
  try {
    let resultados = '';
    let indice = 0;
    data.forEach((item) => {
      resultados += `
          <tr>
              <td class="text-center">
                  <a id="btnSuma" class ="btn">+</a>
              </td>
              <td> ${item.nombre}</td>
              <td> ${item.celular}</td>
              <td style="display: none"> ${item.id} </td>
              <td style="display: none"> ${item.nombre} </td>
              <td style="display: none"> ${item.celular} </td>
              <td style="display: none"> ${item.direccion} </td>
              <td style="display: none"> ${item.comuna} </td>
              <td style="display: none"> ${indice} </td>
          </tr>`;
      indice = indice + 1;
    });
    tbody_existen.innerHTML = resultados;
  } catch (error) {
    alert(error);
  }
};

// function AgregarPasajerosViajan(id, nombre, celular, direccion, comuna) {
//   let nuevo = {
//     id: id,
//     nombre: nombre,
//     celular: celular,
//     direccion: direccion,
//     comuna: comuna,
//   };
//   ArrayPasajerosViajan.push(nuevo);
// }

function AgregarPasajerosAux(id, nombre, celular, direccion, comuna) {
  let nuevo = {
    id: id,
    nombre: nombre,
    celular: celular,
    direccion: direccion,
    comuna: comuna,
  };
  ArregloAux.push(nuevo);
}

// const MostrarPasajerosViajanDos = () => {
//   tbody_viajan.innerHTML = "";
//   let ArrayPasajerosViajan = ArregloAux.slice(desde, limite * paginaActiva);
//   ArrayPasajerosViajan.map((pax) => {
//     const fila = document.createElement("tr");
//     const contenido = `
//     <td class="text-center">
//                   <a id="btnResta" class ="btn">-</a>
//               </td>
//     <td>${pax.nombre}</td>
//     <td>${pax.celular}</td>
//     <td style="display:none;">${pax.id}</td>`;
//     fila.innerHTML = contenido;
//     tbody_viajan.append(fila);
//     numeropax.innerHTML = npax;
//   });
//   cargarItemPaginacion();
// };


const MostrarPasajerosViajan = () => {
  tbody_viajan.innerHTML = "";
  let ArrayPasajerosViajan = ArregloAux.slice(desde, limite * paginaActiva);
  console.log(ArrayPasajerosViajan);
  //ArrayPasajerosViajan.map((pax) => {
    //const fila = document.createElement("tr");
    // const contenido = `
    //     <td class="text-center">
    //               <a id="btnResta" class="btn">-</a>
    //               <input type="checkbox" id="ChkSiNo"></input>
    //     </td>
    //     <td>
    //           <div style="display:flex;justify-content: space-between;">
    //             <div> ${pax.nombre} </div>
    //             <div> ${pax.celular} </div>
    //           </div>
    //           <div style="display:flex;justify-content: space-between;color:red">
    //             <div style="font-size:14px;"> ${pax.direccion} </div>
    //             <div> ${pax.comuna} </div>
    //           </div>
    //     </td>
    // <td style="display:none;">${pax.id}</td>`;
    // fila.innerHTML = contenido;
    // tbody_viajan.append(fila);
    // numeropax.innerHTML = npax;
  //});
  //cargarItemPaginacion();
};

const cargarItemPaginacion = () => {
  if (ArregloAux.length > 5) {
    paginas = ArregloAux.length / limite;
  } else {
    paginas = 1;
  }
  document.querySelector("#items").innerHTML = "";
  for (let index = 0; index < paginas; index++) {
    const item = document.createElement("li");
    item.classList = `page-item ${paginaActiva == index + 1 ? "active" : ""}`;
    const enlace = `<button class="page-link" onclick="pasarPagina(${index})">${index + 1
      }</button>`;
    item.innerHTML = enlace;
    document.querySelector("#items").append(item);
  }
};

const modificarArregloProductos = () => {
  ArrayPasajerosViajan = ArregloAux.slice(desde, limite * paginaActiva);
  MostrarPasajerosViajan();
};

window.pasarPagina = (pagina) => {
  paginaActiva = pagina + 1;
  desde = limite * pagina; //5
  if (desde <= ArregloAux.length) {
    modificarArregloProductos();
  }
};

window.nextPage = () => {
  if (paginaActiva < paginas) {
    desde += 5;
    paginaActiva++;
    modificarArregloProductos();
  }
};

window.previusPage = () => {
  if (desde > 0) {
    paginaActiva--;
    desde -= 5;
    modificarArregloProductos();
  }
};

//MostrarPasajerosViajan();