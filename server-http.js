import http from "http";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Hola Mundo");
  }
  if (req.url === "/products") {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify([
        { id: 1, name: "producto 1" },
        { id: 2, name: "producto 2" },
      ])
    );
  }
});

server.listen(8080, () => console.log("Servidor escuchando el puerto 8080"));
