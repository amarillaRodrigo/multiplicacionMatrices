document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("matrix-form");
  const generateAndCalculateBtn = document.getElementById("generateAndCalculate");
  const matrixADisplay = document.querySelector("#matrixADisplay .matrix-content");
  const matrixBDisplay = document.querySelector("#matrixBDisplay .matrix-content");
  const resultDisplay = document.querySelector("#resultDisplay .matrix-content");
  
  if (!form || !generateAndCalculateBtn) {
    console.error("No se encontraron elementos fundamentales en el DOM.");
    return;
  }
  
  generateAndCalculateBtn.addEventListener("click", async () => {
    const rowsA = parseInt(document.getElementById("rowsA").value);
    const colsA = parseInt(document.getElementById("colsA").value);
    const colsB = parseInt(document.getElementById("colsB").value);
    
    if (isNaN(rowsA) || isNaN(colsA) || isNaN(colsB) || 
        rowsA <= 0 || colsA <= 0 || colsB <= 0) {
      alert("Por favor, ingresa dimensiones válidas para las matrices (valores positivos).");
      return;
    }
    
    try {
      document.body.classList.add("loading");
      
      const response = await fetch("/multiply-tf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rowsA, colsA, colsB }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la solicitud al servidor");
      }
      
      const data = await response.json();
      
      displayMatrix(matrixADisplay, data.matrixA);
      displayMatrix(matrixBDisplay, data.matrixB);
      displayMatrix(resultDisplay, data.result);
      
      document.getElementById("result-container").style.display = "block";
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      document.body.classList.remove("loading");
    }
  });
  
  function displayMatrix(container, matrix) {
    container.innerHTML = "";
    
    if (!matrix || matrix.length === 0) {
      container.innerHTML = "<p>No hay datos disponibles</p>";
      return;
    }
    
    const table = document.createElement("table");
    
    for (let i = 0; i < matrix.length; i++) {
      const row = document.createElement("tr");
      
      for (let j = 0; j < matrix[i].length; j++) {
        const cell = document.createElement("td");
        cell.textContent = matrix[i][j];
        row.appendChild(cell);
      }
      
      table.appendChild(row);
    }
    
    container.appendChild(table);
  }
});
