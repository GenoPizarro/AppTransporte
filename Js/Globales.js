//const urlG = "http://localhost:3000/";
export const urlG = "http://192.168.1.12:3000/";

// export function Valida(uno,dos,tres,cuatro) {
//   let ok = "SI";
//   if (uno.value == "") {
//     uno.style.border = "solid 1px red";
//     uno.focus();
//     ok = "NO";
//   } else {
//     uno.style.border = "solid 1px lightskyblue";
//   }
//   if (dos.value == "") {
//     dos.style.border = "solid 1px red";
//     dos.focus();
//     ok = "NO";
//   } else {
//     dos.style.border = "solid 1px lightskyblue";
//   }
//   if (tres.value == "") {
//     tres.style.border = "solid 1px red";
//     tres.focus();
//     ok = "NO";
//   } else {
//     tres.style.border = "solid 1px lightskyblue";
//   }
//   if (cuatro.value == "" || cuatro.value == "0") {
//     cuatro.style.border = "solid 1px red";
//     cuatro.focus();
//     ok = "NO";
//   } else {
//     cuatro.style.border = "solid 1px lightskyblue";
//   }
//   return ok;
// }


export const TraerPasajerosExistentes = async (url) => {
  try {
    const response = await fetch(urlG + url)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export const TraerServiciosListos = async (url) => {
  try {
    const response = await fetch(urlG + url)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export const TraerServicioPasajeros = async (cod) => {
  try {
    const response = await fetch(urlG + "serviciopasajeros/"+ cod)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export const TraerServicioValor = async (url) => {
  try {
    const response = await fetch(urlG + url)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export const TraeConductor = async (url) => {
  try {
    const response = await fetch(urlG + url)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export const TraeEmpresa = async (url) => {
  try {
    const response = await fetch(urlG + url)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export const TraeUsuario = async (url) => {
  try {
    const response = await fetch(urlG + url)
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export function ComboConductores(conductor) {
  selectempresa.innerHTML = "";
  let cod = 2
  conductor.forEach((item) => {
    if (item.codconductor === cod) {
      selectconductor.innerHTML += `<option selected value=${item.codconductor}>${item.nombre}</option>`;
    } else {
      selectconductor.innerHTML += `<option value=${item.codconductor}>${item.nombre}</option>`;
    }
  });
}

export function ComboEmpresa(Array,cod) {
  let empresas = Array;
  selectempresa.innerHTML = "";
  empresas.forEach((item) => {
    if (item.codempresa === parseInt(cod)) {
      selectempresa.innerHTML += `<option selected value=${item.codempresa}>${item.nombre}</option>`;
    } else {
      selectempresa.innerHTML += `<option value=${item.codempresa}>${item.nombre}</option>`;
    }
  });
}

// export function Valida(datos) {
//   let ok = "SI";
//   let i = 0;
//   datos.forEach(element => {
//     let campo = element[i]
//     if(campo == ""){
//       campo.style.border = "solid 1px red";
//       ok = "NO"
//     }else{
//       campo.style.border = "solid 1px lightskyblue";
//     }
//     i++
//   });
//   return ok;
// }

export const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

export function AsignarFechaActual() {
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
  //fechaEntrega.value = yea + "-" + mes + "-" + dia;
    fecha = dia + "-" + mes + "-" + yea;
  return fecha;
}


export let dataTableExisten = {
  pageLength: 5,
  destroy: true,
  dom: 'Bfrtip',
  
  buttons: [
    //'copy', 'csv', 'excel', 'pdf'
    '', '', '', ''
  ],
  language: {
    search: 'Buscar',
    //infoThousands: ',',
    //infoEmpty: '',
    infoFiltered: '',
    //loadingRecords: 'Cargando...',
    paginate: {
      next: '>>',
      previous: '<<',
    },
    //paging: false,
    info: '',
  },
};

export let dataTableServiciosListos = {
  pageLength: 8,
  destroy: true,
  dom: 'Bfrtip',
  "bFilter": false,  // Oculta el input de busqueda
  buttons: [
    //'copy', 'csv', 'excel', 'pdf'
    '', '', '', ''
  ],
  language: {
    search: '',
    //infoThousands: ',',
    //infoEmpty: '',
    infoFiltered: '',
    //loadingRecords: 'Cargando...',
    paginate: {
      next: '>>',
      previous: '<<',
    },
    info: '',
  },
};

export function MostrarPaneles(pnlcabfija, pnlcabvar, pnlingcabbajo, PnlPaxExisten, PnlPaxViajan, PnlSrvListos) {
  PanelCabeceraFija.style.display = pnlcabfija;
  PanelCabeceraVariable.style.display = pnlcabvar;
  PanelIngresoServicioAbajo.style.display = pnlingcabbajo;
  PanelPasajerosExistentes.style.display = PnlPaxExisten;
  PanelPasajerosViajan.style.display = PnlPaxViajan;
  PanelServiciosListos.style.display = PnlSrvListos;
}

export function MostrarBotones(btNuevoSrv, btPnlAsignaPax, btConfirmaAsig, btCancelaAsig) {
  BtnNuevoServicio.style.display = btNuevoSrv;
  BtnPanelAsignarpasajeros.style.display = btPnlAsignaPax;
  BtnConfirmaAsignacionPax.style.display = btConfirmaAsig;
  BtnCancelaAsignacionPax.style.display = btCancelaAsig;
}