//const urlG = "http://192.168.1.4:3000/";
import { on,urlG } from "./Globales.js"
import { TraerPasajerosExistentes, TraeEmpresa, TraeConductor, AsignarFechaActual } from "./Globales.js"
import { TraerServiciosListos, TraerServicioValor, TraerServicioPasajeros, dataTableExisten, dataTableServiciosListos } from "./Globales.js"
import { ComboConductores, ComboEmpresa, MostrarPaneles, MostrarBotones } from "./Globales.js"

//PANELES PANELES PANELES
const PanelCabeceraFija = document.getElementById("PanelCabeceraFija");
const PanelCabeceraVariable = document.getElementById("PanelCabeceraVariable");
const PanelIngresoServicioAbajo = document.getElementById("PanelIngresoServicioAbajo");
const PanelPasajerosExistentes = document.getElementById("PanelPasajerosExistentes");
const PanelPasajerosViajan = document.getElementById("PanelPasajerosViajan");
const PanelServiciosListos = document.getElementById("PanelServiciosListos");

//BOTONES BOTONES BOTONES
const BtnNuevoServicio = document.getElementById("BtnNuevoServicio");
const BtnPanelAsignarpasajeros = document.getElementById("BtnPanelAsignarpasajeros");
const BtnGrabarServicio = document.getElementById("BtnGrabarServicio");
const BtnCancelarServicio = document.getElementById("BtnCancelarServicio");
const BtnConfirmaAsignacionPax = document.getElementById("BtnConfirmaAsignacionPax");
const BtnCancelaAsignacionPax = document.getElementById("BtnCancelaAsignacionPax");
const BtnEnviarWatsapp = document.getElementById('BtnEnviarWatsapp');
const BtnModalAceptaSalir = document.getElementById("BtnModalAceptaSalir");
const BtnModalCancelaSalir = document.getElementById("BtnModalCancelaSalir");

//SELECT SELECT SELECT
const selecttipo = document.getElementById("selecttipo");
const selectempresa = document.getElementById("selectempresa");
const selectconductor = document.getElementById("selectconductor");
const SelectMeses = document.getElementById("SelectMeses");
const SelectDias = document.getElementById("SelectDias");

//TABLAS TABLAS TABLAS
const tbody_existen = document.getElementById("tbody_existen");
const tbody_viajan = document.getElementById("tbody_viajan");
const tbody_servicioslistos = document.getElementById("tbody_servicioslistos");

//INPUT INPUT INPUT 
const inputcantidadpax = document.getElementById('inputcantidadpax');
const inputvalorservicio = document.getElementById('inputvalorservicio');
const inputhorainicio = document.getElementById("inputhorainicio");
const inputhoratermino = document.getElementById("inputhoratermino");
const inputkilometros = document.getElementById("inputkilometros");
const inputobservacion = document.getElementById("inputobservacion");

//OTROS OTROS OTROS
let OrigenDestinoUno = document.getElementById("OrigenDestinoUno");
let OrigenDestinoDos = document.getElementById("OrigenDestinoDos");
const numeropax = document.getElementById("numeropax");
const FechaActual = document.getElementById("FechaActual");
const CantidadyValorServicios = document.getElementById("CantidadyValorServicios");
const titulo = document.getElementById("titulo");
let mensageWatsapp = document.getElementById('mensageWatsapp');

//VARIABLES VARIABLES
let dataTableIsInitialized = false;
let ArrayPasajerosExistentes = [];
let ArrayPasajerosViajan = [];
let ArrayEmpresas = [];
let ArrayServiciosListos = [];
let ArrayServicioPasajeros = [];
let ArrayServicioValor = [];
let desde = 0;
let limite = 5;
let paginas = 0;
let ArregloAux = [];
let paginaActiva = 1;
let npax = 0;
let npaxviajan = 0;
let codservicioAux = 0;
let NuevoServicio = "N";
//---------------------------------------------------------------------------//
//          INICIO INICIO INCIO INCIO INCIO INCIO INCIO INCIO
//---------------------------------------------------------------------------//
window.addEventListener('load', async () => { await InicioSistemaServicios() });
//---------------------------------------------------------------------------//

const InicioSistemaServicios = async () => {
  let mes;
  let dataTable;
  if (dataTableIsInitialized) {
    dataTable.destroy();
  }
  LlenaArrayPaxExistentes(await TraerPasajerosExistentes("pasajeros"));
  FechaActual.innerHTML = AsignarFechaActual();
  mes = FechaActual.innerHTML.substring(3, 5)
  SelectMeses.value = parseInt(mes);
  MesesDias(mes);
  ArrayEmpresas = await TraeEmpresa("empresas");
  ComboConductores(await TraeConductor("conductor"));
  ComboEmpresa(ArrayEmpresas, "0");
  ArrayServicioValor = (await TraerServicioValor("serviciovalor"))
  LlenarServiciosLlistos(await TraerServiciosListos("servicioslistos"));
  dataTable = $('#TablaServiciosListos').DataTable(dataTableServiciosListos);
  dataTableIsInitialized = true;
};

BtnEnviarWatsapp.addEventListener('click', function () {
  let mensaje = "";
  let numero = "56957695620";
  let indice = 0;
  ArrayServiciosListos.forEach((servicio) => {
    mensaje = mensaje + servicio.fecha.substring(5, 10) + "   " + servicio.nombrecorto + "  " + servicio.nomtipo
    indice++;
  });
  mensaje = mensaje + "-----------------------";
  mensaje = mensaje + "Total Servicios: " + indice
  mensageWatsapp.value = mensaje;
  var url = "whatsapp://send?text=" + encodeURIComponent(mensageWatsapp.value) + "&phone=" + encodeURIComponent(numero)
  window.open(url);
});



//BOTONES / SELECT / CHECKBOX
selecttipo.addEventListener("change", () => {
  if (BtnPanelAsignarpasajeros.style.display == "block") {
    FuncionOrigenDestino();
  } else {
    if (parseInt(selecttipo.value) === 3) {
      MostrarServiciosListos(ArrayServiciosListos);
    } else {
      let ArrayPaso = ArrayServiciosListos.filter(servicio => servicio.codtiposervicio === parseInt(selecttipo.value))
      MostrarServiciosListos(ArrayPaso);
    }
    //let ArrayPaso = ArrayServiciosListos.filter((empresa) => empresa.codempresa === parseInt(selectempresa.value));
  }
});

function funcionGenial() {
  var variable = $("#hablame").val();
  if (document.createElement("input").webkitSpeech === undefined) {
    document.write("<p>Lo siento, tu navegador no soporta esta función.</p>");
  }
}

inputhorainicio.addEventListener("change", () => {
  let hora = parseInt(inputhorainicio.value.substring(0, 2)) + 1
  inputhoratermino.value = hora + ":" + inputhorainicio.value.substring(3, 5)
})

// inputhoratermino.addEventListener("click", () => {
// })

SelectMeses.addEventListener("change", () => {
  MesesDias(SelectMeses.value)
  let ArrayPaso = ArrayServiciosListos.filter(servicio => parseInt(servicio.fecha.substring(5, 7)) === parseInt(SelectMeses.value))
  MostrarServiciosListos(ArrayPaso);
});


function MesesDias(mes) {
  SelectDias.innerHTML = "";
  let dias;
  if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
    dias = 32
  }
  if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
    dias = 31
  }
  if (mes == 2) {
    dias = 29
  }
  CuantosDias(dias)
};

function CuantosDias(dias) {
  let dd = -1;
  if (NuevoServicio == "N") {
    dd = parseInt(FechaActual.innerHTML.substring(0, 2))
  }
  for (let i = 0; i < dias; i++) {
    if (i == dd) {
      SelectDias.innerHTML += `<option selected value=${i}>${i}</option>`;
    } else {
      SelectDias.innerHTML += `<option value=${i}>${i}</option>`;
    }
  }
}

// SelectDias.addEventListener("change", () => {
// });

function FuncionOrigenDestino() {
  if (BtnPanelAsignarpasajeros.style.display == "block") {
    if (selectempresa.value > 0) {
      if (selecttipo.value == 1 || selecttipo.value == 2) {
        const codempresa = parseInt(selectempresa.value)
        const empresa = ArrayEmpresas.find(empresa => empresa.codempresa === codempresa);
        OrigenDestinoUno.style.display = "block"
        if (selecttipo.value == 1) {
          OrigenDestinoDos.innerHTML = "DESTINO: " + empresa.direccion + ", " + empresa.nomComuna;
        } if (selecttipo.value == 2) {
          OrigenDestinoDos.innerHTML = "ORIGEN: " + empresa.direccion + ", " + empresa.nomComuna;
        }
        let ArrayEmp = ArrayServicioValor.filter((empresa) => empresa.codempresa === parseInt(selectempresa.value));
        let ArraySer = ArrayEmp.filter((servicio) => servicio.codservicio === parseInt(selecttipo.value));
        inputvalorservicio.value = ArraySer[0].valor;
      } else {
        OrigenDestinoUno.style.display = "none"
      }
    } else {
      OrigenDestinoUno.style.display = "none"
    }
  }
}

BtnNuevoServicio.addEventListener("click", () => {
  NuevoServicio = "N"
  npaxviajan = 0;
  numeropax.innerHTML = npaxviajan;
  let mes = parseInt(FechaActual.innerHTML.substring(3, 5));
  SelectMeses.value = mes
  MesesDias(mes);
  MostrarPaneles("block", "block", "block", "none", "block", "none")
  MostrarBotones("none", "block", "none", "none")
  titulo.innerHTML = "Ingresando Servicio"
  NuevoServicios();
});

async function NuevoServicios() {
  let dataTable;
  dataTable = $('#TablaExisten').DataTable(dataTableExisten);
  dataTableIsInitialized = true;
}

BtnGrabarServicio.addEventListener("click", () => {
  //MostrarBotones("block", "none", "none", "")
  if (ValidaIngreso() == "SI") {
    if (NuevoServicio == "N") {
      $('#MensajeEspera').fadeIn();
      CRUDGrabaServicio();
      $('#MensajeEspera').fadeOut();
    } else {
      CRUDModificaServicio();
    }
    MostrarPaneles("block", "block", "none", "none", "none", "block")
    LimpiarIngreso();
    //MostrarServiciosListos(ArrayServiciosListos);
  }
});

BtnCancelarServicio.addEventListener("click", () => {
  MostrarPaneles("block", "block", "none", "none", "none", "block")
  MostrarBotones("block", "none", "none", "none")
  titulo.innerHTML = "Mantenedor Servicios"
  LimpiarIngreso();
});

BtnPanelAsignarpasajeros.addEventListener("click", () => {
  MostrarPaneles("none", "none", "none", "block", "block", "none")
  console.log(parseInt(ArrayPasajerosViajan.length))
  if (parseInt(ArrayPasajerosViajan.length) > 0) {
    MostrarBotones("none", "none", "block", "block")
  } else {
    MostrarBotones("none", "none", "none", "block")
  }
});

BtnConfirmaAsignacionPax.addEventListener("click", () => {
  MostrarPaneles("block", "block", "block", "none", "block", "none")
  MostrarBotones("none", "block", "none", "none")
  MostrarPasajerosViajan("");
  inputcantidadpax.value = numeropax.innerHTML;
});

BtnCancelaAsignacionPax.addEventListener("click", () => {
  MostrarPaneles("block", "block", "block", "none", "block", "none")
  MostrarBotones("none", "block", "none", "none")
});

on(document, "click", "#btnSuma", (e) => {
  e.preventDefault();
  let indice = 0;
  const fila = e.target.parentNode.parentNode;
  let id = fila.children[3].innerHTML;
  let nombre = fila.children[4].innerHTML;
  let celular = fila.children[5].innerHTML;
  let direccion = fila.children[6].innerHTML;
  let comuna = fila.children[7].innerHTML;
  const pax = ArregloAux.find((pasajeros) => pasajeros.id === id);
  if (pax == undefined) {
    if (npax === 0) {
      PanelPasajerosViajan.style.display = "block"
      BtnConfirmaAsignacionPax.style.display = "block"
    }
    npax = npax + 1;
    npaxviajan = npaxviajan + 1;
    //console.log(npaxviajan);
    indice = npax;
    AgregarPasajerosAux(id, nombre, celular, direccion, comuna, indice)
    MostrarPasajerosViajan("");
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
  npaxviajan = npaxviajan - 1;
  // if (npax === 0) {
  //   PanelPasajerosViajan.style.display = "none"
  //   BtnConfirmaAsignacionPax.style.display = "none"
  // } else {
  MostrarPasajerosViajan("");
  // }
});

// function MostrarBotones(btNuevoSrv, btPnlAsignaPax, btConfirmaAsig, btCancelaAsig) {
//   BtnNuevoServicio.style.display = btNuevoSrv;
//   BtnPanelAsignarpasajeros.style.display = btPnlAsignaPax;
//   BtnConfirmaAsignacionPax.style.display = btConfirmaAsig;
//   BtnCancelaAsignacionPax.style.display = btCancelaAsig;
// }

function LlenarServiciosLlistos(servicios) {
  ArrayServiciosListos = servicios;
  MostrarServiciosListos(ArrayServiciosListos);
}

selectconductor.addEventListener("change", (e) => {
  console.log(selectconductor.value)
})

selectempresa.addEventListener("change", (e) => {
  let ArrayPaso = [];
  if (parseInt(selectempresa.value) === 0) {
    MostrarServiciosListos(ArrayServiciosListos)
  } else {
    ArrayPaso = ArrayServiciosListos.filter(servicio => servicio.codempresa === parseInt(selectempresa.value))
    MostrarServiciosListos(ArrayPaso)
  }
})

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

on(document, "click", ".btnEditar", async (e) => {
  NuevoServicio = "M";
  const servicio = e.target.parentNode.parentNode.parentNode; //TABLA INSUMOS...
  codservicioAux = servicio.children[4].innerHTML;
  const codempresa = servicio.children[5].innerHTML;
  const codtipo = servicio.children[7].innerHTML;
  const fecha = servicio.children[8].innerHTML;
  const cantpax = servicio.children[9].innerHTML;
  const hini = servicio.children[10].innerHTML;
  const hter = servicio.children[11].innerHTML;
  const klms = servicio.children[11].innerHTML;
  const obs = servicio.children[13].innerHTML;
  const valor = servicio.children[14].innerHTML;
  let dia = fecha.substring(9, 11);
  let mes = fecha.substring(6, 8);
  ComboEmpresa(ArrayEmpresas, codempresa);
  SelectDias.value = parseInt(dia);
  SelectMeses.value = parseInt(mes);
  selecttipo.value = parseInt(codtipo);
  inputcantidadpax.value = parseInt(cantpax);
  inputhorainicio.value = hini.trim();
  inputhoratermino.value = hter.trim();
  inputvalorservicio.value = parseInt(valor);
  inputkilometros.value = parseInt(klms);
  inputobservacion.value = obs;
  PanelIngresoServicioAbajo.style.display = "block";
  PanelPasajerosViajan.style.display = "block";
  PanelServiciosListos.style.display = "none";
  ArrayServicioPasajeros = await TraerServicioPasajeros(parseInt(codservicioAux));
  console.log(ArrayServicioPasajeros)
  MostrarPasajerosViajan("SI");

});

const MostrarServiciosListos = (data) => {
  try {
    let resultados = '';
    let indice = 0;
    let total = 0;
    let valor = 0;
    data.forEach((item) => {
      valor = formatearNumero(item.valor);
      resultados += `
          <tr style="font-size:15px;">
              <td class="text-center">
                  <a class="btnEditar"><img src="/img/editar15.png" width="30" height="30" title="Editar Servicio"></a>
              </td>
              <td>
                <div>
                  ${item.fecha.substring(0, 10)}
                </div>
                <div>
                  ${item.nomempresa}
                </div>
              </td>
              <td> ${item.nomtipo}</td>
              <td style="text-align:right;padding-right:10px;"> ${valor}</td>
              <td style="display: none"> ${item.codservicio} </td>
              <td style="display: none"> ${item.codempresa} </td>
              <td style="display: none"> ${item.codconductor} </td>
              <td style="display: none"> ${item.codtiposervicio} </td>
              <td style="display: none"> ${item.fecha} </td>
              <td style="display: none"> ${item.cantidadpax} </td>
              <td style="display: none"> ${item.horainicio} </td>
              <td style="display: none"> ${item.horatermino} </td>
              <td style="display: none"> ${item.kilometros} </td>
              <td style="display: none"> ${item.observacion} </td>
              <td style="display: none"> ${item.valor} </td>
          </tr>`;
      total = total + item.valor;
      indice = indice + 1;
    });
    totalvalorservicio.innerHTML = formatearNumero(total);
    tbody_servicioslistos.innerHTML = resultados;
    cantidadServicios.innerHTML = indice;
  } catch (error) {
    alert(error);
  }
};

function formatearNumero(numero) {
  return new Intl.NumberFormat("es-CL").format(numero);
}

const MostrarPasajerosExistentes = (data) => {
  try {
    let resultados = '';
    let indice = 0;
    data.forEach((item) => {
      resultados += `
      <tr style="margin-top:0px;">
              <td>
              <a id="btnSuma">+</a>
              </td>
              <td> ${item.nombre} </td>
              <td> ${item.celular} </td>
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

function AgregarPasajerosAux(id, nombre, celular, direccion, nomcomuna) {
  let nuevo = {
    id: id,
    nombre: nombre,
    celular: celular,
    direccion: direccion,
    nomcomuna: nomcomuna,
  };
  ArregloAux.push(nuevo);
}

const MostrarPasajerosViajan = (ok) => {
  tbody_viajan.innerHTML = "";
  let indice = 0;
  if (ok === "SI") {
    ArrayPasajerosViajan = ArrayServicioPasajeros;
  } else {
    ArrayPasajerosViajan = ArregloAux.slice(desde, limite * paginaActiva);
  }
  ArrayPasajerosViajan.map((pax) => {
    const fila = document.createElement("tr");
    const contenido = `
        <td>
            <div>
            </div>
            <a id="btnResta">-</a>
            <div>
            </div>
        </td>
        <td>
            <div style="display:flex;justify-content: space-between;">
              <div> ${pax.nombre} </div>
              <div style=""> 
              <a href="tel:+569+´${pax.celular}´" style="text-decoration: none;color:white;">${pax.celular}</a> 
              </div>
            </div>
            <div style="display:flex;justify-content: space-between;color:blue">
              <div style="font-size:14px;"> ${pax.direccion} </div>
              <div style="color:yellow;"> ${pax.nomcomuna} </div>
            </div>
        </td>
        <td style="display:none;">${pax.id}</td>`;
    fila.innerHTML = contenido;
    tbody_viajan.append(fila);
    indice = indice + 1;
  });
  if (ok === "SI") {
    npaxviajan = indice;
  }
  numeropax.innerHTML = npaxviajan;
  cargarItemPaginacion();
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
  MostrarPasajerosViajan("");
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

function ValidaIngreso() {
  let ok = "SI";
  if (inputcantidadpax.value == "") {
    inputcantidadpax.style.border = "solid 1px red";
    inputcantidadpax.focus();
    ok = "NO";
  } else {
    inputcantidadpax.style.border = "solid 1px rgb(119, 136, 153)";
  }
  if (inputhoratermino.value == "") {
    inputhoratermino.style.border = "solid 1px red";
    inputhoratermino.focus();
    ok = "NO";
  } else {
    inputhoratermino.style.border = "solid 1px rgb(119, 136, 153)";
  }
  if (inputhorainicio.value == "") {
    inputhorainicio.style.border = "solid 1px red";
    inputhorainicio.focus();
    ok = "NO";
  } else {
    inputhorainicio.style.border = "solid 1px rgb(119, 136, 153)";
  }
  if (selecttipo.value == 0) {
    selecttipo.style.border = "solid 1px red";
    selecttipo.focus();
    ok = "NO";
  } else {
    selecttipo.style.border = "solid 1px rgb(119, 136, 153)";
  }
  if (SelectDias.value == 0) {
    SelectDias.style.border = "solid 1px red";
    SelectDias.focus();
    ok = "NO";
  } else {
    SelectDias.style.border = "solid 1px rgb(119, 136, 153)";
  }
  if (selectempresa.value == 0) {
    selectempresa.style.border = "solid 1px red";
    selectempresa.focus();
    ok = "NO";
  } else {
    selectempresa.style.border = "solid 1px rgb(119, 136, 153)";
  }
  if (selectconductor.value == 0) {
    selectconductor.style.border = "solid 1px red";
    selectconductor.focus();
    ok = "NO";
  } else {
    selectconductor.style.border = "solid 1px rgb(119, 136, 153)";
  }
  return ok;
}

const CRUDGrabaServicio = async () => {
  let valor = 0;
  if (inputvalorservicio.value != "") {
    valor = inputvalorservicio.value
  }
  let klms = 0;
  if (inputkilometros.value != "") {
    klms = inputkilometros.value
  }
  //  console.log(selectempresa.value,"--",selectempresa.value,"--",selectconductor.value,"--",selecttipo.value,"--",SelectMeses.value + "/" + SelectDias.value,
  //              inputcantidadpax.value,"--",inputhorainicio.value,"--",inputhoratermino.value,"--",klms,"--",valor,"--",inputobservacion.value);
  try {
    const respuesta = await fetch(urlG + "servicio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codempresa: selectempresa.value,
        codconductor: selectconductor.value,
        codtiposervicio: selecttipo.value,
        fecha: "2024/" + SelectMeses.value + "/" + SelectDias.value,
        cantidadpax: inputcantidadpax.value,
        horainicio: inputhorainicio.value,
        horatermino: inputhoratermino.value,
        kilometros: klms,
        kilometrosextras: 0,
        valor: valor,
        observacion: inputobservacion.value
      }),
    });
    const data = await respuesta.json();
    codservicioAux = data.codservicio;
    if (ArrayPasajerosViajan.length > 0) {
      CuantosPasajerosViajan();
      //LimpiarIngreso();
    } else {
      //LimpiarIngreso();
    }
  } catch (error) { }
}

async function CRUDModificaServicio() {
  console.log(codservicioAux)
  let valor = 0;
  if (inputvalorservicio.value != "") {
    valor = inputvalorservicio.value
  }
  let klms = 0;
  if (inputkilometros.value != "") {
    klms = inputkilometros.value
  }
  try {
    await fetch(urlG + "servicio/" + parseInt(codservicioAux), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codempresa: selectempresa.value,
        codconductor: selectconductor.value,
        codtiposervicio: selecttipo.value,
        fecha: "2024/" + SelectMeses.value + "/" + SelectDias.value,
        cantidadpax: inputcantidadpax.value,
        horainicio: inputhorainicio.value,
        horatermino: inputhoratermino.value,
        kilometros: klms,
        kilometrosextras: 0,
        valor: valor,
        observacion: inputobservacion.value
      }),
    });
    console.log(ArrayPasajerosViajan);
    if (ArrayPasajerosViajan.length > 0) {
      CuantosPasajerosViajan();
      //LimpiarIngreso();
    } else {
      //LimpiarIngreso();
    }
  } catch (error) {
    console.log(error);
  }
}

function LimpiarIngreso() {
  OrigenDestinoUno.innerHTML = "";
  inputcantidadpax.value = "";
  inputhorainicio.value = "";
  inputhoratermino.value = "";
  inputvalorservicio.value = "";
  inputkilometros.value = "";
  inputvalorservicio.value = "";
  inputobservacion.value = "";

  inputcantidadpax.style.border = "solid 1px rgb(119, 136, 153)";
  inputhoratermino.style.border = "solid 1px rgb(119, 136, 153)";
  inputhorainicio.style.border = "solid 1px rgb(119, 136, 153)";
  inputhorainicio.style.border = "solid 1px rgb(119, 136, 153)";
  selecttipo.style.border = "solid 1px rgb(119, 136, 153)";
  SelectDias.style.border = "solid 1px rgb(119, 136, 153)";
  selectempresa.style.border = "solid 1px rgb(119, 136, 153)";
  selectconductor.style.border = "solid 1px rgb(119, 136, 153)";
  tbody_viajan.innerHTML = "";
}

function CuantosPasajerosViajan() {
  //console.log(ArrayPasajerosViajan);
  ArrayPasajerosViajan.forEach((item) => {
    CRUDGrabaPasajerosViajan(item.id)
  });
}

const CRUDGrabaPasajerosViajan = async (codpasajero) => {
  try {
    const respuesta = await fetch(urlG + "serviciopasajeros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codservicio: codservicioAux,
        codpasajero: codpasajero
      }),
    });
    const data = await respuesta.json();
    return data;
  } catch (error) { }
}

//-----------------------------------------------------//
//-----  MODAL SALIR    MODAL SALIR    MODAL SALIR ----//
//-----------------------------------------------------//

if (document.getElementById("btnModal")) {
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("btnModal");
  var BtnModalAcepta = document.getElementById("BtnModalAcepta");
  var BtnModalCancela = document.getElementById("BtnModalCancela");
  //var body = document.getElementsByTagName("body")[0];

  btn.onclick = function () {
    modal.style.display = "block";
  }

  BtnModalAcepta.onclick = function () {
    modal.style.display = "none";
  }

  BtnModalCancela.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

//-----------------------------------------------------//
//---  MODAL WHAPSAPP EMAIL   MODAL WHAPSAPP EMAIL  ---//
//-----------------------------------------------------//
// if (document.getElementById("btnModal")) {
const ModalEnviarServicios = document.getElementById("ModalEnviarServicios");
const BtnModalAceptaEnvio = document.getElementById("BtnModalAceptaEnvio");
const BtnModalCancelaEnvio = document.getElementById("BtnModalCancelaEnvio");
const BtnAbrirEnvioServicios = document.getElementById("BtnAbrirEnvioServicios");

BtnAbrirEnvioServicios.addEventListener("click",() =>{
    ModalEnviarServicios.style.display = "block";
})


BtnModalAceptaEnvio.onclick = function () {
  ModalEnviarServicios.style.display = "none";
}

BtnModalCancelaEnvio.onclick = function () {
  ModalEnviarServicios.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    ModalEnviarServicios.style.display = "none";
  }
}






//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++   EMAIL   EMAIL   EMAIL   EMAIL   EMAIL    ++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eugenio.pizarro23@gmail.com',
    pass: 'tupassword'
  }
});

const mailOptions = {
  from: 'tucorreo@gmail.com',
  to: 'destinatario@gmail.com',
  subject: 'Correo de prueba',
  text: 'Este es un correo de prueba enviado desde JavaScript.'
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Correo enviado: ' + info.response);
  }
});