class Proceso {
    constructor(nombre, tiempoLlegada, duracion) {
      this.nombre = nombre;
      this.tiempoLlegada = tiempoLlegada;
      this.duracionOriginal = duracion; 
      this.duracion = duracion;         
      this.segmentos = [];              
    }
  }
  
  let procesos = [];
  
  document.getElementById('formProceso').addEventListener('submit', function(event) {
    event.preventDefault();
  
    let nombre = document.getElementById('proceso').value;
    let tiempoLlegada = parseInt(document.getElementById('tiempoLlegada').value, 10);
    let duracion = parseInt(document.getElementById('duracion').value, 10);
  
    procesos.push(new Proceso(nombre, tiempoLlegada, duracion));
    document.getElementById('formProceso').reset();
  });
  
  function calcularSRTF(procesos) {
    let tiempo = 0;
    let finalizados = 0;
    let procesoAnterior = null;
    procesos.forEach(proceso => {
      proceso.segmentos = [];
      proceso.duracion = proceso.duracionOriginal;
    });
  
    while (finalizados < procesos.length) {
      let procesoActual = null;
      let tiempoRestanteMinimo = Number.MAX_SAFE_INTEGER;
  
      for (let i = 0; i < procesos.length; i++) {
        if (procesos[i].tiempoLlegada <= tiempo && procesos[i].duracion < tiempoRestanteMinimo && procesos[i].duracion > 0) {
          tiempoRestanteMinimo = procesos[i].duracion;
          procesoActual = procesos[i];
        }
      }
  
      if (procesoActual) {
        procesoActual.duracion--;
        if (!procesoActual.segmentos.length || procesoActual !== procesoAnterior) {
          procesoActual.segmentos.push({ inicio: tiempo, duracion: 1 });
        } else {
          procesoActual.segmentos[procesoActual.segmentos.length - 1].duracion++;
        }
  
        if (procesoActual.duracion === 0) {
          finalizados++;
        }
  
        procesoAnterior = procesoActual;
      }
  
      tiempo++;
    }
  
    return procesos.map(p => {
      let tiempoTotal = p.segmentos.reduce((acc, seg) => acc + seg.duracion, 0);
      let tiempoFinal = p.segmentos[p.segmentos.length - 1].inicio + p.segmentos[p.segmentos.length - 1].duracion;
      let tiempoRetorno = tiempoFinal - p.tiempoLlegada;
      let tiempoEspera = tiempoRetorno - p.duracionOriginal;
  
      return {
        nombre: p.nombre,
        tiempoRetorno,
        tiempoEspera,
        segmentos: p.segmentos 
      };
    });
  }
  
  
  function calcularResultados() {
    let resultados = calcularSRTF(procesos);
    let tbody = document.getElementById('tablaResultados').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
  
    resultados.forEach(resultado => {
      let fila = tbody.insertRow();
      fila.insertCell(0).innerHTML = resultado.nombre;
      fila.insertCell(1).innerHTML = resultado.tiempoRetorno;
      fila.insertCell(2).innerHTML = resultado.tiempoEspera;
    });
  
    drawChart();
    
  }
  
  
  
  function drawChart() {
    let resultados = calcularSRTF(procesos);
    let seriesData = [];
    let categorias = [];

    // Encuentra el tiempo máximo para ajustar el eje X
    let maxTime = 0;

    resultados.forEach((resultado, index) => {
        categorias.push(resultado.nombre);
        resultado.segmentos.forEach(segmento => {
            let inicio = segmento.inicio;
            let fin = segmento.inicio + segmento.duracion;
            maxTime = Math.max(maxTime, fin);
            seriesData.push({
                name: resultado.nombre,
                start: inicio,
                end: fin,
                y: index
            });
        });
    });

    Highcharts.ganttChart('ganttChart', {
        title: {
            text: 'Diagrama de Gantt - SRTF'
        },
        xAxis: {
            min: 0,
            max: maxTime,
            tickInterval: 1,
            labels: {
                formatter: function () {
                    return this.value; 
                }
            }
        },
        yAxis: {
            type: 'category',
            categories: categorias,
            min: 0,
            max: resultados.length - 1
        },
        series: [{
            name: 'Procesos',
            data: seriesData,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }],
        tooltip: {
            pointFormatter: function () {
                return '<span style="color:' + this.color + '">●</span> ' +
                    this.name + ': <b>' + this.start +
                    '</b> - <b>' + this.end + '</b><br/>';
            }
        }
    });
}



