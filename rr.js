document.getElementById('processForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addProcess();
});

document.getElementById('quantumForm').addEventListener('submit', function(e) {
    e.preventDefault();
    drawGanttChart();
});
let processes = [];
function addProcess() {
    const processName = document.getElementById('processName').value;
    const arrivalTime = parseInt(document.getElementById('arrivalTime').value);
    const executionTime = parseInt(document.getElementById('executionTime').value);

    processes.push({ 
        name: processName, 
        arrival: arrivalTime, 
        execution: executionTime, 
        remaining: executionTime 
    });
    document.getElementById('processName').value = '';
    document.getElementById('arrivalTime').value = '';
    document.getElementById('executionTime').value = '';
}
function drawGanttChart() {
    let quantum = parseInt(document.getElementById('quantum').value);
    let currentTime = 0;
    let seriesData = [];
    let processQueue = processes.filter(p => p.arrival <= currentTime);
    let inQueue = new Set(processQueue.map(p => p.name));
    processes.forEach(p => {
        p.waitTime = 0;
        p.lastExecutedTime = p.arrival;
    });

    while (processQueue.length > 0) {
        let currentProcess = processQueue.shift();
        inQueue.delete(currentProcess.name);

        if (currentProcess.remaining > 0) {
            const executionTime = Math.min(currentProcess.remaining, quantum);
            currentProcess.waitTime += currentTime - currentProcess.lastExecutedTime;
            seriesData.push({
                name: currentProcess.name,
                start: Date.UTC(1970, 0, 1, 0, 0, currentTime),
                end: Date.UTC(1970, 0, 1, 0, 0, currentTime + executionTime),
                y: processes.findIndex(p => p.name === currentProcess.name)
            });

            currentTime += executionTime;
            currentProcess.remaining -= executionTime;
            currentProcess.lastExecutedTime = currentTime;
            processes.filter(p => p.arrival > currentProcess.arrival && p.arrival <= currentTime && !inQueue.has(p.name))
                .forEach(p => {
                    processQueue.push(p);
                    inQueue.add(p.name);
                });
            if (currentProcess.remaining > 0) {
                processQueue.push(currentProcess);
                inQueue.add(currentProcess.name);
            }
        }
    }
    Highcharts.ganttChart('ganttChartContainer', {
        series: [{
            name: 'Procesos',
            data: seriesData
        }],
        title: {
            text: 'Diagrama de Gantt - Planificación Round Robin'
        },
        xAxis: {
            min: Date.UTC(1970, 0, 1),
            max: Date.UTC(1970, 0, 1, 0, 0, currentTime)
        },
        yAxis: {
            type: 'category',
            categories: processes.map(p => p.name)
        }
    });

    displayResults();
}



function displayResults() {
    const tableBody = document.getElementById('resultsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;

    processes.forEach(process => {
        const turnaroundTime = process.execution + process.waitTime;
        totalWaitTime += process.waitTime;
        totalTurnaroundTime += turnaroundTime;

        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${process.name}</td>
            <td>${turnaroundTime}</td>
            <td>${process.waitTime}</td>
        `;
    });
    const avgWaitTime = totalWaitTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const avgRow = tableBody.insertRow();
    avgRow.innerHTML = `
        <td>Promedio</td>
        <td>${avgTurnaroundTime.toFixed(2)}</td>
        <td>${avgWaitTime.toFixed(2)}</td>
    `;
}
