const dataPoints = [];
let totalMemorySize = 0;

function addData() {
    const partition = document.getElementById('partitionInput').value;
    const base = parseInt(document.getElementById('baseInput').value);
    const processSize = parseInt(document.getElementById('processSizeInput').value);

    dataPoints.push({ partition, base, processSize });
    displayTable();
}

function displayTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = "<h3 class='mt-4'>Datos Ingresados:</h3>";

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'mt-2');
    
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');  
    thead.innerHTML = "<tr><th>Partición</th><th>Base</th><th>Tamaño de Proceso</th></tr>";
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const dataPoint of dataPoints) {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.innerText = dataPoint.partition;
        cell2.innerText = dataPoint.base;
        cell3.innerText = dataPoint.processSize;
    }
    table.appendChild(tbody);

    tableContainer.appendChild(table);
}



// Variable global para el gráfico
var myChart;

function generateChart() {
    totalMemorySize = parseInt(document.getElementById('totalMemoryInput').value);

    const ctx = document.getElementById('result').getContext('2d');

    const data = {
        labels: dataPoints.map(point => point.partition),
        datasets: [{
            data: dataPoints.map(point => [point.base, point.base + point.processSize]),
            backgroundColor: dataPoints.map(point => point.added ? 'blue' : '#4CAF50'),
            borderColor: dataPoints.map(point => point.added ? 'blue' : '#4CAF50'),
            borderWidth: 1,
            hoverBackgroundColor: dataPoints.map(point => point.added ? '#0000ff' : '#45a049'),
            hoverBorderColor: dataPoints.map(point => point.added ? '#0000ff' : '#45a049'),
        }]
    };

    const options = {
        indexAxis: 'y',
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: 0,
                max: totalMemorySize,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    // Si el gráfico ya existe, destrúyelo
    if (myChart) {
        myChart.destroy();
    }

    // Crea un nuevo gráfico
    myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function addProcess() {
    const processSize = parseInt(document.getElementById('newProcessSizeInput').value);
    let base = -1;

    // Ordena los puntos de datos por base
    dataPoints.sort((a, b) => a.base - b.base);

    for (let i = 0; i < dataPoints.length - 1; i++) {
        // Encuentra un espacio entre las particiones existentes que sea lo suficientemente grande para el nuevo proceso
        if (dataPoints[i].base + dataPoints[i].processSize + processSize <= dataPoints[i + 1].base) {
            base = dataPoints[i].base + dataPoints[i].processSize;
            break;
        }
    }

    // Si no se encontró un espacio adecuado, no añade el proceso
    if (base === -1) {
        alert('No hay suficiente memoria para acomodar el proceso.');
        return;
    }

    // Añade el nuevo proceso a los puntos de datos
    
    dataPoints.push({ partition: `Proceso ${dataPoints.length + 1}`, base, processSize, added: true });


    // Genera el gráfico de nuevo con los nuevos datos
    generateChart();
}

function addProcessBestFit() {
    const processSize = parseInt(document.getElementById('newProcessSizeInput').value);
    let base = -1;
    let minSize = totalMemorySize;

    // Ordena los puntos de datos por base
    dataPoints.sort((a, b) => a.base - b.base);

    for (let i = 0; dataPoints.length > 1 && i < dataPoints.length - 1; i++) {
        // Encuentra un espacio entre las particiones existentes que sea lo suficientemente grande para el nuevo proceso
        if (dataPoints[i].base + dataPoints[i].processSize + processSize <= dataPoints[i + 1].base) {
            const size = dataPoints[i + 1].base - (dataPoints[i].base + dataPoints[i].processSize);
            if (size < minSize) {
                minSize = size;
                base = dataPoints[i].base + dataPoints[i].processSize;
            }
        }
    }

    // Si no se encontró un espacio adecuado, no añade el proceso
    if (base === -1) {
        alert('No hay suficiente memoria para acomodar el proceso.');
        return;
    }

    // Añade el nuevo proceso a los puntos de datos
    dataPoints.push({ partition: `Proceso ${dataPoints.length + 1}`, base, processSize, added: true });


    // Genera el gráfico de nuevo con los nuevos datos
    generateChart();
}

function deleteProcesses() {
    // Elimina los procesos añadidos mediante "Agregar Procesos"
    dataPoints.forEach(point => {
        if (point.added) {
            dataPoints.splice(dataPoints.indexOf(point), 1);
        }
    });

    // Genera el gráfico de nuevo con los nuevos datos
    generateChart();
}