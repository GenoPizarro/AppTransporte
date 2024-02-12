//Definición de variables
const url = "http://192.168.1.77:3000/";
const tbodyInsumos = document.getElementById("tbodyInsumos");
const tbodyEntrega = document.getElementById("tbodyEntrega");
const btnGrabaEntregaAll = document.getElementById("btnGrabaEntregaAll");
const btnSalir = document.getElementById("btnSalir");

//VAriables Globales
let opcion = "";
let idForm = 0;
let codentrega = 1;
let AEntregar = [];
let vecesgrabadas = 0;
let stockfijo = 0;

//*****************************************************************
//**************   PARTES 2 TABLAS EN PANTALLA
//*****************************************************************
//MostrarProductos("productos");

function MostrarProductos(cadena) {
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarProductosDos(data))
    .catch((error) => console.log(error));
}

const MostrarProductosDos = (data) => {
  let resultados = "";
  let fecha = "";
  let color = "red";
  data.forEach((item) => {
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
            <td style="width: 100px;">${item.codproducto}</td>
            <td style="width: 420px;">${item.nombre}</td>
            <td style="color:` +
      color +
      `;width:40px;">${item.stock}</td>
            <td style="width: 100px;">${fecha}</td>
            <td class="text-center">
            <a class="btnSumarIzq btn btn-outline-primary">>>></a></td>
            </tr>`;
  });
  tbodyInsumos.innerHTML = resultados;
};

//Secuencia para tener BOTONES EN LA FILAS DE CADA TABLA
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

on(document, "click", ".btnSumarIzq", (e) => {
  e.preventDefault();
  const fila = e.target.parentNode.parentNode; //Tabla INSUMOS
  const codproducto = fila.children[0].innerHTML;
  const nombre = fila.children[1].innerHTML;
  let stock = fila.children[2].innerHTML - 1;
  stockfijo = fila.children[2].innerHTML;
  const cuerpo = tbodyEntrega; //Tabla ENTREGA
  let esta = "NO";
  let cantidad = 0;
  for (i = 0; i < cuerpo.childNodes.length; i++) {
    if (codproducto == cuerpo.children[i].children[1].innerHTML) {
      cantidad = cuerpo.children[i].children[3].innerHTML;
      stock = cuerpo.children[i].children[0].innerHTML;
      esta = "SI";
    }
  }
  if (esta == "NO") {
    if (stock > 0) {
      AgregarInsumoNuevo(stock, codproducto, nombre, 1);
    } else {
      alert("Stock en 0...!");
    }
  } else {
    const elemento = AEntregar.find(
      (insumos) => insumos.codproducto === codproducto
    );
    if (elemento.cantidad == stockfijo) {
      alert("No hay mas en STOCK...");
    } else {
      elemento.cantidad = parseInt(cantidad) + 1;
      elemento.stock = parseInt(stock) - 1;
    }
  }
  btnGrabaEntregaAll.style.display = "block";
  MostrarAEntregar(AEntregar);
});

function AgregarInsumoNuevo(stock, codproducto, nombre, cantidad) {
  let nuevo = {
    stock: stock,
    codproducto: codproducto,
    nombre: nombre,
    cantidad: cantidad,
  };
  AEntregar.push(nuevo);
}

on(document, "click", ".btnSumarDer", (e) => {
  const fila = e.target.parentNode.parentNode; //tabla Entrega
  const stock = fila.children[0].innerHTML;
  const codproducto = fila.children[1].innerHTML;
  let cantidad = fila.children[3].innerHTML;
  if (cantidad == stockfijo) {
    alert("No hay mas en STOCK...");
  } else {
    const elemento = AEntregar.find(
      (insumos) => insumos.codproducto === codproducto
    );
    elemento.cantidad = parseInt(cantidad) + 1;
    elemento.stock = parseInt(stock) - 1;
    // if(vecesgrabadas > 0){
    //   elemento.cantidadaux = parseInt(cantidadaux) + 1;
    // }
  }
  btnGrabaEntregaAll.style.display = "block";
  MostrarAEntregar(AEntregar);
});

// hay que eliminar el

on(document, "click", ".btnRestarInsumo", (e) => {
  const fila = e.target.parentNode.parentNode;
  const stock = fila.children[0].innerHTML;
  const codproducto = fila.children[1].innerHTML;
  let cantidad = fila.children[3].innerHTML;
  let indice = fila.children[4].innerHTML;
  const elemento = AEntregar.find(
    (insumos) => insumos.codproducto === codproducto
  );
  if (cantidad == 1) {
    AEntregar.splice(indice, 1);
  } else {
    elemento.cantidad = parseInt(cantidad) - 1;
    elemento.stock = parseInt(stock) + 1;
  }
  btnGrabaEntregaAll.style.display = "block";
  MostrarAEntregar(AEntregar);
});

const MostrarAEntregar = (data) => {
  let resultados = "";
  let total = 0;
  let contador = 0;
  data.forEach((item) => {
    resultados += `<tr>
            <td style="color:red;text-align:center;width:60px;">${item.stock}</td>
            <td style="width:120px;">${item.codproducto}</td>
            <td style="width:400px;">${item.nombre}</td>
            <td style="color: red;width:55px;">${item.cantidad}</td>
            <td class="d-none">${contador}</td>
            <td class="text-center">
              <a class="btnSumarDer btn btn-outline-primary btn-sm">+</a>
              <a class="btnRestarInsumo btn btn-outline-danger btn-sm">--</a>
            </td>
            </tr>`;
    total = total + item.cantidad;
    contador = contador + 1;
  });
  document.getElementById("totalInsumosEntregados").innerHTML = total;
  document.getElementById("numeroInsumosEntregados").innerHTML = contador;
  if (contador == 0) {
    btnGrabaEntregaAll.style.display = "none";
  }
  tbodyEntrega.innerHTML = resultados;
};

btnGrabaEntregaAll.addEventListener("click", () => {
  //LimpiaEntrega(codentrega);
  let codproducto = "";
  let cantidad = 0;
  for (i = 0; i < AEntregar.length; i++) {
    codproducto = AEntregar[i].codproducto;
    if (vecesgrabadas == 0) {
      cantidad = AEntregar[i].cantidad;
    } else {
      cantidad = AEntregar[i].cantidadaux;
      AEntregar[i].cantidadaux = 0;
    }
    //AEntregar[i].stock = stock - AEntregar[i].cantidad;
    // GrabaInsumoNuevo(codentrega, codproducto, cantidad);
    // ExtraerenTablaInsumos(codproducto,cantidad);
    // MostrarProductos("productos");
    // MostrarAEntregar(AEntregar);
  }
  btnGrabaEntregaAll.style.display = "none";
});

async function LimpiaEntrega(codentrega) {
  await fetch(url + "entregadet/" + codentrega, {
    method: "DELETE",
  });
}

async function ExtraerenTablaInsumos(codproducto, cantidad) {
  try {
    await fetch(url + "productok/" + codproducto, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cantidad: cantidad,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

const GrabaInsumoNuevo = async (codentrega, codproducto, cantidad) => {
  try {
    await fetch(url + "entregadet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codentrega: codentrega,
        codproducto: codproducto,
        cantidad: cantidad,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

btnSalir.addEventListener("click", () => {
  const btn = btnGrabaEntregaAll.style.display;
  if (btn == "block") {
    var respuesta = confirm("Existen datos sin Grabar, desea salir...?");
    if (respuesta) {
      location.href = "menu.html";
    }
  }
});
