let tabla = document.getElementById("tabla");
let celdas = document.getElementsByClassName("celda");
let filas = parseInt(document.getElementById("filas").value);
let columnas = parseInt(document.getElementById("columnas").value);

// Función para obtener el índice de la celda actual
function obtenerIndiceCeldaActual() {
    let celdaActual = document.activeElement;
    for (let i = 0; i < celdas.length; i++) {
        if (celdas[i] === celdaActual) {
            return i;
        }
    }
    return -1; // No se encontró la celda actual en la lista de celdas
}

// Función para mover el foco a la celda en la dirección especificada
function moverFoco(direccion) {
    let indiceActual = obtenerIndiceCeldaActual();
    let filaActual = Math.floor(indiceActual / columnas);
    let columnaActual = indiceActual % columnas;
    let nuevaFila, nuevaColumna, nuevaCelda;

    switch (direccion) {
        case "arriba":
            nuevaFila = filaActual - 1;
            nuevaColumna = columnaActual;
            break;
        case "abajo":
            nuevaFila = filaActual + 1;
            nuevaColumna = columnaActual;
            break;
        case "izquierda":
            nuevaFila = filaActual;
            nuevaColumna = columnaActual - 1;
            break;
        case "derecha":
            nuevaFila = filaActual;
            nuevaColumna = columnaActual + 1;
            break;
        default:
            return; // Dirección no válida, salir sin hacer nada
    }

    if (nuevaFila < 0 || nuevaFila >= filas || nuevaColumna < 0 || nuevaColumna >= columnas) {
        return; // La nueva posición está fuera de los límites de la tabla, salir sin hacer nada
    }

    nuevaCelda = tabla.rows[nuevaFila + 1].cells[nuevaColumna + 1];
    nuevaCelda.querySelector("input").focus();
}

// Validar la entrada en las celdas
for (let i = 0; i < celdas.length; i++) {
    celdas[i].addEventListener("blur", function() {
        let valor = this.value;

        // Verificar si el valor es un número válido
        if (!/^(\-)?(\d+)?(\.\d+)?$/.test(valor)) {
            this.value = ""; // Limpiar el valor de la celda
            this.setAttribute("placeholder", "Error en la celda"); // Mostrar mensaje de error
        }
    });

    celdas[i].addEventListener("keydown", function(event) {
        let tecla = event.key;

        // Permitir el uso de la tecla de flecha sin validación
        if (tecla === "ArrowUp" || tecla === "ArrowDown" || tecla === "ArrowLeft" || tecla === "ArrowRight") {
            return;
        }

        let valor = this.value;
        let cursorPosition = this.selectionStart;

        // Verificar si se ingresó un número válido con un solo punto decimal y signo menos después de un número con punto decimal
        if (!/^(\-)?(\d+)?(\.\d*)?$/.test(valor) && (tecla !== "." || cursorPosition === 0)) {
            event.preventDefault();
            this.setAttribute("placeholder", "Error en la celda"); // Mostrar mensaje de error
            return;
        }

        // Verificar si se ingresó un segundo punto decimal en el número
        if (valor.indexOf(".") !== -1 && tecla === ".") {
            event.preventDefault();
            this.setAttribute("placeholder", "Error en la celda"); // Mostrar mensaje de error
            return;
        }

        // Verificar si se ingresó un segundo signo menos en el número
        if (valor.indexOf("-") !== -1 && tecla === "-") {
            event.preventDefault();
            this.setAttribute("placeholder", "Error en la celda"); // Mostrar mensaje de error
            return;
        }
    });
}

// Resto del código...


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

document.getElementById("generar").addEventListener("click", function() {
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);
    tabla.innerHTML = "";
    for (let i = 0; i <= filas; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j <= columnas; j++) {
            let td = document.createElement("td");
            if (i === 0 && j === 0) {
                td.innerHTML = "";
            } else if (i === 0) {
                td.innerHTML = String.fromCharCode(64 + j);
            } else if (j === 0) {
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
                input.addEventListener("keydown", function(event) {
                    let tecla = event.key;
                    if (tecla === "ArrowUp") {
                        moverFoco("arriba");
                        event.preventDefault();
                    } else if (tecla === "ArrowDown") {
                        moverFoco("abajo");
                        event.preventDefault();
                    } else if (tecla === "ArrowLeft") {
                        moverFoco("izquierda");
                        event.preventDefault();
                    } else if (tecla === "ArrowRight") {
                        moverFoco("derecha");
                        event.preventDefault();
                    }
                });
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
});
