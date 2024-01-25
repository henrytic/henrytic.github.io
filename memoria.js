let tareas = [];
let duraciones = [];
let tiemposLlegada = [];
let algoritmoActual = 'FCFS'; 

function dibujarGrafico() {
    
}

function agregarTarea() {
    const nombreTarea = document.getElementById('nombreTarea').value;
    const duracionTarea = document.getElementById('duracionTarea').value;
    const tiempoLlegada = document.getElementById('tiempoLlegada').value;
    if (nombreTarea === '' || duracionTarea === '' || duracionTarea <= 0 || tiempoLlegada === '' || tiempoLlegada < 0) {
        alert('Por favor, ingrese datos válidos para la tarea.');
        return;
    }
    tareas.push(nombreTarea);
    duraciones.push(parseInt(duracionTarea));
    tiemposLlegada.push(parseInt(tiempoLlegada));
    actualizarListaTareas();
    document.getElementById('nombreTarea').value = '';
    document.getElementById('duracionTarea').value = '';
    document.getElementById('tiempoLlegada').value = '';
}

function establecerAlgoritmo(algoritmo) {
    algoritmoActual = algoritmo;
    calcularTiempos();
}

function calcularTiempos() {
    if (algoritmoActual === 'FCFS') {
        calcularFCFS();
    } else if (algoritmoActual === 'SPN') {
        calcularSPN();
    }
}

function calcularFCFS() {
    let tiempoTotal = 0;
    let datosGantt = [];
    let resultadosHtml = '';
    let tiempoEsperaTotal = 0;
    let tiempoRetornoTotal = 0;

    tareas.forEach((tarea, indice) => {
        const tiempoLlegada = tiemposLlegada[indice];
        const duracion = duraciones[indice];
        const tiempoEspera = Math.max(tiempoTotal - tiempoLlegada, 0);
        const tiempoInicio = tiempoTotal;
        tiempoTotal = Math.max(tiempoTotal, tiempoLlegada) + duracion;
        const tiempoRetorno = tiempoEspera + duracion;

        tiempoEsperaTotal += tiempoEspera;
        tiempoRetornoTotal += tiempoRetorno;

        datosGantt.push([tarea, tarea, null, new Date(tiempoInicio * 1000), new Date(tiempoTotal * 1000), null, 100, null]);
        resultadosHtml += `<tr>
                            <td>${tarea}</td>
                            <td>${tiempoEspera}</td>
                            <td>${tiempoRetorno}</td>
                            <td>${tiempoLlegada}</td>
                        </tr>`;
    });

    const tiempoEsperaPromedio = tiempoEsperaTotal / tareas.length;
    const tiempoRetornoPromedio = tiempoRetornoTotal / tareas.length;

    resultadosHtml += `<tr>
                        <td>Promedio</td>
                        <td>${tiempoEsperaPromedio.toFixed(2)}</td>
                        <td>${tiempoRetornoPromedio.toFixed(2)}</td>
                        <td>---</td>
                    </tr>`;

    document.getElementById('resultados').querySelector('tbody').innerHTML = resultadosHtml;
    dibujarGraficoGantt(datosGantt);
}

function dibujarGraficoGantt(datosGantt) {
    Highcharts.ganttChart('graficoGantt', {
        series: [{
            name: 'Tareas',
            data: datosGantt.map((tarea, indice) => {
                return {
                    start: tarea[3].getTime(),
                    end: tarea[4].getTime(),
                    name: tarea[1],
                    y: indice
                };
            })
        }],
        title: {
            text: 'Diagrama de Gantt'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            type: 'category',
            categories: datosGantt.map(tarea => tarea[1]),
            title: {
                text: ''
            }
        }
    });
}

function calcularSPN() {
    // Implementación de SPN (Shortest Process Next)
    let tareasSPN = [...tareas];
    let duracionesSPN = [...duraciones];
    let tiemposLlegadaSPN = [...tiemposLlegada];
    let datosGantt = [];
    let resultadosHtml = '';
    let tiempoTotal = 0;
    let tiempoEsperaTotal = 0;
    let tiempoRetornoTotal = 0;

    while (tareasSPN.length > 0) {
        let tareasDisponibles = tareasSPN.filter((_, indice) => tiemposLlegadaSPN[indice] <= tiempoTotal);

        if (tareasDisponibles.length === 0) {
            tiempoTotal++;
            continue;
        }

        let indiceTareaCorta = tareasSPN.findIndex((tarea) => tarea === tareasDisponibles.sort((a, b) => {
            let indiceA = tareasSPN.indexOf(a);
            let indiceB = tareasSPN.indexOf(b);
            return duracionesSPN[indiceA] - duracionesSPN[indiceB];
        })[0]);

        let tarea = tareasSPN[indiceTareaCorta];
        let duracion = duracionesSPN[indiceTareaCorta];
        let tiempoLlegada = tiemposLlegadaSPN[indiceTareaCorta];
        let tiempoEspera = Math.max(tiempoTotal - tiempoLlegada, 0);
        let tiempoRetorno = tiempoEspera + duracion;
        let tiempoInicio = tiempoTotal;

        tiempoTotal += duracion;

        datosGantt.push([tarea, tarea, null, new Date(tiempoInicio * 1000), new Date(tiempoTotal * 1000), null, 100, null]);
        resultadosHtml += `<tr>
                            <td>${tarea}</td>
                            <td>${tiempoEspera}</td>
                            <td>${tiempoRetorno}</td>
                            <td>${tiempoLlegada}</td>
                        </tr>`;

        tiempoEsperaTotal += tiempoEspera;
        tiempoRetornoTotal += tiempoRetorno;

        tareasSPN.splice(indiceTareaCorta, 1);
        duracionesSPN.splice(indiceTareaCorta, 1);
        tiemposLlegadaSPN.splice(indiceTareaCorta, 1);
    }

    const tiempoEsperaPromedio = tiempoEsperaTotal / tareas.length;
    const tiempoRetornoPromedio = tiempoRetornoTotal / tareas.length;

    resultadosHtml += `<tr>
                        <td>Promedio</td>
                        <td>${tiempoEsperaPromedio.toFixed(2)}</td>
                        <td>${tiempoRetornoPromedio.toFixed(2)}</td>
                        <td>---</td>
                    </tr>`;
    document.getElementById('resultados').querySelector('tbody').innerHTML = resultadosHtml;
    dibujarGraficoGantt(datosGantt);
}

function actualizarListaTareas() {
    let html = '<ul>';
    tareas.forEach((tarea, indice) => {
        html += `<li>Tarea ${tarea}: Duración = ${duraciones[indice]}, Tiempo de Llegada = ${tiemposLlegada[indice]}</li>`;
    });
    html += '</ul>';
    document.getElementById('listaTareas').innerHTML = html;
}
