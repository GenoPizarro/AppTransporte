//import {urlGlobal} from "./Globales.js"
//const url = urlGlobal;
const url = "http://localhost:3000/";
import {AsignarFechaActual} from "./Globales.js"
const avisostock = document.getElementById("avisostock");

// INICIO DE PAGINA - INICIO DE PAGINA
MostrarInsumos("insumos");

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

function TraerInsumosExistentes(data) {
  let fechaHoy = AsignarFechaActual();
  let fechaInsumo = "";
  let dias,stockdias = 0;
  let contador = 0;
  for (let i = 0; i < data.length; i++) {
    fechaInsumo = data[i].fechavence.substring(0, 10);
    dias =  Date.parse(fechaInsumo) - Date.parse(fechaHoy);
    stockdias = dias/(1000*60*60*24);
    console.log(stockdias);
    if(stockdias < 0){
      stockdias = stockdias * -1
      if(stockdias < 60){
        contador = contador + 1;
      }
    }else{
      if(stockdias < 60){
        contador = contador + 1;
      }
    }
  }
  avisostock.innerHTML = contador;
  // let ArrayOrdenStock = ArrayInsumosExistentes.sort((x,y)=>x.stockdias - y.stockdias);
  // MostrarInsumosDos(ArrayInsumosExistentes);
}