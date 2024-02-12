import {urlGlobal} from "./Globales.js"
const url = urlGlobal;
//const url = "http://loclhost:3000/";

const contenedor = document.querySelector("tbody");

//VAriables Globales
let opcion = "";
let idForm = 0;


MostrarEntregas("entregacab")


function MostrarEntregas(cadena){
  fetch(url + cadena)
    .then((response) => response.json())
    .then((data) => MostrarEntregasDos(data))
    .catch((error) => console.log(error));
}

const MostrarEntregasDos = (data) => {
  let resultados = "";
  let fecha = "";
  data.forEach((item) => {
  fecha = item.fecha.substring(0,10)
  resultados += `<tr>
                    <td class="codinterno d-none">${item.codentrega}</td>
                    <td>${fecha}</td>
                    <td>${Sector(item.sector)}</td>
                    <td>${item.responsable}</td>
                    <td class="text-center"><a class="btnEditarEntrega btn btn-primary">Editar</a></td>
                 </tr>`;
  });
  contenedor.innerHTML = resultados;
};

function Sector(letra){
  let ok = "";
  if(letra=="R"){
    ok = "Rojo"
  }
  if(letra=="A"){
    ok = "Azul"
  }
  if(letra=="V"){
    ok = "Verde"
  }
  return ok
}