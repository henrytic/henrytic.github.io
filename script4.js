 type="text/javascript"
        let tabla = document.getElementById("tabla");
        let celdas = document.getElementsByClassName("celda");

        for (let i = 0; i < celdas.length; i++) {
            celdas[i].addEventListener("blur", function() {
                let valor = this.value;
                if (valor[0] == "=") {
                    let formula = valor.substring(1);
                    let resultado = eval(formula);
                    this.value = resultado;
                }
            });
        }

        document.getElementById("guardar").addEventListener("click", function() {
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);
    let data = {filas: filas, columnas: columnas, celdas: []};
    for (let i = 0; i < celdas.length; i++) {
        data.celdas.push(celdas[i].value);
    }
    let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
});

document.getElementById("cargar").addEventListener("click", function() {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", function() {
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = JSON.parse(e.target.result);
        document.getElementById("filas").value = data.filas;
        document.getElementById("columnas").value = data.columnas;
        document.getElementById("generar").click();
        for (let i = 0; i < data.celdas.length; i++) {
            celdas[i].value = data.celdas[i];
        }
    };
    reader.readAsText(file);
});
//-------------------------------------------------------
document.getElementById("file-input").addEventListener("change", function() {
    let file = this.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = JSON.parse(e.target.result);
        for (let i = 0; i < data.length; i++) {
            celdas[i].value = data[i];
        }
    };
    reader.readAsText(file);
});


document.getElementById("generar").addEventListener("click", function() {
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);
    let tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    for (let i = 0; i <= filas; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j <= columnas; j++) {
            let td = document.createElement("td");
            if (i == 0 && j == 0) {
                td.innerHTML = "";
            } else if (i == 0) {
                td.innerHTML = String.fromCharCode(64 + j);
            } else if (j == 0) {
                td.innerHTML = i;
            } else {
                let input = document.createElement("input");
                input.type = "text";
                input.className = "celda";
                input.addEventListener("blur", function() {
                    let valor = this.value;
                    if (valor[0] == "=") {
                        let formula = valor.substring(1);
                        let resultado = eval(formula);
                        this.value = resultado;
                    }
                });
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
});


    