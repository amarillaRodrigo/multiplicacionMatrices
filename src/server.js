const http = require("http");
const fs = require("fs");
const path = require("path");
const { multiplyMatrices, multiplyMatricesTF } = require("./utils/matrixOperations");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/multiply") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { matrixA, matrixB } = JSON.parse(body);
      const result = multiplyMatrices(matrixA, matrixB);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ result }));
    });
  } else if (req.method === "POST" && req.url === "/multiply-tf") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { rowsA, colsA, colsB } = JSON.parse(body);
        
        if (!rowsA || !colsA || !colsB || 
            rowsA <= 0 || colsA <= 0 || colsB <= 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ 
            error: "Dimensiones inválidas. Asegúrate de proporcionar valores positivos." 
          }));
          return;
        }
        
        const result = await multiplyMatricesTF(Number(rowsA), Number(colsA), Number(colsB));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    let filePath = path.join(
      __dirname,
      "..",
      "public",
      req.url === "/" ? "index.html" : req.url
    );

    const extname = path.extname(filePath);
    let contentType = "text/html";

    switch (extname) {
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "application/javascript";
        break;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("<h1>404 - Archivo no encontrado</h1>");
        } else {
          res.writeHead(500);
          res.end(`Error del servidor: ${err.code}`);
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  }
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});