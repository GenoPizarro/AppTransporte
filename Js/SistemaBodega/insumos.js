import { urlGlobal } from "./Globales.js"
import { AsignarFechaActual } from "./Globales.js"
import { Valida } from "./Globales.js"
import { on } from "./Globales.js"

const url = urlGlobal;
//const url = "http://localhost:3000/";
const contenedor = document.querySelector("tbody");
const tbodyInsumos = document.getElementById("tbodyInsumos");
const buscarNombreInsumo = document.querySelector("#buscarNombreInsumo");
const cuantos = document.getElementById("cuantos");
const modalInsumos = new bootstrap.Modal(
  document.getElementById("modalInsumos")
);
const btnCreaProducto = document.getElementById("btnCreaProducto");
const btnGrabarProducto = document.getElementById("btnGrabarProducto");
const formProductos = document.querySelector("form");
const codinsumo = document.getElementById("codinsumo");
const nombre = document.getElementById("nombre");
const stock = document.getElementById("stock");
const stockcritico = document.getElementById("stockcritico");
const fechavence = document.getElementById("fechavence");
const fechavenceAux = document.getElementById("fechavenceAux");
//const btnLimpiaBuscarNombre = document.getElementById("btnLimpiaBuscarNombre");
//const chkcritico = document.getElementById("chkcritico");
const ordenstock = document.getElementById("ordenstock");
const ordennombre = document.getElementById("ordennombre");
const ordenfecha = document.getElementById("ordenfecha");
const totalinsumos = document.getElementById("totalinsumos");

// VARIABLES GLOBALES
let opcion = "Nuevo";
let idForm = 0;
let ArrayInsumosExistentes = [];

// INICIO DE PAGINA - INICIO DE PAGINA
Inicio();

function Inicio() {
  MostrarInsumos("insumos");
  //OrdenPorFecha();
}


// **********************************************************
// BOTONES - BOTONES - BOTONES - BOTONES - BOTONES - BOTONES
// **********************************************************

on(document, "click", ".btnEditarProducto", (e) => {
  e.preventDefault();
  opcion = "editar";
  const fila = e.target.parentNode.parentNode;
  idForm = fila.children[0].innerHTML;
  const codinsumoForm = fila.children[1].innerHTML;
  const nombreForm = fila.children[2].innerHTML;
  const stockForm = fila.children[6].innerHTML;
  const fechavenceForm = fila.children[4].innerHTML;
  //fechavenceAux = fila.children[4].innerHTML;
  codinsumo.value = codinsumoForm;
  nombre.value = nombreForm;
  stock.value = stockForm;
  fechavence.value = fechavenceForm;
  modalInsumos.show();
});

on(document, "click", ".btnBorrarProducto", (e) => {
  var respuesta = confirm("Esta seguro de Borrar este INSUMO...?");
  if (respuesta) {
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;
    fetch(url + "insumos/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => location.reload());
  }
});

btnCreaProducto.addEventListener("click", (e) => {
  e.preventDefault();
  nombre.value = "";
  stock.value = "";
  opcion = "Nuevo";
  let maxValue = Math.max(...ArrayInsumosExistentes.map(x => parseInt(x.codinsumo)))
  codinsumo.value = maxValue + 1;
  modalInsumos.show();
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

ordennombre.addEventListener("change", () => {
  if (ordennombre.checked == true) {
    ordenstock.checked = false;
    ordenfecha.checked = false;
    let ArrayOrdenNombre = ArrayInsumosExistentes.sort((x, y) => x.nombre.localeCompare(y.nombre));
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenNombre);
  }
});

ordenstock.addEventListener("change", () => {
  if (ordenstock.checked == true) {
    ordennombre.checked = false;
    ordenfecha.checked = false;
    let ArrayOrdenStock = ArrayInsumosExistentes.sort((x, y) => x.stock - y.stock);
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenStock);
  }
});

ordenfecha.addEventListener("change", () => {
  if (ordenfecha.checked == true) {
    ordennombre.checked = false;
    ordenstock.checked = false;
    let ArrayOrdenFecha = ArrayInsumosExistentes.sort((x, y) => x.stockdias - y.stockdias);
    //console.log(ArrayOrdenStock)
    MostrarInsumosDos(ArrayOrdenFecha);
  }
});

function OrdenPorFecha() {
  let ArrayOrdenFecha = ArrayInsumosExistentes.sort((x, y) => x.stockdias - y.stockdias);
  //console.log(ArrayOrdenStock)
  MostrarInsumosDos(ArrayOrdenFecha);
}

function OrdenPorCodigo() {
  let ArrayOrdenCodigo = ArrayInsumosExistentes.sort((x, y) => x.codinsumo - y.codinsumo);
  MostrarInsumosDos(ArrayOrdenCodigo);
}

function BuscarInsumoEnTablaInsumos(codinsumo) {
  let indice = -1;
  let Array = ArrayInsumosExistentes.find((insumos) => insumos.codinsumo === codinsumo.value)
  alert(Array.fechavence);
  return indice;
}

codinsumo.addEventListener("keydown", (e) => {
  let indice = -1
  const codinsumo2 = codinsumo.value;
  if (e.keyCode == 13 || e.keyCode == 9) {
    indice = BuscarInsumoEnTablaInsumos(codinsumo2);
    if (indice == -1) {
      // NO EXISTE en tabla INSUMOS
      nombre.value = "";
      nombre.focus();
      fechavence.value = "";
      stock.value = "";
    } else {
      // SI EXISTE en tabla INSUMOS
      opcion = "editar";
      idForm = ArrayInsumosExistentes[indice].id;
      nombre.value = ArrayInsumosExistentes[indice].nombre;
      stock.value = ArrayInsumosExistentes[indice].stock;
      fechavence.value = ArrayInsumosExistentes[indice].fechavence.substring(0, 10);
      fechavence.focus();
    }
  }
  MostrarInsumosDos(ArrayInsumosExistentes);
});

function AgregarInsumoExistente(id, codinsumo, nombre, stock, fechavence, stockdias) {
  let nuevo = {
    id: id,
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
  let dias, stockdias = 0;
  let critico = "";
  for (let i = 0; i < data.length; i++) {
    fechaInsumo = data[i].fechavence.substring(0, 10);
    dias = Date.parse(fechaInsumo) - Date.parse(fechaHoy);
    stockdias = dias / (1000 * 60 * 60 * 24);
    if (stockdias < 0) {
      stockdias = stockdias * -1
    }
    AgregarInsumoExistente(
      data[i].id,
      data[i].codinsumo,
      data[i].nombre,
      data[i].stock,
      data[i].fechavence,
      stockdias
    )
  }
  let ArrayOrdenStock = ArrayInsumosExistentes.sort((x, y) => x.stockdias - y.stockdias);
  MostrarInsumosDos(ArrayInsumosExistentes);
}

// **********************************************************
// MOSTRAR TABLAS - MOSTRAR TABLAS - MOSTRAR TABLAS
// **********************************************************
function MostrarInsumos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => {
      return TraerInsumosExistentes(data)
    })
    .catch((error) => console.log(error));
}

const MostrarInsumosDos = (arreglo) => {
  let resultados = "";
  let fecha = "";
  let suma = 0;
  let color = "";
  arreglo.forEach((item) => {
    fecha = item.fechavence.substring(0, 10);
    if (item.stockdias < 60) {
      color = "red"
    } else {
      color = "black"
    }
    resultados += `<tr style="height: 30px;font-size:xlarge;color:` + color + `;">
                    <td class="codinterno d-none">${item.id}</td>
                    <td>${item.codinsumo}</td>
                    <td style="width: 47%;">${item.nombre}</td>
                    <td class="stockUno"> <div class="stockDos">${item.stock}</div></td>
                    <td style="width: 10%">${fecha}</td>
                    <td style="text-align: right;width: 0%">${item.stockdias}</td>
                    <td class="d-none">${item.stock}</td>
                    <td class="text-center">
                      <a class="btnEditarProducto btn btn-outline-primary">Editar</a>
                      <a class="btnBorrarProducto btn btn-outline-danger">Borrar</a>
                    </td>
                 </tr>`;
    suma = suma + item.stock;
  });
  totalinsumos.innerHTML = suma;
  tbodyInsumos.innerHTML = resultados;
};

btnGrabarProducto.addEventListener('click', () => {
  let esta = "NO";
  if (Valida(codinsumo, nombre, fechavence, stock) == "SI") {
    ArrayInsumosExistentes.forEach((item) => {
      if (item.codinsumo == codinsumo.value) {
        if (item.fechavence.substring(0, 10) === fechavence.value) {
          //alert(item.fechavence.substring(0,10))
          esta = "SI"
        }
      }
    })


    if (esta == "SI") {
      CRUDModificarInsumo()
    } else {
      confirmFunction();
      //CRUDSumaInsumo();
    }
  }
  //MostrarInsumos("insumos");
})


function confirmFunction() {
  swal({
    title: "Confirmar Accion",
    //text: "Se realizara la accion correspondiente",
    showCancelButton: true,
    confirmButtonColor: '#f7505a',
    cancelButtonColor: '#f7505a',
    confirmButtonText: "Nuevo Insumo",
    cancelButtonText: "Modifica Insumo"
  }).then(resultado => {
    if (resultado.value) {
      CRUDSumaInsumo();
    } else {
      CRUDModificarInsumo()
    }
  })
}

function CRUDSumaInsumo() {
  fetch(url + 'insumos', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codinsumo: codinsumo.value,
      codfamilia: 1,
      nombre: nombre.value,
      stock: stock.value,
      stockcritico: 5, //stockcritico.value,
      valor: 0,
      fechavence: fechavence.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const nuevoInsumo = [];
      nuevoInsumo.push(data);
      modalInsumos.hide();
    })
    .then((data) => location.reload());
};


function CRUDModificarInsumo() {
  fetch(url + "insumos/" + idForm, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codinsumo: codinsumo.value,
      nombre: nombre.value,
      stock: stock.value,
      fechavence: fechavence.value,
    }),
  })
    .then((response) => response.json())
    .then((response) => location.reload());
  modalInsumos.hide();
};
