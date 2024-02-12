//Definición de variables
const url = "http://192.168.1.77:3000/";

const fecha = document.getElementById("fecha");
const selectSector = document.getElementById("selectSector");
const responsable = document.getElementById("responsable");
const btnGrabaCabEntrega = document.getElementById("btnGrabaCabEntrega");
const selectInsumos = document.getElementById("selectInsumos");

$( '#selectInsumos' ).select2({
  theme: 'bootstrap-5'
});

$(document).keydown((event) => {
  if (event.which == 13 || event.keyCode == 13) {
    alert(selectInsumos.value)
  }
});


selectInsumos.addEventListener("keydown", (e) => {
  //const texto = buscarNombreProducto.value;
   if (e.keyCode == 13) {
      alert("algo...")
   }
})

function Algo(){
  alert("SIISIISISISI")
}

ComboProductos();

btnGrabaCabEntrega.addEventListener("click", () => {
  GrabarEntregaCab();
});

function ComboProductos(){
  fetch(url + "productos")
    .then((response) => response.json())
    .then((data) => ComboProductosDos(data))
    .catch((error) => console.log(error));
}

function ComboProductosDos(productos) {
  productos.forEach((item) => {
      selectInsumos.innerHTML += `<option value=${item.codproducto}>${item.nombre}</option>`;
  });
}