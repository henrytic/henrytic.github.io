let tabla = document.getElementById("tabla");
let celdas = document.getElementsByClassName("celda");
let filas = parseInt(document.getElementById("filas").value);
let columnas = parseInt(document.getElementById("columnas").value);
let isShiftPressed = false;
let startSelectionIndex = -1;

// Función para obtener el índice de la celda actual
function obtenerIndiceCeldaActual() {
  let celdaActual = document.activeElement;
  for (let i = 0; i < celdas.length; i++) {
    if (celdas[i] === celdaActual) {
      return i;
    }
  }
  return -1; // retorna si no se encuentra
}

// Agrega event listener para el botón "Generar tabla"
document.getElementById("generar").addEventListener("click", function() {
  filas = parseInt(document.getElementById("filas").value);
  columnas = parseInt(document.getElementById("columnas").value);
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
        input.name = "input" + (i - 1) + (j - 1);
        input.id = "input" + (i - 1) + (j - 1);
        input.setAttribute("spellcheck", "false");
        input.setAttribute("data-ms-editor", "true");

        input.addEventListener("blur", function() {
          let valor = this.value;
          if (valor[0] == "=") {
            let formula = valor.substring(1);
            let resultado = eval(formula);
            this.value = resultado;
          }
        });

        input.addEventListener("click", function(event) {
          if (event.shiftKey && isShiftPressed && startSelectionIndex >= 0) {
            let currentIndex = obtenerIndiceCeldaActual();
            if (currentIndex >= 0) {
              celdas[currentIndex].classList.add("highlight");
            }
          } else {
            let celdas = document.getElementsByClassName("celda");
            for (let i = 0; i < celdas.length; i++) {
              celdas[i].classList.remove("highlight");
            }
            this.classList.add("highlight");
            startSelectionIndex = obtenerIndiceCeldaActual();
          }
        });

        td.appendChild(input);
      }

      tr.appendChild(td);
    }

    tabla.appendChild(tr);
  }
});

// Agrega event listeners para controlar el estado de la tecla Shift
document.addEventListener('keydown', event => {
  if (event.key === 'Shift') {
    isShiftPressed = true;
  }
});

document.addEventListener('keyup', event => {
  if (event.key === 'Shift') {
    isShiftPressed = false;
    startSelectionIndex = -1;
  }
});

//-------------------------------------------------------------------------------------------------------------//
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


document.getElementById("limpiarDatos").addEventListener("click", function() {
    // Limpiar los datos de las celdas
    for (let i = 0; i < celdas.length; i++) {
        celdas[i].value = "";
    }
});

//---------------------------------------------------------------------------------------------------------------------------------

// Función para obtener los valores de una columna específica
function obtenerValoresColumna(columna) {
    let valores = [];
    for (let i = columna; i < celdas.length; i += columnas) {
      valores.push(celdas[i].value);
    }
    return valores;
  }
  
  // Función para establecer los valores de una columna específica
  function establecerValoresColumna(columna, valores) {
    for (let i = columna; i < celdas.length; i += columnas) {
      celdas[i].value = valores.shift();
    }
  }
  
  // Función de ordenamiento QuickSort
  function quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }
  
    const pivot = arr[Math.floor(arr.length / 2)];
    const less = [];
    const equal = [];
    const greater = [];
  
    for (let item of arr) {
      if (item < pivot) {
        less.push(item);
      } else if (item > pivot) {
        greater.push(item);
      } else {
        equal.push(item);
      }
    }
  
    return [...quickSort(less), ...equal, ...quickSort(greater)];
  }
  
  document.getElementById("ascendente").addEventListener("click", function() {
    const letra = document.getElementById("columnaInput").value.toUpperCase();
    const columna = letra.charCodeAt(0) - 65;
    if (columna < 0 || columna >= columnas) {
      alert("Ingrese una letra de columna válida");
      return;
    }
  
    const valoresColumna = obtenerValoresColumna(columna);
    const valoresOrdenados = quickSort(valoresColumna);
    establecerValoresColumna(columna, valoresOrdenados);
  });
  
  // Evento click en el botón "descendente"
  document.getElementById("descendente").addEventListener("click", function() {
    const letra = document.getElementById("columnaInput").value.toUpperCase();
    const columna = letra.charCodeAt(0) - 65;
    if (columna < 0 || columna >= columnas) {
      alert("Ingrese una letra de columna válida");
      return;
    }
  
    const valoresColumna = obtenerValoresColumna(columna);
    const valoresOrdenados = quickSort(valoresColumna).reverse();
    establecerValoresColumna(columna, valoresOrdenados);
  });
  
  //-----------------------------------------------------------------------------------------------------------
  // Función para obtener los valores numéricos de todas las celdas
/*function obtenerValoresNumericos() {
    const valores = [];
    for (let i = 0; i < celdas.length; i++) {
      const valor = parseFloat(celdas[i].value);
      if (!isNaN(valor)) {
        valores.push(valor);
      }
    }
    return valores;
  }*/
  function obtenerValoresNumericos(celdas) {
    const valores = [];
    for (let i = 0; i < celdas.length; i++) {
      const valor = parseFloat(celdas[i].value);
      if (!isNaN(valor)) {
        valores.push(valor);
      }
    }
    return valores;
  }
  
  // Evento click en el botón "Sumar"
  /*
  document.getElementById("sumar").addEventListener("click", function() {
    const valoresNumericos = obtenerValoresNumericos();
    if (valoresNumericos.length === 0) {
      alert("No hay valores numéricos para sumar");
      return;
    }
  
    const suma = valoresNumericos.reduce((total, valor) => total + valor, 0);
    mostrarResultados(["La suma de todas las celdas es: " + suma]);
  });
  
  // Evento click en el botón "Promedio"
  document.getElementById("promedio").addEventListener("click", function() {
    const valoresNumericos = obtenerValoresNumericos();
    if (valoresNumericos.length === 0) {
      alert("No hay valores numéricos para calcular el promedio");
      return;
    }
  
    const suma = valoresNumericos.reduce((total, valor) => total + valor, 0);
    const promedio = suma / valoresNumericos.length;
    mostrarResultados(["El promedio de todas las celdas es: " + promedio]);
  });
  
  // Evento click en el botón "Máximo"
  document.getElementById("maximo").addEventListener("click", function() {
    const valoresNumericos = obtenerValoresNumericos();
    if (valoresNumericos.length === 0) {
      alert("No hay valores numéricos para encontrar el máximo");
      return;
    }
  
    const maximo = Math.max(...valoresNumericos);
    mostrarResultados(["El valor máximo de todas las celdas es: " + maximo]);
  });
  
  // Evento click en el botón "Mínimo"
  document.getElementById("minimo").addEventListener("click", function() {
    const valoresNumericos = obtenerValoresNumericos();
    if (valoresNumericos.length === 0) {
      alert("No hay valores numéricos para encontrar el mínimo");
      return;
    }
  
    const minimo = Math.min(...valoresNumericos);
    mostrarResultados(["El valor mínimo de todas las celdas es: " + minimo]);
  });*/
  // Evento click en el botón "Sumar"
// Evento click en el botón "Sumar"
// Evento click en el botón "Sumar"
// Evento click en el botón "Sumar"
// Evento click en el botón "Sumar"
document.getElementById("sumar").addEventListener("click", function() {
  const celdasSeleccionadas = Array.from(document.getElementsByClassName("highlight"));
  
  if (celdasSeleccionadas.length < 2) {
    const todosValoresNumericos = obtenerValoresNumericos(celdas);
    const suma = todosValoresNumericos.reduce((total, valor) => total + valor, 0);
    mostrarResultados(["La suma de todas las celdas es: " + suma]);
  } else {
    const valoresNumericos = obtenerValoresNumericos(celdasSeleccionadas);
    const suma = valoresNumericos.reduce((total, valor) => total + valor, 0);
    mostrarResultados(["La suma de las celdas seleccionadas es: " + suma]);
  }
});

// Evento click en el botón "Promedio"
document.getElementById("promedio").addEventListener("click", function() {
  const celdasSeleccionadas = Array.from(document.getElementsByClassName("highlight"));
  
  if (celdasSeleccionadas.length < 2) {
    const todosValoresNumericos = obtenerValoresNumericos(celdas);
    const suma = todosValoresNumericos.reduce((total, valor) => total + valor, 0);
    const promedio = suma / todosValoresNumericos.length;
    mostrarResultados(["El promedio de todas las celdas es: " + promedio]);
  } else {
    const valoresNumericos = obtenerValoresNumericos(celdasSeleccionadas);
    const suma = valoresNumericos.reduce((total, valor) => total + valor, 0);
    const promedio = suma / valoresNumericos.length;
    mostrarResultados(["El promedio de las celdas seleccionadas es: " + promedio]);
  }
});

// Evento click en el botón "Máximo"
document.getElementById("maximo").addEventListener("click", function() {
  const celdasSeleccionadas = Array.from(document.getElementsByClassName("highlight"));
  
  if (celdasSeleccionadas.length < 2) {
    const todosValoresNumericos = obtenerValoresNumericos(celdas);
    const maximo = Math.max(...todosValoresNumericos);
    mostrarResultados(["El valor máximo de todas las celdas es: " + maximo]);
  } else {
    const valoresNumericos = obtenerValoresNumericos(celdasSeleccionadas);
    const maximo = Math.max(...valoresNumericos);
    mostrarResultados(["El valor máximo de las celdas seleccionadas es: " + maximo]);
  }
});

// Evento click en el botón "Mínimo"
document.getElementById("minimo").addEventListener("click", function() {
  const celdasSeleccionadas = Array.from(document.getElementsByClassName("highlight"));
  
  if (celdasSeleccionadas.length < 2) {
    const todosValoresNumericos = obtenerValoresNumericos(celdas);
    const minimo = Math.min(...todosValoresNumericos);
    mostrarResultados(["El valor mínimo de todas las celdas es: " + minimo]);
  } else {
    const valoresNumericos = obtenerValoresNumericos(celdasSeleccionadas);
    const minimo = Math.min(...valoresNumericos);
    mostrarResultados(["El valor mínimo de las celdas seleccionadas es: " + minimo]);
  }
});



  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');

  // Abre el modal
  function openModal() {
    modal.style.display = 'flex';
  }

  // Cierra el modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Asigna el evento click al botón de cerrar modal
  modalClose.addEventListener('click', closeModal);

  const modalBody = document.querySelector('.modal-body');

  function mostrarResultados(resultados) {
    // Limpia el contenido actual del modal-body
    modalBody.innerHTML = '';
  
    // Crea elementos para mostrar los resultados
    for (const resultado of resultados) {
      const resultadoElemento = document.createElement('p');
      resultadoElemento.textContent = resultado;
      modalBody.appendChild(resultadoElemento);
    }
  
    // Abre el modal
    openModal();
  }
  //03/07/2023-------------------------------------------------------------------------------




  // Función para mover el foco a la celda en la dirección especificada
  /*
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
          return; 
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
  
  */

/*document.getElementById("generar").addEventListener("click", function() {
    let filas = parseInt(document.getElementById("filas").value);
    let columnas = parseInt(document.getElementById("columnas").value);
    tabla.innerHTML = "";
    let inputCount = 1; // Contador para el atributo name
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
                input.type = "number"; // Cambio realizado: tipo de input numérico
                input.className = "celda";
                input.name = "input" + inputCount; // Asignar el atributo name
                inputCount++; // Incrementar el contador
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
*/