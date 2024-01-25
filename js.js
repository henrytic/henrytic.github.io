// Función para calcular los tiempos usando el algoritmo SPN (Shortest Process Next), que es equivalente a SJF (Shortest Job First).
function calcularSPN() {
    let tiempoTotal = 0;  // Tiempo total transcurrido en el sistema.
    let datosGantt = [];  // Array para almacenar los datos para el gráfico de Gantt.
    let resultadosHtml = '';  // String HTML para mostrar los resultados.
    let tiempoEsperaTotal = 0;  // Suma total de los tiempos de espera.
    let tiempoRetornoTotal = 0;  // Suma total de los tiempos de retorno.

    // Crear copias de las listas para manipularlas sin alterar las originales.
    let tareasSPN = [...tareas];
    let duracionesSPN = [...duraciones];
    let tiemposLlegadaSPN = [...tiemposLlegada];

    // Mientras haya tareas pendientes.
    while (tareasSPN.length > 0) {
        // Filtrar tareas que ya han llegado.
        let tareasDisponibles = tareasSPN.filter((_, indice) => tiemposLlegadaSPN[indice] <= tiempoTotal);

        // Si no hay tareas disponibles, avanzar el tiempo.
        if (tareasDisponibles.length === 0) {
            tiempoTotal++;
            continue;
        }

        // Encontrar la tarea más corta disponible.
        let indiceTareaCorta = tareasSPN.findIndex((tarea) => tarea === tareasDisponibles.sort((a, b) => {
            let indiceA = tareasSPN.indexOf(a);
            let indiceB = tareasSPN.indexOf(b);
            return duracionesSPN[indiceA] - duracionesSPN[indiceB];
        })[0]);

        // Obtener los datos de la tarea seleccionada.
        let tarea = tareasSPN[indiceTareaCorta];
        let duracion = duracionesSPN[indiceTareaCorta];
        let tiempoLlegada = tiemposLlegadaSPN[indiceTareaCorta];
        let tiempoEspera = Math.max(tiempoTotal - tiempoLlegada, 0);
        let tiempoRetorno = tiempoEspera + duracion;
        let tiempoInicio = tiempoTotal;

        // Actualizar el tiempo total del sistema.
        tiempoTotal += duracion;

        // Preparar datos para el gráfico de Gantt y actualizar los resultados HTML.
        datosGantt.push([tarea, tarea, null, new Date(tiempoInicio * 1000), new Date(tiempoTotal * 1000), null, 100, null]);
        resultadosHtml += `<tr>
                            <td>${tarea}</td>
                            <td>${tiempoEspera}</td>
                            <td>${tiempoRetorno}</td>
                            <td>${tiempoLlegada}</td>
                        </tr>`;

        // Acumular los tiempos de espera y de retorno.
        tiempoEsperaTotal += tiempoEspera;
        tiempoRetornoTotal += tiempoRetorno;

        // Eliminar la tarea procesada de las listas de tareas pendientes.
        tareasSPN.splice(indiceTareaCorta, 1);
        duracionesSPN.splice(indiceTareaCorta, 1);
        tiemposLlegadaSPN.splice(indiceTareaCorta, 1);
    }

    // Calcular los tiempos promedio.
    const tiempoEsperaPromedio = tiempoEsperaTotal / tareas.length;
    const tiempoRetornoPromedio = tiempoRetornoTotal / tareas.length;

    // Agregar fila de promedios a los resultados HTML.
    resultadosHtml += `<tr>
                        <td>Promedio</td>
                        <td>${tiempoEsperaPromedio.toFixed(2)}</td>
                        <td>${tiempoRetornoPromedio.toFixed(2)}</td>
                        <td>---</td>
                    </tr>`;
    document.getElementById('resultados').querySelector('tbody').innerHTML = resultadosHtml;

    // Dibujar el gráfico de Gantt con los datos.
    dibujarGraficoGantt(datosGantt);
}
