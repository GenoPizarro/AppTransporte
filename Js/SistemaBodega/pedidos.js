import {urlGlobal} from "./Globales.js"
import {AsignarFechaActual} from "./Globales.js"
const url = urlGlobal;
//const url = "http://localhost:3000/";
const panelPedidosHechos = document.getElementById("panelPedidosHechos");
const panelCabezaEntrega = document.getElementById("panelCabezaEntrega");
const panelInsumosExistente = document.getElementById("panelInsumosExistente");
const panelPedidoNuevo = document.getElementById("panelPedidoNuevo");
const panelCabeceraTablas = document.getElementById("panelCabeceraTablas");
const tbodyPedidosHechos = document.getElementById("tbodyPedidosHechos");
const buscarNombreInsumo = document.querySelector("#buscarNombreInsumo");
const tbodyInsumos = document.getElementById("tbodyInsumos");
const tbodyPedidoNuevo = document.getElementById("tbodyPedidoNuevo");
const btnGrabaEntregaTotal = document.getElementById("btnGrabaEntregaTotal");
const fechaEntrega = document.getElementById("fechaEntrega");
const selectSector = document.getElementById("selectSector");
const responsable = document.getElementById("responsable");
const btnSalirCabeza = document.getElementById("btnSalirCabeza");
const btnNuevoPedido = document.getElementById("btnNuevoPedido");
const btnVerPedido = document.getElementById("btnVerPedido");
const btnAgregarInsumo = document.getElementById("btnAgregarInsumo");
const btnGrabaCabezaPedido = document.getElementById("btnGrabaCabezaPedido");
const btnImprimir = document.getElementById("btnImprimir");
const totalInsumosEntregados = document.getElementById(
  "totalInsumosEntregados"
);
const numeroInsumosEntregados = document.getElementById(
  "numeroInsumosEntregados"
);

// VAriables Globales
let resultadoGLOBAL = "";
let ArrayInsumosExistentes = [];
let ArrayPedidoNuevo = [];
let estado = "";

// INICIO DE LA PAGINA
MostrarPedidosHechos("pedidocab");

// ****************************************************
// BOTONES BOTONES BOTONES BOTONES BOTONES BOTONES
// ****************************************************
// const on = (element, event, selector, handler) => {
//   element.addEventListener(event, (e) => {
//     if (e.target.closest(selector)) {
//       handler(e);
//     }
//   });
// };

// on(document, "click", ".btnSumarInsumo", (e) => {
//   e.preventDefault();
//   const insumos = e.target.parentNode.parentNode; //Tabla INSUMOS
//   const codinsumo = insumos.children[0].innerHTML;
//   const nombre = insumos.children[1].innerHTML;

//   ArrayInsumosExistentes.map(function (insumo) {
//     if (insumo.codinsumo == codinsumo) {
//       insumo.cantidad = parseInt(insumo.cantidad) + 1
//     }
//   })

//   let elemento = ArrayPedidoNuevo.find((insumos) => insumos.codinsumo === codinsumo);
//   if (elemento == undefined) {
//     // NO EXISTE en tabla INSUMOS
//     AgregarPedidoNuevo(codinsumo, nombre, 1);
//   } else {
//     // SI EXISTE en tabla INSUMOS
//     elemento.cantidad = elemento.cantidad + 1;
//   }
//   MostrarInsumosDos(ArrayInsumosExistentes);
// });


// function OrdenaPorCantidad() {
//   let ArrayOrdenCantidad = ArrayInsumosExistentes.sort((x, y) => x.cantidad - y.cantidad);
//   MostrarInsumosDos(ArrayOrdenCantidad);
// };

// on(document, "click", ".btnRestarInsumo", (e) => {
//   e.preventDefault();
//   const pedido = e.target.parentNode.parentNode; //Tabla pedido
//   const codinsumo = pedido.children[0].innerHTML;

//   ArrayPedidoNuevo.map(function (pedido) {
//     if (pedido.codinsumo == codinsumo) {
//       if (pedido.cantidad == 1) {
//         let respuesta = confirm("Desea Eliminar el Insumo...?");
//         if (respuesta) {
//           //pedido.cantidad = parseInt(pedido.cantidad) - 1
//         }
//       } else {
//         pedido.cantidad = parseInt(pedido.cantidad) - 1
//       }
//     }
//   })

//   let elemento = ArrayInsumosExistentes.find((insumos) => insumos.codinsumo === codinsumo);
//   if (elemento.cantidad < 0) {
//     elemento.cantidad = 0;
//   } else {
//     elemento.cantidad = elemento.cantidad - 1;
//   }
//   MostrarPedidoNuevo(ArrayPedidoNuevo);
//   MostrarInsumosDos(ArrayInsumosExistentes);
// });


// buscarNombreInsumo.addEventListener("input", (e) => {
//   MostrarMostrar(e.target.value.toUpperCase().trim());
// });

// function MostrarMostrar(valor) {
//   const mostrarFiltrado = ArrayInsumosExistentes.filter((insumos) =>
//     insumos.nombre.toUpperCase().startsWith(valor)
//   );
//   MostrarInsumosDos(mostrarFiltrado);
// }

// btnSalirCabeza.addEventListener("click", (e) => {
//   const btn = btnGrabaEntregaTotal.style.display;
//   if (btn == "block") {
//     var respuesta = confirm("Existen datos sin Grabar, desea salir...?");
//     if (respuesta) {
//       Paneles4("block", "none", "none", "none");
//       Deshabilita(false);
//       location.reload();
//     }
//   } else {
//     Paneles4("block", "none", "none", "none");
//     //Limpiar();
//     Deshabilita(false);
//     location.reload();
//   }
// });

btnNuevoPedido.addEventListener("click", (e) => {
  AsignarFechaActual();
  Paneles4("none", "block", "none", "none");
  estado = "Nuevo";
});

// btnVerPedido.addEventListener("click", (e) => {
//   Paneles4("none", "block", "none", "none", "block");
//   MostrarPedidoNuevo(ArrayPedidoNuevo);
// });

// btnAgregarInsumo.addEventListener("click", (e) => {
//   Paneles4("none", "block", "block", "block", "none");
//   //MostrarPedidoNuevo(ArrayPedidoNuevo);
// });

btnGrabaCabezaPedido.addEventListener("click", (e) => {
  e.preventDefault();
  if (Valida() == "SI") {
    GrabayModificaDatosCabeza();
  }
});

// async function GrabarCabezaConInsumos() {
//   const datitos = await CRUDGrabaCabezaEntrega();
//   codentrega = datitos.id;
//   //GrabarInsumoPorInsumo();
// }

// btnGrabaEntregaTotal.addEventListener("click", () => {
//   if (estado == "Nuevo") {
//     // Graba la Cabecera si es una entrega nueva, con el total de insumos
//     GrabarCabezaConInsumos();
//   } else {
//     // Solo graba en la Cabecera el total de insumos
//     CRUDModificaTotalInsumos(0);
//     if (codentrega > 0) {
//       GrabarInsumoPorInsumo();
//     }
//   }
//   //DejarEnCeroCantidadAux();
//   //MostrarPedidoNuevo(ArrayPedidoNuevo);
//   //MostrarInsumosDos(ArrayInsumosExistentes);
//   btnGrabaEntregaTotal.style.display = "none";
// });

// btnImprimir.addEventListener("click", () => {
//   imprimirElemento();
// })

// ****************************************************
// MOSTRAR TABLAS --- MOSTRAR TABLAS --- MOSTRAR TABLAS
// ****************************************************
function CabeceraSoloLectura(ok) {
  let cursor = ""
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
function MostrarPedidosHechos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarPedidosHechosDos(data))
    .catch((error) => console.log(error));
}

const MostrarPedidosHechosDos = (data) => {
  console.log(data);
  let resultados = "";
  let fecha = "10/10/2023";
  data.forEach((item) => {
    //fecha = item.fecha.substring(0, 10);
    resultados += `<tr style="text-align: center;">
                    <td class="d-none">${item.codpedido}</td>
                    <td>${fecha}</td>
                    <td>${SectorColor(item.sector)}</td>
                    <td>${item.responsable}</td>
                    <td>${item.totalinsumos}</tdtyle=>
                    <td class="text-center"><a class="btnEditarEntregaHecha btn btn-primary">Editar
                    <a class="btnBorrarEntregaHecha btn btn-danger">Borrar</a></td>
                 </tr>`;
  });
  tbodyPedidosHechos.innerHTML = resultados;
};

// TABLAS INSUMOS EXISTENTES
function MostrarInsumos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => TraerInsumosExistentes(data))
    .catch((error) => console.log(error));
}

function AgregarPedido(codinsumo, nombre, cantidad) {
  let nuevo = {
    codinsumo: codinsumo,
    nombre: nombre,
    cantidad: cantidad,
  };
  ArrayPedidoNuevo.push(nuevo);
}

function AgregarInsumosExistente(codinsumo, nombre, cantidad) {
  let nuevo = {
    codinsumo: codinsumo,
    nombre: nombre,
    cantidad: cantidad,
  };
  ArrayInsumosExistentes.push(nuevo);
}

function TraerInsumosExistentes(data) {
  for (let i = 0; i < data.length; i++) {
    AgregarInsumosExistente(
      data[i].codinsumo,
      data[i].nombre,
      0,
    );
  }
  MostrarInsumosDos(ArrayInsumosExistentes);
}

const MostrarInsumosDos = (array) => {
  let resultados = "";
  let color = "red";
  let indice = 0;
  array.forEach((item) => {
    if (item.cantidad > 0) {
      color = "red";
    } else {
      color = "black";
    }
    resultados +=
      `<tr style="height: 30px;font-size:xlarge;color:` +
      color +
      `;">
            <td style="width: 100px;" class="d-none">${item.codinsumo}</td>
            <td style="width: 290px;">${item.nombre}</td>
            <td style="width: 40px;">${item.cantidad}</td>
            <td class="d-none">${indice}</td>
            <td class="text-center" style="display:block">
            <a class="btnSumarInsumo btn btn-outline-primary" style="cursor:pointer">+</a></td>
       </tr>`;
    indice = indice + 1;
  });
  tbodyInsumos.innerHTML = resultados;
};

// TABLAS INSUMOS A ENTREGAR
const MostrarPedidoNuevo = (data) => {
  let total = 0;
  let contador = 0;
  let mostrar = "NO";
  resultadoGLOBAL = "";
  //let resultados = "";
  data.forEach((item) => {
    resultadoGLOBAL += `<tr>
            <td class="d-none">${item.codinsumo}</td>
            <td style="width: 250px;">${item.nombre}</td>
            <td style="color: red;width:40px;">${item.cantidad}</td>
            <td class="d-none">${contador}</td>
            <td class="text-center">
              <a class="btnSumarDer btn btn-outline-primary btn-sm" style="cursor:pointer">+</a>
              <a class="btnRestarInsumo btn btn-outline-danger btn-sm" style="cursor:pointer">--</a>
            </td>
            </tr>`;
    total = total + item.cantidad; //Se utiliza en Total Insumos entregados
    contador = contador + 1; //Se utiliza en Tipo de Insumos entregados
  });
  tbodyPedidoNuevo.innerHTML = resultadoGLOBAL;
};


// function imprimirElemento(elemento) {
//   const nombre = ArrayPedidoNuevo[0].nombre
//   let indice = 0;
//   var ventana = window.open('', 'PRINT', 'height=400,width=600');
//   ventana.document.write('<html><head><title>' + document.title + '</title>');
//   ventana.document.write('</head><body>');
//   for (let i = 0; i < 10; i++) {
//     let nombre = ArrayPedidoNuevo[indice].nombre
//     let cantidad = ArrayPedidoNuevo[indice].cantidad
//     ventana.document.write('<p>' + nombre + '........' + cantidad + '</p>');
//     indice = indice + 1
//   }
//   ventana.document.write('</body></html>');
//   ventana.document.close();
//   ventana.focus();
//   ventana.print();
//   ventana.close();
// }

// ****************************************************
// CRUD - CRUD - CRUD - CRUD -CRUD - CRUD - CRUD - CRUD
// ****************************************************
// async function CRUDSumaRestaEnTablaInsumos(codinsumo, stock, valor) {
//   try {
//     await fetch(url + "insumosr/" + codinsumo, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         stock: parseInt(stock) + valor,
//       }),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// function CRUDCabezaPedidoNuevo (cantidad, fecha,sector,responsable,totalinsumos,estado,observacion) {
//   try {
//       fetch(url + "pedidocab", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         cantidad: cantidad,
//         fecha: fecha,
//         sector: sector,
//         responsable: responsable,
//         totalinsumos: totalinsumos,
//         estado: estado,
//         observacion: observacion,
//       }),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// function CRUDCabezaPedidoModifica (cantidad, fecha,sector,responsable,totalinsumos,estado,observacion) {
//   try {
//       fetch(url + "pedidocab/" + codpedido, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         codpedido: codpedido,
//         cantidad: cantidad,
//         fecha: fecha,
//         sector: sector,
//         responsable: responsable,
//         totalinsumos: totalinsumos,
//         estado: estado,
//         observacion: observacion,
//       }),
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// *****************************************************
// OTROS - OTROS - OTROS - OTROS - OTROS - OTROS - OTROS
// *****************************************************
function GrabayModificaDatosCabeza() {
  if (btnGrabaCabezaPedido.innerHTML == "Grabar Cabecera") {
    btnGrabaCabezaPedido.innerHTML = "Modificar Cabecera";
    Paneles4("none", "block", "block", "block");
    MostrarInsumos("pedidos");
    Deshabilita(true);
    if (estado == "Modifica") {
      CRUDModificaCabezaEntrega(); // graba directamente en la DB. es una modificacion ya existe.
    }
    CabeceraSoloLectura("SI");
  } else {
    btnGrabaCabezaPedido.innerHTML = "Grabar Cabecera";
    Paneles4("none", "block", "none", "none");
    Deshabilita(false);
    CabeceraSoloLectura("NO");
  }
}

// function TraerDetallesHechos(cadena, codentrega) {
//   const cantidadaux = 0;
//   fetch(url + cadena + codentrega)
//     .then((response) => response.json())
//     .then((data) => {
//       for (i = 0; i < data.length; i++) {
//         AgregarInsumosExistente(
//           data[i].codinsumo,
//           data[i].nombre,
//           data[i].cantidad,
//         );
//       }
//       MostrarInsumos(ArrayPedidoNuevo);
//     });
// }

// function AgregarPedidoNuevo(codinsumo, nombre, cantidad,) {
//   let nuevo = {
//     codinsumo: codinsumo,
//     nombre: nombre,
//     cantidad: cantidad,
//   };
//   ArrayPedidoNuevo.push(nuevo);
// }

// function DejarEnCeroCantidadAux() {
//   for (i = 0; i < ArrayPedidoNuevo.length; i++) {
//     ArrayPedidoNuevo[i].cantidadaux = 0;
//   }
// }

// function GrabarInsumoPorInsumo() {
//   let cantidad = 0;
//   let cantidadaux = 0;
//   let fechavence = "";
//   if (estado == "Modifica") {
//     for (i = 0; i < ArrayPedidoNuevo.length; i++) {
//       cantidadaux = ArrayPedidoNuevo[i].cantidadaux;
//       if (cantidadaux != 0) {
//         codinsumo = ArrayPedidoNuevo[i].codinsumo;
//         cantidad = ArrayPedidoNuevo[i].cantidad;
//         fechavence = ArrayPedidoNuevo[i].fechavence;
//         if (ArrayPedidoNuevo[i].existe == "E") {
//           CRUDGrabaModificaInsumoEntregado(codinsumo, cantidad, fechavence);
//         } else {
//           CRUDGrabaInsumoNuevo(codinsumo, cantidad, fechavence);
//         }
//         CRUDSumaRestaEnTablaInsumos(codinsumo, cantidadaux, 0);
//       }
//     }
//   } else {
//     for (i = 0; i < ArrayPedidoNuevo.length; i++) {
//       codinsumo = ArrayPedidoNuevo[i].codinsumo;
//       cantidad = ArrayPedidoNuevo[i].cantidad;
//       fechavence = ArrayPedidoNuevo[i].fechavence;
//       CRUDGrabaInsumoNuevo(codinsumo, cantidad, fechavence);
//       CRUDSumaRestaEnTablaInsumos(codinsumo, cantidad, 0);
//     }
//   }
// }

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

// function Valida() {
//   let ok = "SI";
//   if (fechaEntrega.value == "") {
//     fechaEntrega.style.border = "solid 1px red";
//     fechaEntrega.focus();
//     ok = "NO";
//   } else {
//     fechaEntrega.style.border = "solid 1px lightskyblue";
//   }
//   if (responsable.value == "") {
//     responsable.style.border = "solid 1px red";
//     responsable.focus();
//     ok = "NO";
//   } else {
//     responsable.style.border = "solid 1px lightskyblue";
//   }
//   if (selectSector.value == "") {
//     selectSector.style.border = "solid 1px red";
//     selectSector.focus();
//     ok = "NO";
//   } else {
//     selectSector.style.border = "solid 1px lightskyblue";
//   }
//   return ok;
// }

// function SectorLetra(color) {
//   let letra = "";
//   if (color == "Rojo") {
//     letra = "R";
//   } else {
//     if (color == "Verde") {
//       letra = "V";
//     } else {
//       if (color == "Azul") {
//         letra = "A";
//       }
//     }
//   }
//   return letra;
// }

function Paneles4(uno, dos, tres, cuatro, cinco) {
  panelPedidosHechos.style.display = uno;
  panelCabezaEntrega.style.display = dos;
  panelInsumosExistente.style.display = tres;
  panelCabeceraTablas.style.display = cuatro;
  panelPedidoNuevo.style.display = cinco;
}

function Deshabilita(ok) {
  fechaEntrega.disabled = ok;
  selectSector.disabled = ok;
  responsable.disabled = ok;
}
