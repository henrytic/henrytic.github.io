var tabla = document.getElementById('contenedor');
var contenido = "";
var id_tabla = 0;
var id_particion = 1;
var vistaN = document.getElementById("vistaN");
var vistaD = document.getElementById("vistaD");
var vistaP = document.getElementById("vistaP");
var numeracion = celda_nom;
var celda_nom = `<input class="celda" style="width: 95px; border: none;" type="text" value="">`;
var celda_nom1 = `<input class="celda" style="background-color: transparent; width: 95px; border: none;" type="text" value="">`;
var representacion = "";
var repre_linea = "";

function escribir(a, t) {
    document.getElementById(a).value = t;
}

function limpiar() {
    representacion = "";
    repre_linea = "";
    vistaD.innerHTML = representacion;
    vistaN.innerHTML = numeracion;
    area = [];
}

// Nueva función para actualizar título y procesar
function actualizarTituloYProcesar(titulo, procesarFuncion) {
    escribir('mostrarTitulo', titulo);
    procesarFuncion();
}

// Nueva función para actualizar la tabla de trabajos
function actualizarTablaTrabajos() {
    // Actualiza la información de la tabla de trabajos
    for (var i = 1; i <= id_tabla; i++) {
        var tiempoEjecucion = parseFloat(document.getElementById(`TE${i}`).value);
        if (!isNaN(tiempoEjecucion)) {
            tiempoEjecucion += 0.1; // Incrementa el tiempo en proceso
            escribir(`TE${i}`, tiempoEjecucion.toFixed(1));
        }
    }
}

// Modificación en la función repre_prosesamiento
function repre_prosesamiento() {
    var tipo = document.getElementById('tipo');
    limpiarGraf();

    // Mantén solo la lógica relacionada con el tipo de memoria
    if (tipo.value == "First_fit") {
        actualizarTituloYProcesar('First Fit', first_fit);
    }
    if (tipo.value == "Best_fit") {
        actualizarTituloYProcesar('Best Fit', best_fit);
    }

    // Llama a la nueva función para actualizar la tabla de trabajos
    actualizarTablaTrabajos();
}

function limpiarGraf() {
    for (var i = 0; i < datos_particion.length; i++) {
        console.log("entro");
        var tempLienzo = document.getElementById(`lienzo${i + 1}`);
        tempLienzo.innerHTML = "";
    }
}

var area = [];
var escalado = 20;

function dibujarTab() {
    numeracion = celda_nom;
    var pilaM = celda_nom1;
    var k = 0.0;

    while (k <= 5) {
        numeracion += `<input class="celdaN" style="border: none;" type="text" id="num${k.toFixed(1)}" value="${k.toFixed(1)}">`;
        k = k + 0.1;
        k.toFixed(1);
    }

    vistaN.innerHTML = numeracion;

    for (var i = 0; i < id_particion + 1; i++) {
        var nomPart = document.getElementById(`id${i}`).value;
        var nomPa = document.getElementById(`p${i}`).value;
        var alto = parseInt(document.getElementById(`p${i}`).value);

        if (i !== 0) {
            var nuevaArea = new AreaRectangular(2500, (alto * escalado) + 1);
            area.push(nuevaArea);
        }

        repre_linea = `<div><div class="part" style="width: 120px; height:${alto * escalado}px; line-height: ${alto * escalado}px;" type="text" id="nombre${i}r">${nomPart} -> ${nomPa}</div><div class="part" id="lienzo${i}" style="position: relative; width: 2500px; height:${alto * escalado}px;"></div></div>`;
        representacion += repre_linea;
    }

    console.log(area);
    vistaD.innerHTML = representacion;
}


class Proceso {
  constructor(id_, trabajo_, memoria_, TM_) {
    this.id = id_;
    this.trabajo = trabajo_;
    this.memoria = memoria_;
    this.TM = TM_;
  }
}

class Rectangulo {
    constructor(ancho, alto,nombre) {
    this.ancho = ancho;
    this.alto = alto;
    this.nombre = nombre;
    }
}

class AreaRectangular {
    constructor(ancho, alto) {
        this.ancho = ancho;
        this.alto = alto;
        this.rectangulosColocados = [];
    }

    colocarRectangulos(rectangulos) {
        while (rectangulos.length > 0) {
            const rectanguloActual = rectangulos.shift();
            const posicion = this.encontrarPosicion(rectanguloActual);

            if (posicion) {
                this.rectangulosColocados.push({rectangulo: rectanguloActual, x: posicion.x, y: posicion.y,});
            } else {
                notificacion("No se pudo colocar el rectángulo:", rectanguloActual);
            }
        }
    }

    encontrarPosicion(rectangulo) {
        for (let x = 0; x <= this.ancho - rectangulo.ancho; x++) {
            for (let y = 0; y <= this.alto - rectangulo.alto; y++) {
                if (this.verificarColision(rectangulo, x, y)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    verificarColision(rectangulo, x, y) {
        for (const colocado of this.rectangulosColocados) {
            if (x < colocado.x + colocado.rectangulo.ancho &&
                x + rectangulo.ancho > colocado.x &&
                y < colocado.y + colocado.rectangulo.alto &&
                y + rectangulo.alto > colocado.y) {
                return false;
            }
        }
        return true;
    }

    limpiarArea() {
        this.rectangulosColocados = [];
    }
}

var procesos=[]; 

function llenar(){procesos.splice(0, procesos.length);
    for(var i= 1;i<=id_tabla;i++){
        var trabajo = parseFloat(document.getElementById("trabajo"+i+"").value);
        var memoria = parseFloat(document.getElementById("memoria"+i+"").value);
        var Tmemoria = parseFloat(document.getElementById("TM"+i+"").value);
        var nuevoProceso = new Proceso(i,trabajo, memoria, Tmemoria);
        procesos.push(nuevoProceso); 
    }
    procesos.forEach(proceso => {console.log(`id: ${proceso.id},Nombre: ${proceso.trabajo}, TLL: ${proceso.memoria}, T: ${proceso.TM}`);});
}

function agregar() {
    var trabajo = parseFloat(document.getElementById("trabajo").value);
    var memoria = parseFloat(document.getElementById("memoria").value);
    var TM = parseFloat(document.getElementById("Tmemoria").value);

    if (isNaN(trabajo) || isNaN(memoria) || isNaN(TM)) {
        notificacion("Ingrese valores numéricos en los campos requeridos");
        return;
    } else {
        var newRow = document.createElement("tr");
        newRow.innerHTML = `<td><input class="input-group celdaNom bg-white" type="text" id="trabajo${id_tabla + 1}" value="${trabajo}"></td>
                            <td><input class="input-group celda bg-white" id="memoria${id_tabla + 1}" type="text" value="${memoria}k"></td>
                            <td><input class="input-group celda bg-white" id="TM${id_tabla + 1}" type="text" value="${TM}"></td>
                            <td><input class="input-group celda bg-white" id="TR${id_tabla + 1}" type="text"></td>`;

        document.getElementById("contenedor").appendChild(newRow);
        escribir("trabajo", id_tabla + 2);
    }
    id_tabla++;
    repre_prosesamiento();
}

var tablaP=document.getElementById('contenedorP');
//Tamaño del S.O
var contParticion = `<input class="celdaNomP" type="text" id="id0" value="S.O"><input class="celdaNomP" type="text" id="p0" value="10K"><br>`;
var particiones=[], datos_particion=[];
function agregarP(){if(particiones.length>0){particiones.forEach(cola => cola.splice(0, cola.length));}
    datos_particion = []
    var particion = parseInt(document.getElementById("particion").value);

    if(particion==""){notificacion("ingrese una particion....."); return;}
    else{
        if(id_particion==1){contParticion +=`<input class="celdaNomP" type="text" id="id${id_particion}" value="${id_particion}"><input class="celdaNomP" type="text" id="p${id_particion}" value="${particion}k">`;
        }else{contParticion +=`<br><input class="celdaNomP" type="text" id="id${id_particion}" value="${id_particion}"><input class="celdaNomP" type="text" id="p${id_particion}" value="${particion}k">`;
        }
        tablaP.innerHTML = contParticion;
        limpiar();
        dibujarTab();
    } id_particion++; 
    for(var i=1;i<id_particion;i++){
        var todos = parseInt(document.getElementById(`p${i}`).value)
        datos_particion.push(todos);
    }
    particiones = datos_particion.map(particion => []);
    if(id_tabla>0){
        repre_prosesamiento();
        //llenar();
    }
}

function agregarFila() {
    var newRow = document.createElement("tr");
    newRow.innerHTML = `<td><input class="celdaNom bg-white" type="text" id="nombre${id_tabla + 1}" value=""></td>
                        <td><input class="celda bg-white" id="TLL${id_tabla + 1}" type="text" value=""></td>
                        <td><input class="celda bg-white" id="T${id_tabla + 1}" type="text" value=""></td>
                        <td><input class="celda bg-white" id="TR${id_tabla + 1}" type="text"></td>
                        <td><input class="celda bg-white" id="TE${id_tabla + 1}" type="text"></td>`;

    document.getElementById("contenedor").appendChild(newRow);
    escribir("nombre", "");
    limpiar();
    dibujarTab();
    id_tabla++;
}

function eliminarFila() {
  if (id_tabla > 0) {id_tabla--;

    contenido = contenido.substring(0, contenido.lastIndexOf('<br>'));
    tabla.innerHTML = contenido;
    limpiar();
    dibujarTab();//repre_prosesamiento();
  }
}

//first_fit
function first_fit() {
    particiones.forEach(cola => cola.splice(0, cola.length));
    area.forEach(a => a.limpiarArea());

    // Ordenar los procesos por tiempo de llegada
    procesos.sort((a, b) => a.TLL - b.TLL);

    var indexParticion = 0; // Índice de la partición de inicio para cada trabajo

    for (var i = 0; i < id_tabla; i++) {
        var tempDato = parseInt(document.getElementById(`memoria${i + 1}`).value);
        var asignado = false;

        // Comenzar a buscar desde la partición de inicio hasta el final
        for (var j = 0; j < datos_particion.length; j++) {
            var indexActual = (indexParticion + j) % datos_particion.length;

            if (tempDato <= datos_particion[indexActual]) {
                var Tmemp = parseFloat(document.getElementById(`TM${i + 1}`).value) * 10;
                particiones[indexActual].push(new Rectangulo(Tmemp * 50, (tempDato * escalado), `T${i + 1}`));

                if (tempDato < datos_particion[indexActual]) {
                    particiones[indexActual].push(new Rectangulo(Tmemp * 50, (datos_particion[indexActual] * escalado) - (tempDato * escalado), `F.I.`));
                }

                asignado = true;
                break;
            }
        }

        if (!asignado) {
            notificacion(`No hay partición suficiente para: ${tempDato}k`);
        }

        // El siguiente trabajo comenzará a buscar desde la siguiente partición
        indexParticion = (indexParticion + 1) % datos_particion.length;
    }

    for (var i = 0; i < datos_particion.length; i++) {
        area[i].colocarRectangulos(particiones[i]);
        dibujarRectangulos(`lienzo${i + 1}`, i);
    }

    llenarTabla();
}


//best_fit
function best_fit() {particiones.forEach(cola => cola.splice(0, cola.length));
    area.forEach(a => a.limpiarArea());
    for (var i = 0; i < id_tabla; i++) {
        var tempDato = parseInt(document.getElementById(`memoria${i + 1}`).value);
        var mejorAjuste = 1000;
        var indice = -1; 
        var control = false;
        for (var j = 0; j < datos_particion.length; j++) {
            if (tempDato <= datos_particion[j] && datos_particion[j] < mejorAjuste) {
                mejorAjuste = datos_particion[j];
                indice = j;
                control = true;
            }
        }
        if (control) {
            var Tmemp = parseFloat(document.getElementById(`TM${i + 1}`).value) * 10;
            particiones[indice].push(new Rectangulo(Tmemp * 50, (tempDato * escalado), `T${i + 1}`));
            if (tempDato < datos_particion[indice]) {
                particiones[indice].push(new Rectangulo(Tmemp * 50, (datos_particion[indice] * escalado) - (tempDato * escalado), `F.I.`));
            }
        }

        if (!control) {notificacion(`No hay partición suficiente para: ${tempDato}k`);}
    }

    for (var i = 0; i < datos_particion.length; i++) {
        area[i].colocarRectangulos(particiones[i]);
        dibujarRectangulos(`lienzo${i + 1}`, i);
    }
    llenarTabla();
}


function llenarTabla(){
    var resultado = 0;
    for(var i=0;i<id_tabla;i++){
        var tiempoMemoria = parseFloat(document.getElementById(`TM${i+1}`).value)
        resultado+=tiempoMemoria;
        escribir(`TR${i+1}`, resultado.toFixed(1));
    }
    var promedio=resultado/id_tabla;
    escribir(`TRR`, promedio.toFixed(1));
}

function dibujarRectangulos(id, i) {
    const lienzo = document.getElementById(id);
    
    for (const colocado of area[i].rectangulosColocados) {
        const rectanguloDiv = document.createElement('div');
        rectanguloDiv.className = 'rectangulo';
        rectanguloDiv.style.width = `${colocado.rectangulo.ancho}px`;
        rectanguloDiv.style.height = `${colocado.rectangulo.alto}px`;
        rectanguloDiv.style.top = `${colocado.y}px`;
        rectanguloDiv.style.left = `${colocado.x}px`;
        if(colocado.rectangulo.nombre == "F.I."){rectanguloDiv.style.backgroundColor = "#f87676"; //rojo
        }else{rectanguloDiv.style.backgroundColor = "#72fc90"; }  //verde

        const texto = document.createTextNode(`${colocado.rectangulo.nombre}`);
        const textoDiv = document.createElement('div');
        textoDiv.appendChild(texto);
        rectanguloDiv.appendChild(textoDiv);
        lienzo.appendChild(rectanguloDiv);
    }
}

function dibNombre() {
    for (var i = 0; i < id_tabla; i++) {
        escribir("nombre" + (i + 1) + "r", procesos[i].nombre);
    }
}

function agregarFilaATabla(proceso) {
    if (id_tabla === 0) {
        contenido += `<input class="celdaNom" type="text" id="nombre${proceso.id}" value="${proceso.nombre}">
                      <input class="celda" id="TLL${proceso.id}" type="text" value="${proceso.TLL}">
                      <input class="celda" id="T${proceso.id}" type="text" value="${proceso.T}">
                      <input class="celda" id="TR${proceso.id}" type="text">
                      <input class="celda" id="TE${proceso.id}" type="text">`;
    } else {
        contenido += `<br><input class="celdaNom" type="text" id="nombre${proceso.id}" value="${proceso.nombre}">
                      <input class="celda" id="TLL${proceso.id}" type="text" value="${proceso.TLL}">
                      <input class="celda" id="T${proceso.id}" type="text" value="${proceso.T}">
                      <input class="celda" id="TR${proceso.id}" type="text">
                      <input class="celda" id="TE${proceso.id}" type="text">`;
    }

    tabla.innerHTML = contenido;
    limpiar();
    dibujarTab();
    id_tabla++;
    repre_prosesamiento();
}
