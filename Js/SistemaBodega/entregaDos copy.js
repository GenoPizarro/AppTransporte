//Definición de variables
const url = "http://localhost:3000/";
const tbodyInsumos = document.getElementById("tbodyInsumos");
const tbodyDetalle = document.getElementById("tbodyDetalle");
const buscarNombreProducto = document.querySelector("#buscarNombreProducto");
const btnCreaProducto = document.getElementById("btnCreaProducto");
const formProductos = document.querySelector("form");

const nombre = document.getElementById("nombre");
const stock = document.getElementById("stock");
const stockcritico = document.getElementById("stockcritico");
const fechavence = document.getElementById("fechavence");

const fechaEntrega = document.getElementById("fechaEntrega");
const selectSector = document.getElementById("selectSector");
const responsable = document.getElementById("responsable");

const fechaMuestra = document.getElementById("fechaMuestra");
const sectorMuestra = document.getElementById("sectorMuestra");
const responsableMuestra = document.getElementById("responsableMuestra");
const btnGrabaCabEntrega = document.getElementById("btnGrabaCabEntrega");
const btnModificaCabEntrega = document.getElementById("btnModificaCabEntrega");
const panelCabeza = document.getElementById("panelCabeza");
const panelMuestraCabeza = document.getElementById("panelMuestraCabeza");
const panelDetalle = document.getElementById("panelDetalle");
const btnGrabarDetalleAll = document.getElementById("btnGrabarDetalleAll");
const btnNuevaEntrega = document.getElementById("btnNuevaEntrega");
const PanelEntregaUno = document.getElementById("panelentregauno");
const PanelEntregaDos = document.getElementById("panelentregados");
const contenedor = document.querySelector("tbody");
const btnSalir = document.getElementById("btnSalir");

//Variables Globales
let opcion = "";
let codentrega = 0;
let cantidad = 0;
let codproducto = "";
let totalInsumosEntregados = 0;

//Secuencia para tener BOTONES EN LA FILAS DE CADA TABLA
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};


MostrarEntregas("entregacab");

btnSalir.addEventListener("click", () => {
  PanelEntregaUno.style.display = "block";
  PanelEntregaDos.style.display = "none";
    InicioEntregasDos();
});

btnNuevaEntrega.addEventListener("click", () => {
  PanelEntregaUno.style.display = "none";
  PanelEntregaDos.style.display = "block";
    InicioEntregasDos();
});

function MostrarEntregas(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarEntregasDos(data))
    .catch((error) => console.log(error));
}

const MostrarEntregasDos = (data) => {
  let resultados = "";
  let fecha = "";
  data.forEach((item) => {
    fecha = item.fecha.substring(0, 10);
    resultados += `<tr style="text-align: center;">
                    <td class="d-none">${item.codentrega}</td>
                    <td>${fecha}</td>
                    <td>${Sector(item.sector)}</td>
                    <td>${item.responsable}</td>
                    <td>${item.totalinsumos}</tdtyle=>
                    <td class="text-center"><a class="btnEditarEntrega btn btn-primary">Editar
                    <a class="btnBorrarEntrega btn btn-danger">Borrar</a></td>
                 </tr>`;
  });
  contenedor.innerHTML = resultados;
};

on(document, "click", ".btnEditarEntrega", (e) => {
   const fila = e.target.parentNode.parentNode;
   codentrega = fila.children[0].innerHTML;
   fechaMuestra.innerHTML = fila.children[1].innerHTML;
   sectorMuestra.innerHTML = fila.children[2].innerHTML;
   responsableMuestra.innerHTML = fila.children[3].innerHTML;
   totalInsumosEntregados = fila.children[4].innerHTML;
  MostrarPaneles2("none","block");
  MostrarProductos("productos");
  MostrarDetalleEntrega("entregadet/");
});

on(document, "click", ".btnBorrarEntrega", (e) => {
  const fila = e.target.parentNode.parentNode;
  codentrega = fila.firstElementChild.innerHTML;
  fetch(url +'entregacab/'+ codentrega, {
    method: "DELETE",
  })
  e.target.parentNode.parentNode.remove();
});

function MostrarPaneles2(uno, dos) {
  PanelEntregaUno.style.display = uno;
  PanelEntregaDos.style.display = dos;
  MostrarPaneles3("none", "flex", "block");
}

//****************************************************************
//****************************************************************
//*******************    ENTREGAS DOS    *************************
//****************************************************************
//****************************************************************
function InicioEntregasDos() {
  AsignarFechaActual();
  MostrarProductos("productos");
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
  let papa = dia + "-" + mes + "-" + yea;
  fechaEntrega.value = yea + "-" + mes + "-" + dia;
}

//BOTON GRABAR TODA LA ENTREGA
btnGrabarDetalleAll.addEventListener("click", (e) => {
  e.preventDefault();
  if (totalInsumosEntregados == 0) {
    alert("Debe Ingresar algun INSUMOS...! ");
  } else {

    GrabaEntregaAll();
  }
});
//*** BOTON GRABAR TODA LA ENTREGA

//BOTON GRABAR CABEZA
btnGrabaCabEntrega.addEventListener("click", (e) => {
  e.preventDefault();
  if (opcion == "") {
    opcion = "nuevo";
  }
  if (Valida() == "SI") {
    GrabayModificaCabeza();
    MostrarPaneles3("none", "flex", "flex");
    fechaMuestra.innerHTML = fechaEntrega.value;
    sectorMuestra.innerHTML = Sector(selectSector.value);
    responsableMuestra.innerHTML = responsable.value;
    MostrarDetalleEntrega("entregadet/");
  }
});
//*** FIN BOTON GRABAR CABEZA

//BOTON MODIFICA CABEZA
btnModificaCabEntrega.addEventListener("click", (e) => {
  e.preventDefault();
  if (Valida() == "SI") {
    opcion = "modifica";
    MostrarPaneles3("flex", "none", "none");
  }
});
//FIN BOTON MODIFICA CABEZA

function MostrarPaneles3(uno, dos, tres) {
  panelCabeza.style.display = uno;
  panelMuestraCabeza.style.display = dos;
  panelDetalle.style.display = tres;
}

//VALIDACION CABEZA
function Valida() {
  let ok = "SI";
  if (fechaEntrega.value == "") {
    fechaEntrega.focus();
    ok = "NO";
  }
  if (responsable.value == "") {
    responsable.focus();
    ok = "NO";
  }
  if (selectSector.value == "") {
    selectSector.focus();
    ok = "NO";
  }
  return ok;
}
//*** FIN VALIDACION CABEZA

//COLOR SECTORES
function Sector(letra) {
  let color = "";
  if (letra == "R") {
    color = "Rojo";
  }
  if (letra == "V") {
    color = "Verde";
  }
  if (letra == "A") {
    color = "Azul";
  }
  return color;
}
//*** FIN COLOR SECTORES

buscarNombreProducto.addEventListener("keydown", (e) => {
  const texto = buscarNombreProducto.value;
  if (e.keyCode == 13) {
    if (texto == "") {
      MostrarProductos("productos");
    } else {
      MostrarProductos("productocad/" + texto);
    }
  }
});

//BOTON FLECHA SUMAR Y RESTAR INSUMOS


on(document, "click", ".btnSumarInsumo", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode;
  codproducto = fila.children[1].innerHTML;
  const stock = fila.children[3].innerHTML;
  const cuerpo = tbodyDetalle;
  let esta = "NO";
  for (i = 0; i < cuerpo.childNodes.length; i++) {
    if (codproducto == cuerpo.children[i].children[1].innerHTML) {
      cantidad = cuerpo.children[i].children[3].innerHTML;
      esta = "SI";
    }
  }
  if (esta == "NO") {
    GrabaInsumoNuevo();
  } else {
    if (cantidad >= stock) {
      alert("No puede asignar mas del STOCK...");
    } else {
      FlechaSumaUno();
    }
  }
});
//*** FIN BOTON FLECHA SUMAR INSUMOS

on(document, "click", ".btnRestarInsumo", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode;
  codproducto = fila.children[1].innerHTML;
  const cuerpo = tbodyDetalle;
  for (i = 0; i < cuerpo.childNodes.length; i++) {
    if (codproducto == cuerpo.children[i].children[1].innerHTML) {
      cantidad = cuerpo.children[i].children[3].innerHTML;
    }
  }
  if (cantidad == 1) {
    BorraElInsumo(e);
  } else {
    FlechaRestaUno();
  }
});
//*** FIN BOTON FLECHA SUMAR INSUMOS

// MOSTRAR TODOS LOS INSUMOS EXISTENTES
function MostrarProductos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarProductosDos(data))
    .catch((error) => console.log(error));
}

const MostrarProductosDos = (data) => {
  let resultados = "";
  let fecha = "";
  data.forEach((item) => {
    fecha = item.fechavence.substring(0, 10);
    resultados += `<tr style="height: 30px;font-size:xlarge;">
            <td class="d-none">${item.id}</td>
            <td style="width: 10%;">${item.codproducto}</td>
            <td>${item.nombre}</td>
            <td style="color: red;">${item.stock}</td>
            <td style="width: 20%;">${fecha}</td>
            <td class="text-center">
            <a class="btnSumarInsumo btn btn-primary">>>></a></td>
            </tr>`;
  });
  tbodyInsumos.innerHTML = resultados;
};
//*** FIN MOSTRAR TODOS LOS INSUMOS EXISTENTES

//GRABA Y MODIFICA CABEZA ENTREGA
function GrabayModificaCabeza() {
  if (opcion == "nuevo") {
    fetch(url + "entregacab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: fechaEntrega.value,
        sector: selectSector.value,
        responsable: responsable.value,
        totalinsumos: totalInsumosEntregados,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        codentrega = data.id;
      });
  }
  if (opcion == "modifica") {
    fetch(url + "entregacab/" + codentrega, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fechaentrega: fechaEntrega.value,
        sector: selectSector.value,
        responsable: responsable.value,
      }),
    });
  }
}
//*** FIN GRABA Y MODIFICA CABEZA ENTREGA

// GRABA INSUMO NUEVO A ENTREGAR
function GrabaInsumoNuevo() {
  fetch(url + "entregadet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codentrega: codentrega, //codproducto.value,
      codproducto: codproducto,
      cantidad: 1,
      estado: "X", //fechavence.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const nuevoDetalle = [];
      nuevoDetalle.push(data);
      MostrarDetalleEntrega("entregadet/");
    });
}
//*** FIN GRABA INSUMO NUEVO A ENTREGAR

//FLECHA SUMA INSUMO A ENTREGAR
function FlechaSumaUno() {
  fetch(url + "entregadetsum", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codentrega: codentrega, //codproducto.value,
      codproducto: codproducto,
      cantidad: cantidad,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const nuevoDetalle = [];
      nuevoDetalle.push(data);
      MostrarDetalleEntrega("entregadet/");
    });
  totalInsumosEntregados++;
}
//*** FIN FLECHA SUMA INSUMO A ENTREGAR

// MOSTRAR INSUMOS ENTREGADOS
function MostrarDetalleEntrega(cadena) {
  fetch(url + cadena + codentrega)
    .then((response) => response.json())
    .then((data) => MostrarDetalleEntregaDos(data))
    .catch((error) => console.log(error));
}

const MostrarDetalleEntregaDos = (data) => {
  let resultados = "";
  let total = 0;
  data.forEach((item) => {
    console.log(data);
    resultados += `<tr style="height: 30px;font-size:large;">
          <td class="d-none">${item.codentrega}</td>
          <td>${item.codproducto}</td>
          <td style="width: 10%;">${item.nomproducto}</td>
          <td>${item.cantidad}</td>
          <td class="text-center"><a class="btnRestarInsumo btn btn-primary">+</a></td>
       </tr>`;
    total = total + item.cantidad;
  });
  document.getElementById('totalInsumosEntregados').innerHTML = total;
  tbodyDetalle.innerHTML = resultados;
};
//*** FIN MOSTRAR INSUMOS ENTREGADOS

function FlechaRestaUno() {
  fetch(url + "entregadetres", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codentrega: codentrega, //codproducto.value,
      codproducto: codproducto,
      cantidad: cantidad,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const nuevoDetalle = [];
      nuevoDetalle.push(data);
      MostrarDetalleEntrega("entregadet/");
    });
}

function BorraElInsumo(e) {
  fetch(url + "entregadet", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codentrega: codentrega,
      codproducto: codproducto,
    }),
  });
  e.target.parentNode.parentNode.remove();
}

function GrabaEntregaAll() {
  fetch(url + "entregadetx", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codentrega: codentrega, //codproducto.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const nuevoDetalle = [];
      nuevoDetalle.push(data);
    });
}

function GrabaTotalInsumos() {
  fetch(url + "entregacabtot", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codentrega: codentrega, //codproducto.value,
      totalinsumos: totalInsumosEntregados,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const nuevoDetalle = [];
      nuevoDetalle.push(data);
      MostrarDetalleEntrega("entregadet/");
    });
}
