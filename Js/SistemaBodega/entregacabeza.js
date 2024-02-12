import {urlGlobal} from "./Globales.js"
import {on} from "./Globales.js"
import {AsignarFechaActual} from "./Globales.js"
const url = urlGlobal;
//const url = "http://localhost:3000/";
const panelEntregasListas = document.getElementById("panelEntregasListas");
const panelCabezaEntrega = document.getElementById("panelCabezaEntrega");
const panelLasDosTablas = document.getElementById("panelLasDosTablas");
const panelCabeceraTablas = document.getElementById("panelCabeceraTablas");
const tbodyEntregasHechas = document.getElementById("tbodyEntregasHechas");
const buscarNombreInsumo = document.querySelector("#buscarNombreInsumo");
const tbodyInsumos = document.getElementById("tbodyInsumos");
const tbodyEntrega = document.getElementById("tbodyEntrega");
const btnGrabaEntregaTotal = document.getElementById("btnGrabaEntregaTotal");
const ordenstock = document.getElementById("ordenstock");
const ordennombre = document.getElementById("ordennombre");
//const btnEditarEntregaHecha = document.getElementById("btnEditarEntregaHecha");
const fechaEntrega = document.getElementById("fechaEntrega");
const selectSector = document.getElementById("selectSector");
const responsable = document.getElementById("responsable");
const btnSalirCabeza = document.getElementById("btnSalirCabeza");
const btnNuevaEntrega = document.getElementById("btnNuevaEntrega");
const btnGrabaCabezaEntrega = document.getElementById("btnGrabaCabezaEntrega");
const totalInsumosEntregados = document.getElementById(
  "totalInsumosEntregados"
);
const numeroInsumosEntregados = document.getElementById(
  "numeroInsumosEntregados"
);

// VAriables Globales
let codentrega = 0;
let ArrayEntregar = [];
let stockfijo = 0;
let estado = "";
let totalinsumosAux = 0;
let ArrayInsumosExistentes = [];

// INICIO DE LA PAGINA
MostrarEntregasHechas("entregacab");

// ****************************************************
// BOTONES BOTONES BOTONES BOTONES BOTONES BOTONES
// ****************************************************
on(document, "click", ".btnSumarIzq", (e) => {
  e.preventDefault();
  const insumos = e.target.parentNode.parentNode; //Tabla INSUMOS
  const codinsumo = insumos.children[0].innerHTML;
  const nombre = insumos.children[1].innerHTML;
  let stock = insumos.children[2].innerHTML;
  stockfijo = insumos.children[2].innerHTML;
  const fechavence = insumos.children[4].innerHTML;
  const entrega = tbodyEntrega; //Tabla ENTREGA
  let esta = "NO";
  let cantidad = 0;
  let cantidadaux = 0;
  let indice = -1;
  //Buscar en la TABLA si ya existe el insumo que se agregara, obteniendo cantidad y stock
  for (let i = 0; i < entrega.childNodes.length; i++) {
    if (codinsumo == entrega.children[i].children[2].innerHTML) {
      if (fechavence == entrega.children[i].children[3].innerHTML) {
        stock = entrega.children[i].children[0].innerHTML;
        cantidad = entrega.children[i].children[5].innerHTML;
        cantidadaux = entrega.children[i].children[6].innerHTML;
        indice = entrega.children[i].children[7].innerHTML;
        esta = "SI";
        if (stock == 0) {
          alert("No hay mas en STOCK...");
          //ArrayEntregar[indice].stock = 0;
        } else {
          ArrayEntregar[indice].cantidad = parseInt(cantidad) + 1;
          ArrayEntregar[indice].cantidadaux = parseInt(cantidadaux) + 1;
          ArrayEntregar[indice].stock = parseInt(stock) - 1;
        }
      }
    }
  }
  if (esta == "NO") {
    if (stock > 0) {
      stock = stock - 1
      AgregarInsumoNuevo(stock, codinsumo, fechavence, nombre, 1, 1, "N"); // Agragar el insumo al Array
    } else {
      alert("Stock en 0...!");
    }
  }
  btnGrabaEntregaTotal.style.display = "block";
  MostrarAEntregar(ArrayEntregar);
});

on(document, "click", ".btnSumarDer", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode; //tabla Entrega
  const stock = fila.children[0].innerHTML;
  let cantidad = fila.children[5].innerHTML;
  let cantidadaux = fila.children[6].innerHTML;
  const indice = fila.children[7].innerHTML;
  if (stock == 0) {
    //ArrayEntregar[indice].stock = parseInt(stock) - 1;
    alert("No hay mas en STOCK...");
  } else {
    ArrayEntregar[indice].cantidad = parseInt(cantidad) + 1;
    ArrayEntregar[indice].cantidadaux = parseInt(cantidadaux) + 1;
    ArrayEntregar[indice].stock = parseInt(stock) - 1;
  }
  MostrarAEntregar(ArrayEntregar);
});

function ComplementoSumaIzqDer(codinsumo, cantidad, cantidadaux, stock) {
  // El insumo ingresado ya existe en el Array y se SUMA 1 a cantidad y se RESTA 1 a stock
  if (stock == 0) {
    alert("No hay mas en STOCK...");
  } else {
    const elemento = ArrayEntregar.find(
      (insumos) => insumos.codinsumo === codinsumo
    );
    elemento.cantidad = parseInt(cantidad) + 1;
    elemento.cantidadaux = parseInt(cantidadaux) + 1;
  }
}

on(document, "click", ".btnEditarEntregaHecha", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode; //Tabla INSUMOS
  codentrega = fila.children[0].innerHTML;
  fechaEntrega.value = fila.children[1].innerHTML;
  selectSector.value = SectorLetra(fila.children[2].innerHTML);
  responsable.value = fila.children[3].innerHTML;
  totalInsumosEntregados.innerHTML = fila.children[4].innerHTML;
  totalinsumosAux = fila.children[4].innerHTML;
  MostrarInsumos("insumos");
  Paneles4("none", "block", "block", "block");
  TraerDetallesHechos("entregadet/", codentrega); // trae de la BD los datos
  btnGrabaCabezaEntrega.innerHTML = "Modificar Datos Cabecera";
  estado = "Modifica";
  CabeceraSoloLectura("SI");
  Deshabilita(true);
});

on(document, "click", ".btnRestarInsumo", (e) => {
  const entrega = e.target.parentNode.parentNode; //TABLA entrega
  const stock = entrega.children[0].innerHTML;
  const codinsumo = entrega.children[2].innerHTML;
  const fechavence = entrega.children[3].innerHTML;
  let cantidad = entrega.children[5].innerHTML;
  let cantidadaux = entrega.children[6].innerHTML;
  let indice = entrega.children[7].innerHTML;
  const existe = entrega.children[8].innerHTML;
  if (cantidad == 1) {
    let respuesta = confirm("Desea Eliminar el Insumo...?");
    if (respuesta) {
      if (existe == "E") {
        CRUDEliminaUnInsumo(codinsumo,fechavence); // Eliminaos de directamente de la BD aparte de la TABLA
        CRUDSumaRestaEnTablaInsumos(codinsumo, cantidadaux, -1);
        CRUDModificaTotalInsumos(-1);
        ArrayEntregar.splice(indice, 1); // INSUMO se elimina del ARRAY
      }else{
        ArrayEntregar.splice(indice, 1); // INSUMO se elimina del ARRAY
      }
    }
  } else {
    ArrayEntregar[indice].cantidad = parseInt(cantidad) - 1;
    ArrayEntregar[indice].cantidadaux = parseInt(cantidadaux) - 1;
    ArrayEntregar[indice].stock = parseInt(stock) + 1;
  }
  btnGrabaEntregaTotal.style.display = "block";
  MostrarAEntregar(ArrayEntregar);
});

buscarNombreInsumo.addEventListener("input", (e) => {
  MostrarMostrar(e.target.value.toUpperCase().trim());
});

function MostrarMostrar(valor) {
  const mostrarFiltrado = ArrayInsumosExistentes.filter((insumos) =>
    insumos.nombre.toUpperCase().startsWith(valor)
  );
  MostrarInsumosDos(mostrarFiltrado);
}

// function MostrarMostrar(valor) {
//   const mostrarFiltrado = ArrayInsumosExistentes.filter((insumos) =>
//     insumos.nombre.toUpperCase().startsWith(valor)
//   );
//   MostrarInsumosDos(mostrarFiltrado);
// }

ordennombre.addEventListener("change", () => {
  if (ordennombre.checked == true) {
    ordenstock.checked = false;
    ordenfecha.checked = false;
    let ArrayOrdenNombre = ArrayInsumosExistentes.sort((x, y) =>
      x.nombre.localeCompare(y.nombre)
    );
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenNombre);
  }
});

ordenstock.addEventListener("change", () => {
  if (ordenstock.checked == true) {
    ordennombre.checked = false;
    ordenfecha.checked = false;
    let ArrayOrdenStock = ArrayInsumosExistentes.sort(
      (x, y) => x.stock - y.stock
    );
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenStock);
  }
});

ordenfecha.addEventListener("change", () => {
  if (ordenfecha.checked == true) {
    ordennombre.checked = false;
    ordenstock.checked = false;
    let ArrayOrdenFecha = ArrayInsumosExistentes.sort((x,y)=>x.stockdias - y.stockdias);
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenFecha);
  }
});

btnSalirCabeza.addEventListener("click", (e) => {
  const btn = btnGrabaEntregaTotal.style.display;
  if (btn == "block") {
    var respuesta = confirm("Existen datos sin Grabar, desea salir...?");
    if (respuesta) {
      Paneles4("block", "none", "none", "none");
      Deshabilita(false);
      location.reload();
    }
  } else {
    Paneles4("block", "none", "none", "none");
    //Limpiar();
    Deshabilita(false);
    location.reload();
  }
});

btnNuevaEntrega.addEventListener("click", (e) => {
  fechaEntrega.value = AsignarFechaActual();
  Paneles4("none", "block", "none", "none");
  estado = "Nuevo";
});

btnGrabaCabezaEntrega.addEventListener("click", (e) => {
  e.preventDefault();
  if (Valida() == "SI") {
    GrabayModificaDatosCabeza();
  }
});

async function GrabarCabezaConInsumos() {
  const datitos = await CRUDGrabaCabezaEntrega();
  codentrega = datitos.id;
  GrabarInsumoPorInsumo();
}

btnGrabaEntregaTotal.addEventListener("click", () => {
  if (estado == "Nuevo") {
    // Graba la Cabecera si es una entrega nueva, con el total de insumos
    GrabarCabezaConInsumos();
  } else {
    // Solo graba en la Cabecera el total de insumos
    CRUDModificaTotalInsumos(0);
    if (codentrega > 0) {
      GrabarInsumoPorInsumo();
    }
  }
  DejarEnCeroCantidadAux();
  MostrarAEntregar(ArrayEntregar);
  MostrarInsumosDos(ArrayInsumosExistentes);
  btnGrabaEntregaTotal.style.display = "none";
});

// ****************************************************
// MOSTRAR TABLAS --- MOSTRAR TABLAS --- MOSTRAR TABLAS
// ****************************************************
function CabeceraSoloLectura(ok) {
  let cursor = "";
  if (ok == "SI") {
    cursor = "not-allowed";
  } else {
    cursor = "pointer";
  }
  responsable.style.cursor = cursor;
  selectSector.style.cursor = cursor;
  fechaEntrega.style.cursor = cursor;
}

// TABLAS ENTREGAS HECHAS
function MostrarEntregasHechas(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarEntregasHechasDos(data))
    .catch((error) => console.log(error));
}

const MostrarEntregasHechasDos = (data) => {
  let resultados = "";
  let fecha = "";
  data.forEach((item) => {
    fecha = item.fecha.substring(0, 10);
    resultados += `<tr style="text-align: center;">
                    <td class="d-none">${item.codentrega}</td>
                    <td>${fecha}</td>
                    <td>${SectorColor(item.sector)}</td>
                    <td>${item.responsable}</td>
                    <td>${item.totalinsumos}</tdtyle=>
                    <td class="text-center"><a class="btnEditarEntregaHecha btn btn-primary">Editar
                    <a class="btnBorrarEntregaHecha btn btn-danger">Borrar</a></td>
                 </tr>`;
  });
  tbodyEntregasHechas.innerHTML = resultados;
};

// TABLAS INSUMOS EXISTENTES
function MostrarInsumos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => TraerInsumosExistentes(data))
    .catch((error) => console.log(error));
}

function AgregarInsumoExistente(codinsumo, nombre, stock, fechavence, stockdias) {
  let nuevo = {
    codinsumo: codinsumo,
    nombre: nombre,
    stock: stock,
    fechavence: fechavence,
    stockdias: stockdias,
  };
  ArrayInsumosExistentes.push(nuevo);
}

function TraerInsumosExistentes(data) {
  let fechaHoy = AsignarFechaActual();
  let fechaInsumo = "";
  let dias,stockdias = 0;
  let critico = "";
  let valUno = "";
  let valDos = "";
  for (let i = 0; i < data.length; i++) {
    fechaInsumo = data[i].fechavence.substring(0, 10);
    dias =  Date.parse(fechaInsumo) - Date.parse(fechaHoy);
    stockdias = dias/(1000*60*60*24);
    if(stockdias < 0){
      stockdias = stockdias * -1
    }
    AgregarInsumoExistente(
      data[i].codinsumo,
      data[i].nombre,
      data[i].stock,
      data[i].fechavence,
      stockdias
    );
  }
  MostrarInsumosDos(ArrayInsumosExistentes);
}

const MostrarInsumosDos = (array) => {
  let resultados = "";
  let fecha = "";
  let color = "red";
  let ok = "block";
  let cursor = "";
  if (estado == "Modifica") {
    cursor = "pointer";
  }
  array.forEach((item) => {
    if (item.stock == 0) {
      color = "red";
    } else {
      color = "black";
    }
    fecha = item.fechavence.substring(0, 10);
    resultados +=
      `<tr style="height: 30px;font-size:xlarge;color:` +
      color +
      `;">
            <td style="width: 130px;">${item.codinsumo}</td>
            <td style="width: 500px;">${item.nombre}</td>
            <td style="color:` +
      color +
      `;width:25px;background:yellow;border-radius:50%;text-align:center;">${item.stock}</td>
            <td>&nbsp&nbsp&nbsp</td>
            <td style="width: 120px;">${fecha}</td>
            <td style="width: 50px;text-align:right;">${item.stockdias}</td>
            <td>&nbsp&nbsp</td>
            <td class="text-center" style="display:` +
      ok +
      `">
            <a class="btnSumarIzq btn btn-outline-primary" style="cursor:` +
      cursor +
      `">>>></a></td>
       </tr>`;
  });
  tbodyInsumos.innerHTML = resultados;
};



// TABLAS INSUMOS A ENTREGAR
const MostrarAEntregar = (data) => {
  let resultados = "";
  let total = 0;
  let contador = 0;
  let mostrar = "NO";
  data.forEach((item) => {
    resultados += `<tr>
            <td style="color:blue;text-align:center;width:30px;background:yellow;border-radius:40%;">${item.stock}</td>
            <td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>
            <td style="width:100px;">${item.codinsumo}</td>
            <td style="width:100px;">${item.fechavence}</td>
            <td style="width:350px;">${item.nombre}</td>
            <td style="color: red;width:40px;">${item.cantidad}</td>
            <td class="d-none">${item.cantidadaux}</td>
            <td class="d-none">${contador}</td>
            <td class="d-none">${item.existe}</td>
            <td class="text-center">
              <a class="btnSumarDer btn btn-outline-primary btn-sm" style="cursor:pointer">+</a>
              <a class="btnRestarInsumo btn btn-outline-danger btn-sm" style="cursor:pointer">--</a>
            </td>
            </tr>`;
    if (item.cantidadaux != 0) {
      mostrar = "SI";
    }
    total = total + item.cantidad; //Se utiliza en Total Insumos entregados
    contador = contador + 1; //Se utiliza en Tipo de Insumos entregados
  });
  totalInsumosEntregados.innerHTML = total;
  numeroInsumosEntregados.innerHTML = contador;
  if (mostrar == "SI") {
    btnGrabaEntregaTotal.style.display = "block";
  } else {
    btnGrabaEntregaTotal.style.display = "none";
  }
  // Agragar a la TABLA que esta en el HTML
  tbodyEntrega.innerHTML = resultados;
};

// ****************************************************
// CRUD - CRUD - CRUD - CRUD -CRUD - CRUD - CRUD - CRUD
// ****************************************************
async function CRUDSumaRestaEnTablaInsumos(codinsumo, stock, valor) {
  try {
    await fetch(url + "insumosr/" + codinsumo, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock: parseInt(stock) + valor,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

const CRUDGrabaInsumoNuevo = async (codinsumo, cantidad, fechavence) => {
  console.log(codentrega+"---"+codinsumo+"---"+cantidad+"---"+fechavence);
  try {
    await fetch(url + "entregadet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codentrega: codentrega,
        codinsumo: codinsumo,
        fechavence: fechavence,
        cantidad: cantidad,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

async function CRUDGrabaModificaInsumoEntregado(
  codinsumo,
  cantidad,
  fechavence
) {
  try {
    await fetch(url + "entregadet/" + codentrega, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codinsumo: codinsumo,
        cantidad: cantidad,
        fechavence: fechavence,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

async function CRUDGrabaCabezaEntrega() {
  try {
    const respuesta = await fetch(url + "entregacab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: fechaEntrega.value,
        sector: selectSector.value,
        responsable: responsable.value,
        totalinsumos: totalInsumosEntregados.innerHTML,
      }),
    });
    const data = await respuesta.json();
    return data;
  } catch (error) {}
}

async function CRUDModificaCabezaEntrega() {
  try {
    fetch(url + "entregacab/" + codentrega, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: fechaEntrega.value,
        sector: selectSector.value,
        responsable: responsable.value,
      }),
    });
    const data = await respuesta.json();
  } catch (error) {}
  //return data;
}

async function CRUDModificaTotalInsumos(valor) {
  try {
    await fetch(url + "entregacabtot/" + codentrega, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalinsumos: parseInt(totalInsumosEntregados.innerHTML) + valor,
      }),
    });
    const data = await respuesta.json();
  } catch (error) {}
  //return data;
}

async function CRUDEliminaUnInsumo(codinsumo,fechavence) {
  try {
    await fetch(url + "entregadet/" + codentrega, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codinsumo: codinsumo,
        fechavence: fechavence,
      }),
    });
  } catch (error) {
    console.log(error);
  }
  // .then((response) => response.json())
  // .then((data) => console.log(data));
}

// *****************************************************
// OTROS - OTROS - OTROS - OTROS - OTROS - OTROS - OTROS
// *****************************************************
function GrabayModificaDatosCabeza() {
  if (btnGrabaCabezaEntrega.innerHTML == "Grabar Datos Cabecera") {
    btnGrabaCabezaEntrega.innerHTML = "Modificar Datos Cabecera";
    Paneles4("none", "block", "block", "block");
    MostrarInsumos("insumos");
    Deshabilita(true);
    if (estado == "Modifica") {
      CRUDModificaCabezaEntrega(); // graba directamente en la DB. es una modificacion ya existe.
    }
    CabeceraSoloLectura("SI");
  } else {
    btnGrabaCabezaEntrega.innerHTML = "Grabar Datos Cabecera";
    Paneles4("none", "block", "none", "none");
    Deshabilita(false);
    CabeceraSoloLectura("NO");
  }
}

function TraerDetallesHechos(cadena, codentrega) {
  const cantidadaux = 0;
  fetch(url + cadena + codentrega)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        AgregarInsumoNuevo(
          data[i].stock,
          data[i].codinsumo,
          data[i].fechavence.substring(0,10),
          data[i].nombre,
          data[i].cantidad,
          cantidadaux,
          "E"
        );
      }
      MostrarAEntregar(ArrayEntregar);
    });
}

function AgregarInsumoNuevo(
  stock,
  codinsumo,
  fechavence,
  nombre,
  cantidad,
  cantidadaux,
  existe
) {
  let nuevo = {
    stock: stock,
    codinsumo: codinsumo,
    nombre: nombre,
    fechavence: fechavence,
    cantidad: cantidad,
    cantidadaux: cantidadaux,
    existe: existe,
  };
  ArrayEntregar.push(nuevo);
}

function DejarEnCeroCantidadAux() {
  for (let i = 0; i < ArrayEntregar.length; i++) {
    ArrayEntregar[i].cantidadaux = 0;
  }
}

function GrabarInsumoPorInsumo() {
  let codinsumo = 0;
  let cantidad = 0;
  let cantidadaux = 0;
  let fechavence = "";
  if (estado == "Modifica") {
    for (let i = 0; i < ArrayEntregar.length; i++) {
      cantidadaux = ArrayEntregar[i].cantidadaux;
      if (cantidadaux != 0) {
        codinsumo = ArrayEntregar[i].codinsumo;
        cantidad = ArrayEntregar[i].cantidad;
        fechavence = ArrayEntregar[i].fechavence;
        if (ArrayEntregar[i].existe == "E") {
          CRUDGrabaModificaInsumoEntregado(codinsumo, cantidad, fechavence);
        } else {
          CRUDGrabaInsumoNuevo(codinsumo, cantidad, fechavence);
        }
        CRUDSumaRestaEnTablaInsumos(codinsumo, cantidadaux, 0);
      }
    }
  } else {
    console.log(ArrayEntregar);
    for (let i = 0; i < ArrayEntregar.length; i++) {
      codinsumo = ArrayEntregar[i].codinsumo;
      cantidad = ArrayEntregar[i].cantidad;
      fechavence = ArrayEntregar[i].fechavence;
      console.log(codinsumo);
      CRUDGrabaInsumoNuevo(codinsumo, cantidad, fechavence);
      CRUDSumaRestaEnTablaInsumos(codinsumo, cantidad, 0);
    }
  }
}

function SectorColor(letra) {
  let color = "";
  if (letra == "R") {
    color = "Rojo";
  } else {
    if (letra == "V") {
      color = "Verde";
    } else {
      if (letra == "A") {
        color = "Azul";
      }
    }
  }
  return color;
}

function Valida() {
  let ok = "SI";
  if (fechaEntrega.value == "") {
    fechaEntrega.style.border = "solid 1px red";
    fechaEntrega.focus();
    ok = "NO";
  } else {
    fechaEntrega.style.border = "solid 1px lightskyblue";
  }
  if (responsable.value == "") {
    responsable.style.border = "solid 1px red";
    responsable.focus();
    ok = "NO";
  } else {
    responsable.style.border = "solid 1px lightskyblue";
  }
  if (selectSector.value == "") {
    selectSector.style.border = "solid 1px red";
    selectSector.focus();
    ok = "NO";
  } else {
    selectSector.style.border = "solid 1px lightskyblue";
  }
  return ok;
}

function SectorLetra(color) {
  let letra = "";
  if (color == "Rojo") {
    letra = "R";
  } else {
    if (color == "Verde") {
      letra = "V";
    } else {
      if (color == "Azul") {
        letra = "A";
      }
    }
  }
  return letra;
}

function Paneles4(uno, dos, tres, cuatro) {
  panelEntregasListas.style.display = uno;
  panelCabezaEntrega.style.display = dos;
  panelLasDosTablas.style.display = tres;
  panelCabeceraTablas.style.display = cuatro;
}

function Deshabilita(ok) {
  fechaEntrega.disabled = ok;
  selectSector.disabled = ok;
  responsable.disabled = ok;
}
