import {urlGlobal} from "./Globales.js"
const url = urlGlobal;
//const url = "http://localhost:3000/";
const modalProveedor = new bootstrap.Modal(
  document.getElementById("modalProveedores")
);
const panelEntregasListas = document.getElementById("panelEntregasListas");
const panelCabezaEntrega = document.getElementById("panelCabezaEntrega");
const panelLasDosTablas = document.getElementById("panelLasDosTablas");
const panelCabeceraTablas = document.getElementById("panelCabeceraTablas");
const tbodyComprasHechas = document.getElementById("tbodyComprasHechas");
const tbodyInsumos = document.getElementById("tbodyInsumos");
const tbodyRecepcion = document.getElementById("tbodyRecepcion");
const btnGrabaRecepcionTotal = document.getElementById(
  "btnGrabaRecepcionTotal"
);
const btnEditarComprasHecha = document.getElementById("btnEditarComprasHecha");
const fechaRecepcion = document.getElementById("fechaRecepcion");
const numeroguia = document.getElementById("numeroguia");
const numerofactura = document.getElementById("numerofactura");
const selectProveedor = document.getElementById("selectProveedor");
const btnSalirCabeza = document.getElementById("btnSalirCabeza");
const btnNuevaEntrega = document.getElementById("btnNuevaEntrega");
const btnAgregarInsumo = document.getElementById("btnAgregarInsumo");
const btnGrabaCabezaEntrega = document.getElementById("btnGrabaCabezaEntrega");
const totalInsumosComprados = document.getElementById("totalInsumosComprados");
const numeroInsumosComprados = document.getElementById(
  "numeroInsumosComprados"
);
const nombreinsumo = document.getElementById("nombreinsumo");
const codigoinsumo = document.getElementById("codigoinsumo");
const fechavenceinsumo = document.getElementById("fechavenceinsumo");
const cantidadinsumo = document.getElementById("cantidadinsumo");
const cantidadinsumoaux = document.getElementById("cantidadinsumoaux");
//const btnNuevoProveedor = document.getElementById("btnNuevoProveedor");
const ordenstock = document.getElementById("ordenstock");
const ordennombre = document.getElementById("ordennombre");
const txtobs = document.getElementById("txtobs");

// VAriables Globales
let codcompra = 0;
let ArrayRecepcion = [];
let ArrayInsumosExistentes = [];
let estado = "";
let estadoInsumo = "";
let rut = "";
let fechaGlobal = "";

// INICIO DE LA PAGINA
MostrarComprasHechas("compracabeza");

// ****************************************************
// BOTONES BOTONES BOTONES BOTONES BOTONES BOTONES
// ****************************************************
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

on(document, "click", ".btnArriba", (e) => {
  const insumo = e.target.parentNode.parentNode.parentNode; //TABLA INSUMOS...
  const codinsumo = insumo.children[0].innerHTML;
  const fechavence = insumo.children[4].innerHTML;
  const nombre = insumo.children[1].innerHTML;
  const indice = BuscarInsumoEnTablaRecepcionDOS(codinsumo, fechavence); // Buscamos en TABLA COMPRAS
  if (indice == -1) {
    // no se encontro en TABLA RECEPCION, por ende agregamos los datos Ingresados manualmente
    codigoinsumo.value = codinsumo;
    nombreinsumo.value = nombre;
    fechavenceinsumo.value = fechavence;
    cantidadinsumo.value = "";
    fechavenceinsumo.focus();
  }
});

on(document, "click", ".btnSumarInsumo", (e) => {
  e.preventDefault();
  const recepcion = e.target.parentNode.parentNode; //tabla RECEPCION
  let cantidad = parseInt(recepcion.children[3].innerHTML);
  let cantidadaux = parseInt(recepcion.children[5].innerHTML);
  let indice = recepcion.children[4].innerHTML;
  cantidad = cantidad + 1;
  cantidadaux = cantidadaux + 1;
  ArrayRecepcion[indice].cantidad = cantidad;
  ArrayRecepcion[indice].cantidadaux = cantidadaux;
  MostrarARecepcion(ArrayRecepcion);
});

on(document, "click", ".btnRestarInsumo", (e) => {
  const recepcion = e.target.parentNode.parentNode; //tabla RECEPCION
  let codinsumo = parseInt(recepcion.children[0].innerHTML);
  let fechavence = recepcion.children[2].innerHTML;
  let cantidad = parseInt(recepcion.children[3].innerHTML);
  let indice = recepcion.children[4].innerHTML;
  let cantidadaux = parseInt(recepcion.children[5].innerHTML);
  if (cantidad == 1) {
    let respuesta = confirm("Desea Eliminar el Insumo...?");
    if (respuesta) {
      const cantidadelimina = cantidadaux - 1;
      CRUDModificarTablaInsumos(codinsumo, fechavence, cantidadelimina);
      CRUDEliminaUnInsumo(codinsumo, fechavence);
      ArrayRecepcion.splice(indice, 1); // INSUMO se elimina del ARRAY
    }
  } else {
    cantidad = cantidad - 1;
    cantidadaux = cantidadaux - 1;
    ArrayRecepcion[indice].cantidad = cantidad;
    ArrayRecepcion[indice].cantidadaux = cantidadaux;
  }
  MostrarARecepcion(ArrayRecepcion);
});

on(document, "click", ".btnEditarSI", (e) => {
  ArrayRecepcion = [];
  const insumo = e.target.parentNode.parentNode.parentNode;
  codcompra = insumo.children[0].innerHTML;
  fechaRecepcion.value = insumo.children[1].innerHTML;
  selectProveedor.value = insumo.children[2].innerHTML;
  numeroguia.value = insumo.children[4].innerHTML.trim();
  numerofactura.value = insumo.children[5].innerHTML.trim();
  totalInsumosComprados.value = insumo.children[6].innerHTML.trim();
  txtobs.value = insumo.children[8].innerHTML.trim();
  ComboProveedor(insumo.children[7].innerHTML);
  MostrarInsumos("insumos");
  Paneles4("none", "block", "block", "block");
  TraerDetallesComprasHechos("compradetalle/"); // trae de la BD los datos
  btnGrabaCabezaEntrega.innerHTML = "Modificar Cabecera";
  estado = "modifica";
  CabeceraSoloLectura("SI");
  Deshabilita(true);
});

on(document, "click", ".btnEditarInsumo", (e) => {
  const recepcion = e.target.parentNode.parentNode; //tabla RECEPCION
  codigoinsumo.value = recepcion.children[7].innerHTML;
  nombreinsumo.value = recepcion.children[1].innerHTML;
  fechavenceinsumo.value = recepcion.children[2].innerHTML;
  cantidadinsumo.value = recepcion.children[3].innerHTML;
});

on(document, "click", ".btnEliminarInsumo", (e) => {
  const recepcion = e.target.parentNode.parentNode.parentNode; //tabla RECEPCION
  const fechavence = recepcion.children[2].innerHTML;
  const cantidad = recepcion.children[3].innerHTML;
  const indice = recepcion.children[4].innerHTML;
  const existe = recepcion.children[6].innerHTML;
  const codinsumo = recepcion.children[7].innerHTML;
  let respuesta = confirm("Desea Eliminar el Insumo...?");
  if (respuesta) {
    ArrayRecepcion.splice(indice, 1); // INSUMO se elimina del ARRAY
    if (existe == "E") {
      CRUDModificarTablaInsumos(codinsumo, fechavence, cantidad * -1);
      CRUDEliminaUnInsumo(codinsumo, fechavence);
    }
    // for (i = 0; i < ArrayInsumosExistentes.length; i++) {
    //   // Busca solo UN Registro...
    //   if (codinsumo == ArrayInsumosExistentes[i].codinsumo) {
    //     if (fecha == ArrayInsumosExistentes[i].fechavence) {
    //       if(ArrayInsumosExistentes[i].cantidad - cantidad <= 0)
    //       ArrayInsumosExistentes.splice(i, 1); // INSUMO se elimina del ARRAY
    //     }
    //   }
    // }
  }
  MostrarARecepcion(ArrayRecepcion);
});

// btnNuevoProveedor.addEventListener("click", () => {
//   //opcion = "crear";
//   //ComboComunas(0);
//   modalProveedor.show();
// });

codigoinsumo.addEventListener("keydown", (e) => {
  let existe = ""
  const codinsumo = codigoinsumo.value;
  if (e.keyCode == 13 || e.keyCode == 9) {
    existe = BuscarInsumoEnTablaRecepcionUNO(codinsumo);
    if (existe == "NO") {
      // Ahora buscamos en tabla INSUMOS
      let elemento = ArrayInsumosExistentes.find((insumos) => insumos.codinsumo === codinsumo);
      if (elemento == undefined) {
        // NO EXISTE en tabla INSUMOS
        nombreinsumo.value = "";
        fechavenceinsumo.value = "";
        cantidadinsumo.value = "";
        nombreinsumo.focus();
      } else {
        // SI EXISTE en tabla INSUMOS
        nombreinsumo.value = elemento.nombre;
        fechavenceinsumo.value = elemento.fechavence.substring(0, 10);
        cantidadinsumo.value = 0;
        fechavenceinsumo.focus();
      }
    }
  }
  MostrarInsumosDos(ArrayInsumosExistentes);
});

function BuscarInsumoEnTablaRecepcionDOS(codinsumo, fecha) {
  let indice = -1;
  const recepcion = tbodyRecepcion;
  for (let i = 0; i < recepcion.childNodes.length; i++) {
    // Busca solo UN Registro...En TABLA COMPRAS
    if (indice == -1) {
      if (codinsumo == recepcion.children[i].children[7].innerHTML) {
        if (fecha == recepcion.children[i].children[2].innerHTML) {
            codigoinsumo.value = codinsumo;
            nombreinsumo.value = recepcion.children[i].children[1].innerHTML;
            fechavenceinsumo.value = recepcion.children[i].children[2].innerHTML;
            cantidadinsumo.value = recepcion.children[i].children[3].innerHTML;
            cantidadinsumoaux.value = recepcion.children[i].children[5].innerHTML;
            cantidadinsumo.focus();
            indice = recepcion.children[i].children[4].innerHTML;
        }
      }
    }
  }
  return indice;
}

function BuscarInsumoEnTablaInsumos(codinsumo, fechavence) {
  let indice = -1;
  const insumos = tbodyInsumos;
  for (let i = 0; i < insumos.childNodes.length; i++) {
    // Busca solo UN Registro...En TABLA COMPRAS
    if (indice == -1) {
      if (codinsumo == insumos.children[i].children[0].innerHTML) {
        if (fechavence == insumos.children[i].children[4].innerHTML) {
          indice = i;
        }
      }
    }
  }
  return indice;
}

function BuscarInsumoEnTablaRecepcionUNO(codinsumo) {
  //busca y trae un insumo solo con el codinsumo...
  let existe = "NO";
  const recepcion = tbodyRecepcion;
  for (let i = 0; i < recepcion.childNodes.length; i++) {
    if (existe == "NO") {
      if (codinsumo == recepcion.children[i].children[7].innerHTML) {
        nombreinsumo.value = ArrayRecepcion[i].nombre;
        fechavenceinsumo.value = ArrayRecepcion[i].fechavence;
        cantidadinsumo.value = ArrayRecepcion[i].cantidad;
        cantidadinsumo.focus();
        existe = "SI";
      }
    }
  }
  return existe;
}

ordennombre.addEventListener("change", () => {
  if (ordennombre.checked == true) {
    ordenstock.checked = false;
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
    let ArrayOrdenStock = ArrayInsumosExistentes.sort(
      (x, y) => x.stock - y.stock
    );
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenStock);
  }
});

// btnNuevoProveedor.addEventListener("click", () => {
//   //llamado = llamado + 1;
// });

nombreinsumo.addEventListener("input", (e) => {
  MostrarMostrar(e.target.value.toUpperCase().trim());
});

btnSalirCabeza.addEventListener("click", (e) => {
  const btn = btnGrabaRecepcionTotal.style.display;
  if (btn == "block") {
    var respuesta = confirm("Existen datos sin Grabar, desea salir...?");
    if (respuesta) {
      Paneles4("block", "none", "none", "none");
      location.reload();
    }
  } else {
    Paneles4("block", "none", "none", "none");
    //Limpiar();
    location.reload();
  }
});

btnNuevaEntrega.addEventListener("click", (e) => {
  AsignarFechaActual();
  ComboProveedor("");
  Paneles4("none", "block", "none", "none");
  estado = "nuevo";
});

btnGrabaCabezaEntrega.addEventListener("click", (e) => {
  e.preventDefault();
  if (Valida() == "SI") {
    GrabayModificaDatosCabeza();
    codigoinsumo.focus();
  }
});

// BOTON IMPORTANTE BOTON IMPORTANTE BOTON IMPORTANTE BOTON IMPORTANTE
// BOTON IMPORTANTE BOTON IMPORTANTE BOTON IMPORTANTE BOTON IMPORTANTE
btnAgregarInsumo.addEventListener("click", (e) => {
  e.preventDefault();
  let indice = 0;
  const codinsumo = codigoinsumo.value;
  const nombre = nombreinsumo.value;
  let fechavence = fechavenceinsumo.value;
  let cantidad = cantidadinsumo.value;
  if (ValidaDos() == "SI") {
      indice = BuscarInsumoEnTablaRecepcionDOS(codinsumo, fechavence);
      if(indice == -1){ // NO ESTA EN TABLA RECEPCION
        indice = BuscarInsumoEnTablaInsumos(codinsumo, fechavence);
        if(indice == -1){ // NO ESTA EN TABLE INSUMOS
          SumarInsumoArrayRecepcion(codinsumo, nombre, fechavence, cantidad, "X");
        }else{
          SumarInsumoArrayRecepcion(codinsumo, nombre, fechavence, cantidad, "N");
        }
      }else{
        const cantidadantes = ArrayRecepcion[indice].cantidad;
        ArrayRecepcion[indice].fechavence = fechavence;
        ArrayRecepcion[indice].cantidad = cantidad;
        ArrayRecepcion[indice].cantidadaux = (cantidad - cantidadantes);
      }
    MostrarARecepcion(ArrayRecepcion);
    Limpiar();
    MostrarInsumosDos(ArrayInsumosExistentes);
  }
});

btnGrabaRecepcionTotal.addEventListener("click", () => {
  GrabarCabezaConTodosLosInsumos();
  MostrarInsumos("insumos");
  btnGrabaRecepcionTotal.style.display = "none";
});

// ****************************************************
// MOSTRAR TABLAS --- MOSTRAR TABLAS --- MOSTRAR TABLAS
// ****************************************************
// TABLAS ENTREGAS HECHAS UNO
function MostrarComprasHechas(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarComprasHechasDos(data))
    .catch((error) => console.log(error));
}
// TABLAS ENTREGAS HECHAS DOS
const MostrarComprasHechasDos = (data) => {
  console.log(data);
  let resultados = "";
  let fecha = "";
  data.forEach((item) => {
    fecha = item.fecha.substring(0, 10);
    resultados += `<tr style="text-align: center;">
                    <td id="idSolito" class="d-none">${item.codcompra}</td>
                    <td>${fecha}</td>
                    <td>${item.nombre}</td>
                    <td>${item.contacto}</td>
                    <td>${item.numeroguia}</tdtyle=>
                    <td>${item.numerofactura}</tdtyle=>
                    <td>${item.totalinsumos}</tdtyle=>
                    <td class="d-none">${item.rut}</tdtyle=>
                    <td class="d-none">${item.observacion}</tdtyle=>
                    <td>
                    <a class="btnEditarSI"><img src="../img/editar10.png" width="40" height="25" style="cursor:pointer" title="Editar Registro"></a>
                    <a class="btnBorrarEntregaHecha"><img src="../img/borrar3.png" width="35" height="30" style="cursor:pointer" title="Eliminar Registro"></a>
                    </td>
                 </tr>`;
  });
  tbodyComprasHechas.innerHTML = resultados;
};

// TABLAS INSUMOS EXISTENTES UNO
function MostrarInsumos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => TraerInsumosExistentes(data))
    .catch((error) => console.log(error));
}
// TABLAS INSUMOS EXISTENTES DOS
const MostrarInsumosDos = (Arreglo) => {
  let resultados = "";
  let fecha = "";
  let color = "red";
  Arreglo.forEach((item) => {
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
            <td style="width: 100px;">${item.codinsumo}</td>
            <td style="width: 470px;">${item.nombre}</td>
            <td style="color:` +
      color +
      `;width:25px;background:yellow;border-radius:40%;text-align:center;font-weight:bold;">${item.stock}</td>
            <td> &nbsp&nbsp&nbsp&nbsp&nbsp </td>
            <td style="width: 112px;">${fecha}</td>
            <td><a class="btnArriba"><img src="../img/flechaarriba1.png" width="35" height="25" style="cursor:pointer" title="Agregar Insumo"></a></td>
       </tr>`;
  });
  tbodyInsumos.innerHTML = resultados;
};

// TABLAS INSUMOS RECEPCIONADOS UNO
const MostrarARecepcion = (data) => {
  let resultados = "";
  let total = 0;
  let contador = 0;
  let mostrarbtn = "NO";
  data.forEach((item) => {
    resultados += `<tr>
            <td><button class="btnEditarInsumo  btn btn-outline-primary btn-sm" style="width:100px;">
            ${item.codinsumo}</button> </td>
            <td style="width:370px;">${item.nombre}</td>
            <td style="width:90px;">${item.fechavence}</td>
            <td style="color: red;width:50px;text-align:center;margin-right:10px">${item.cantidad}</td>
            <td class="d-none">${contador}</td>
            <td class="d-none">${item.cantidadaux}</td>
            <td class="d-none">${item.existe}</td>
            <td class="d-none">${item.codinsumo}</td>
            <td class="text-center">
              <a class="btnSumarInsumo btn btn-outline-primary btn-sm" style="cursor:pointer">+</a>
              <a class="btnRestarInsumo btn btn-outline-danger btn-sm" style="cursor:pointer">--</a>
              <a class="btnEliminarInsumo"><img src="../img/borrar3.png" width="30" height="30" style="cursor:pointer" title="Eliminar Insumo">
            </td>
            </tr>`;
    total = total + parseInt(item.cantidad); //Se utiliza en Total Insumos entregados
    contador = contador + 1; //Se utiliza en Tipo de Insumos entregados
    if (item.cantidadaux != 0) {
      mostrarbtn = "SI";
    }
    if (item.existe == "N") {
      mostrarbtn = "SI";
    }
  });

  if (mostrarbtn == "SI") {
    btnGrabaRecepcionTotal.style.display = "block";
  } else {
    btnGrabaRecepcionTotal.style.display = "none";
  }
  totalInsumosComprados.innerHTML = total;
  numeroInsumosComprados.innerHTML = contador;
  // Agragar a la TABLA que esta en el HTML
  tbodyRecepcion.innerHTML = resultados;
};

function ComboProveedor(rut) {
  fetch(url + "proveedores")
    .then((response) => response.json())
    .then((data) => ComboProveedorDos(data, rut))
    .catch((error) => console.log(error));
}

function ComboProveedorDos(proveedor, rut) {
  selectProveedor.innerHTML = "";
  proveedor.forEach((item) => {
    if (item.rut.trim() == rut.trim()) {
      selectProveedor.innerHTML += `<option selected value=${item.rut.trim()}>${
        item.nombre
      }</option>`;
    } else {
      selectProveedor.innerHTML += `<option value=${item.rut.trim()}>${
        item.nombre
      }</option>`;
    }
  });
}

// ****************************************************
// CRUD - CRUD - CRUD - CRUD -CRUD - CRUD - CRUD - CRUD
// ****************************************************
const CRUDGrabaInsumoNuevoEnRecepcion = async (
  codinsumo,
  fechavence,
  cantidad
) => {
  try {
    await fetch(url + "compradetalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codcompra: codcompra,
        codinsumo: codinsumo,
        fechavence: fechavence,
        cantidad: cantidad,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

const CRUDGrabaInsumoNuevoEnInsumos = async (
  codinsumo,
  nombre,
  fecha,
  cantidad
) => {
  try {
    await fetch(url + "insumos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codinsumo: codinsumo,
        codfamilia: 1,
        nombre: nombre,
        stock: cantidad,
        stockcritico: 5, //stockcritico.value,
        valor: 0,
        fechavence: fecha,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

async function CRUDGrabaModificaRecepcion(codinsumo, cantidad) {
  try {
    await fetch(url + "compradetalle/" + codcompra, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codinsumo: codinsumo,
        cantidad: cantidad,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

async function CRUDModificarTablaInsumos(codinsumo, fechavence, cantidad) {
  try {
    await fetch(url + "insumoscompra/" + codinsumo, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fechavence: fechavence,
        cantidad: cantidad,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

async function CRUDGrabaCabezaCompra() {
  try {
    const respuesta = await fetch(url + "compracab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rutproveedor: selectProveedor.value,
        fecha: fechaRecepcion.value,
        numeroguia: numeroguia.value,
        numerofactura: numerofactura.value,
        totalinsumos: totalInsumosComprados.innerHTML,
        observacion: txtobs.value,
      }),
    });
    const data = await respuesta.json();
  //   setTimeout(function(){
  //     // esperando Un Segundo...
  // }, 1000);
    return data;
  } catch (error) {}
}

async function CRUDModificaTotalInsumos() {
  const paso = parseInt(totalInsumosComprados.innerHTML);
  try {
    await fetch(url + "compracabtot/" + codcompra, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalinsumos: paso,
      }),
    });
    const data = await respuesta.json();
  } catch (error) {}
  //return data;
}

async function CRUDEliminaUnInsumo(codinsumo, fechavence) {
  try {
    await fetch(url + "compradetalle/" + codcompra, {
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

async function CRUDModificaCabezaCompra() {
  try {
    fetch(url + "compracab/" + codcompra, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rutproveedor: selectProveedor.value,
        fecha: fechaRecepcion.value,
        numeroguia: numeroguia.value,
        numerofactura: numerofactura.value,
        totalinsumos: totalInsumosComprados.innerHTML,
        observacion: txtobs.value,
      }),
    });
    const data = await respuesta.json();
  } catch (error) {}
  //return data;
}

// *****************************************************
// OTROS - OTROS - OTROS - OTROS - OTROS - OTROS - OTROS
// *****************************************************

function CabeceraSoloLectura(ok) {
  let estado = "";
  let cursor = "";
  if (ok == "SI") {
    cursor = "not-allowed";
    estado = "false";
  } else {
    cursor = "pointer";
    estado = "true";
  }
  fechaRecepcion.style.cursor = cursor;
  selectProveedor.style.cursor = cursor;
  numeroguia.style.cursor = cursor;
  numerofactura.style.cursor = cursor;
  txtobs.style.cursor = cursor;
}

function Deshabilita(estado) {
  fechaRecepcion.disabled = estado;
  selectProveedor.disabled = estado;
  numeroguia.disabled = estado;
  numerofactura.disabled = estado;
  txtobs.disabled = estado;
}

function MostrarMostrar(valor) {
  const mostrarFiltrado = ArrayInsumosExistentes.filter((insumos) =>
    insumos.nombre.toUpperCase().startsWith(valor)
  );
  MostrarInsumosDos(mostrarFiltrado);
}

async function GrabarCabezaConTodosLosInsumos() {
  if (estado === "nuevo") {
    const data = await CRUDGrabaCabezaCompra(); // Graba la cabecera por primera Vez, se obtiene el
    codcompra = data.codcompra; // codcompra.
    alert(codcompra)
    //estado = "modifica";
  }
  GrabarInsumoPorInsumo();
}

function AgregarInsumoExistente(codinsumo, nombre, stock, fechavence) {
  let nuevo = {
    codinsumo: codinsumo,
    nombre: nombre,
    stock: stock,
    fechavence: fechavence,
  };
  ArrayInsumosExistentes.push(nuevo);
}

function TraerInsumosExistentes(data) {
  for (let i = 0; i < data.length; i++) {
    AgregarInsumoExistente(
      data[i].codinsumo,
      data[i].nombre,
      data[i].stock,
      data[i].fechavence
    );
  }
  MostrarInsumosDos(ArrayInsumosExistentes);
}

function Limpiar() {
  codigoinsumo.value = "";
  nombreinsumo.value = "";
  cantidadinsumo.value = "";
  fechavenceinsumo.value = "";
}

// esta opción la cabecera solo se modifica ya que es crea cuando se graba la primera vez insumo por insumo
function GrabayModificaDatosCabeza() {
  if (btnGrabaCabezaEntrega.innerHTML == "Grabar Cabecera") {
    btnGrabaCabezaEntrega.innerHTML = "Modificar Cabecera";
    Paneles4("none", "block", "block", "block");
    MostrarInsumos("insumos");
    if (estado === "modifica") {
      CRUDModificaCabezaCompra(); // graba directamente en la DB. es una modificacion ya existe.
    }
    CabeceraSoloLectura("SI");
    Deshabilita(true);
  } else {
    btnGrabaCabezaEntrega.innerHTML = "Grabar Cabecera";
    Paneles4("none", "block", "none", "none");
    CabeceraSoloLectura("NO");
    Deshabilita(false);
  }
}

function TraerDetallesComprasHechos(cadena) {
  fetch(url + cadena + codcompra)
    .then((response) => response.json())
    .then((data) => TraerDetallesComprasHechosDos(data))
    .catch((error) => console.log(error));
}

async function TraerDetallesComprasHechosDos(data) {
  for (let i = 0; i < data.length; i++) {
    let fecha = data[i].fechavence.substring(0, 10);
    SumarInsumoArrayRecepcion(
      data[i].codinsumo,
      data[i].nombre,
      fecha,
      data[i].cantidad,
      "E"
    );
  }
  DejarEnCeroCantidadAux();
  MostrarARecepcion(ArrayRecepcion);
}

function SumarInsumoArrayRecepcion(
  codinsumo,
  nombre,
  fechavence,
  cantidad,
  existe
) {
  let nuevo = {
    codinsumo: codinsumo,
    nombre: nombre,
    cantidad: cantidad,
    fechavence: fechavence,
    cantidadaux: cantidad,
    existe: existe,
  };
  ArrayRecepcion.push(nuevo);
}

function DejarEnCeroCantidadAux() {
  for (let i = 0; i < ArrayRecepcion.length; i++) {
    ArrayRecepcion[i].cantidadaux = 0;
    ArrayRecepcion[i].existe = "E";
  }
}

function GrabarInsumoPorInsumo() {
  let cantidad = 0;
  let cantidadaux = 0;
  let codinsumo = "";
  let fechavence = "";
  let stock = 0;
  let nombre = "";
  console.log(ArrayRecepcion);
  for (let i = 0; i < ArrayRecepcion.length; i++) {
    codinsumo = ArrayRecepcion[i].codinsumo;
    cantidad = ArrayRecepcion[i].cantidad;
    nombre = ArrayRecepcion[i].nombre;
    cantidadaux = ArrayRecepcion[i].cantidadaux;
    fechavence = ArrayRecepcion[i].fechavence;
    if (ArrayRecepcion[i].existe == "E") {
      // Si existe el INSUMO solo Agragar Cantidad
      if (cantidadaux != 0) {
        CRUDGrabaModificaRecepcion(codinsumo, cantidadaux);
        CRUDModificarTablaInsumos(codinsumo, fechavence, cantidadaux);
      }
    } else {
      CRUDGrabaInsumoNuevoEnRecepcion(codinsumo, fechavence, cantidad);
      if (ArrayRecepcion[i].existe == "N") {
        //Agregamos INSUMO en TABLA INSUMOS
        CRUDModificarTablaInsumos(codinsumo, fechavence, cantidadaux);
      } else {
        CRUDGrabaInsumoNuevoEnInsumos(codinsumo, nombre, fechavence, cantidad);
      }
    }
    stock = ArrayInsumosExistentes[i].stock;
    ArrayInsumosExistentes[i].stock = parseInt(stock) + parseInt(cantidadaux);
  }
  MostrarInsumos("insumos");
  CRUDModificaTotalInsumos();
  DejarEnCeroCantidadAux();
  MostrarARecepcion(ArrayRecepcion);
}

function AsignarFechaActual() {
  let fecha = new Date(); //Fecha actual
  let mes = fecha.getMonth() + 1; //obteniendo mes
  let dia = fecha.getDate(); //obteniendo dia
  let yea = fecha.getFullYear(); //obteniendo año
  if (dia < 10) {
    dia = "0" + dia;
  } //agrega cero si el menor de 10}
  if (mes < 10) {
    mes = "0" + mes;
  } //agrega cero si el menor de 10
  fechaRecepcion.value = yea + "-" + mes + "-" + dia;
}

function Valida() {
  let ok = "SI";
  if (fechaRecepcion.value == "") {
    fechaRecepcion.style.border = "solid 1px red";
    fechaRecepcion.focus();
    ok = "NO";
  } else {
    fechaRecepcion.style.border = "solid 1px lightskyblue";
  }
  if (numerofactura.value == "") {
    numerofactura.style.border = "solid 1px red";
    numerofactura.focus();
    ok = "NO";
  } else {
    numerofactura.style.border = "solid 1px lightskyblue";
  }
  if (numeroguia.value == "") {
    numeroguia.style.border = "solid 1px red";
    numeroguia.focus();
    ok = "NO";
  } else {
    numeroguia.style.border = "solid 1px lightskyblue";
  }
  if (selectProveedor.value == "") {
    selectProveedor.style.border = "solid 1px red";
    selectProveedor.focus();
    ok = "NO";
  } else {
    selectProveedor.style.border = "solid 1px lightskyblue";
  }
  return ok;
}

function ValidaDos() {
  let ok = "SI";
  if (codigoinsumo.value == "") {
    codigoinsumo.style.border = "solid 1px red";
    codigoinsumo.focus();
    ok = "NO";
  } else {
    codigoinsumo.style.border = "solid 1px lightskyblue";
  }
  if (nombreinsumo.value == "") {
    nombreinsumo.style.border = "solid 1px red";
    nombreinsumo.focus();
    ok = "NO";
  } else {
    nombreinsumo.style.border = "solid 1px lightskyblue";
  }
  if (fechavenceinsumo.value == "") {
    fechavenceinsumo.style.border = "solid 1px red";
    fechavenceinsumo.focus();
    ok = "NO";
  } else {
    fechavenceinsumo.style.border = "solid 1px lightskyblue";
  }
  if (cantidadinsumo.value == "" || cantidadinsumo.value == "0") {
    cantidadinsumo.style.border = "solid 1px red";
    cantidadinsumo.focus();
    ok = "NO";
  } else {
    cantidadinsumo.style.border = "solid 1px lightskyblue";
  }
  return ok;
}

function Paneles4(uno, dos, tres, cuatro) {
  panelEntregasListas.style.display = uno;
  panelCabezaEntrega.style.display = dos;
  panelLasDosTablas.style.display = tres;
  panelCabeceraTablas.style.display = cuatro;
}
