document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("matrix-form");
  const resultArea = document.getElementById("result");
  const generateInputsButton = document.getElementById("generateInputs");
  const matrixInputsContainer = document.getElementById("matrixInputs");
  const calculateButton = document.getElementById("calculate");

  if (!form) {
    console.error(
      "El formulario con ID 'matrix-form' no se encontró en el DOM."
    );
    return;
  }

  // Evento para generar los campos de entrada de las matrices
  generateInputsButton.addEventListener("click", () => {
    const rowsA = parseInt(document.getElementById("rowsA").value);
    const colsA = parseInt(document.getElementById("colsA").value);
    const rowsB = parseInt(document.getElementById("rowsB").value);
    const colsB = parseInt(document.getElementById("colsB").value);

    if (isNaN(rowsA) || isNaN(colsA) || isNaN(rowsB) || isNaN(colsB)) {
      resultArea.innerHTML =
        "Por favor, ingresa valores válidos para las dimensiones.";
      return;
    }

    if (colsA !== rowsB) {
      resultArea.innerHTML =
        "Error: El número de columnas de la Matriz A debe ser igual al número de filas de la Matriz B.";
      return;
    }

    // Limpiar el contenedor de entradas
    matrixInputsContainer.innerHTML = "";

    // Generar campos para la Matriz A
    const matrixAContainer = document.createElement("div");
    matrixAContainer.innerHTML = `<h3>Matriz A</h3>`;
    for (let i = 0; i < rowsA; i++) {
      const row = document.createElement("div");
      for (let j = 0; j < colsA; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.id = `matrixA-${i}-${j}`;
        input.placeholder = `A[${i}][${j}]`;
        row.appendChild(input);
      }
      matrixAContainer.appendChild(row);
    }
    matrixInputsContainer.appendChild(matrixAContainer);

    // Generar campos para la Matriz B
    const matrixBContainer = document.createElement("div");
    matrixBContainer.innerHTML = `<h3>Matriz B</h3>`;
    for (let i = 0; i < rowsB; i++) {
      const row = document.createElement("div");
      for (let j = 0; j < colsB; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.id = `matrixB-${i}-${j}`;
        input.placeholder = `B[${i}][${j}]`;
        row.appendChild(input);
      }
      matrixBContainer.appendChild(row);
    }
    matrixInputsContainer.appendChild(matrixBContainer);
  });

  // Evento para calcular el producto de las matrices
  calculateButton.addEventListener("click", async () => {
    const rowsA = parseInt(document.getElementById("rowsA").value);
    const colsA = parseInt(document.getElementById("colsA").value);
    const rowsB = parseInt(document.getElementById("rowsB").value);
    const colsB = parseInt(document.getElementById("colsB").value);

    const matrixA = getMatrixInput("matrixA", rowsA, colsA);
    const matrixB = getMatrixInput("matrixB", rowsB, colsB);

    const response = await fetch("/multiply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matrixA, matrixB }),
    });

    if (response.ok) {
      const result = await response.json();
      displayResult(result);
    } else {
      resultArea.innerHTML = "Error al multiplicar las matrices.";
    }
  });

  function getMatrixInput(matrixId, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const value = parseFloat(
          document.getElementById(`${matrixId}-${i}-${j}`).value
        );
        row.push(isNaN(value) ? 0 : value);
      }
      matrix.push(row);
    }
    return matrix;
  }

  function displayResult(result) {
    resultArea.innerHTML = "<h2>Resultado de la multiplicación:</h2>";
    resultArea.innerHTML +=
      "<pre>" + JSON.stringify(result.result, null, 2) + "</pre>";
  }
});
