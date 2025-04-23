const tf = require('@tensorflow/tfjs');

function multiplyMatrices(matrixA, matrixB) {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  if (colsA !== rowsB) {
    throw new Error("Las matrices no se pueden multiplicar.");
  }

  const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return result;
}

/**
 @param {number} rows 
 @param {number} cols 
 @returns {tf.Tensor2D} 
 */

function generateRandomMatrix(rows, cols) {
  
  const randomMatrix = tf.randomUniform([rows, cols]);
  return tf.tidy(() => {
    return tf.add(tf.mul(randomMatrix, 19), 1).floor();
  });
}

/**
 
 * @param {number} rowsA 
 * @param {number} colsA 
 * @param {number} colsB 
 * @returns {Object} 
 */

async function multiplyMatricesTF(rowsA, colsA, colsB) {
  try {

    const rowsB = colsA;
    const matrixA = generateRandomMatrix(rowsA, colsA);
    const matrixB = generateRandomMatrix(rowsB, colsB);
    
    const resultMatrix = tf.matMul(matrixA, matrixB);
    
    const matrixAData = await matrixA.array();
    const matrixBData = await matrixB.array();
    const resultData = await resultMatrix.array();
    
    tf.dispose([matrixA, matrixB, resultMatrix]);
    
    return {
      matrixA: matrixAData,
      matrixB: matrixBData,
      result: resultData
    };
  } catch (error) {
    throw new Error(`Error en la multiplicación de matrices: ${error.message}`);
  }
}

module.exports = {
  multiplyMatrices,
  multiplyMatricesTF
};