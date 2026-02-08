import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

import { productManager } from "./managers/ProductManager.js";
import { cartManager } from "./managers/CartManager.js";
import viewsRouter from "./src/routes/views.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", viewsRouter);

app.get("/api/products", async (req, res) => {
  res.json(await productManager.getAll());
});

app.get("/api/products/:pid", async (req, res) => {
  res.json(await productManager.getById(req.params.pid));
});

app.post("/api/products", async (req, res) => {
  const product = await productManager.create(req.body);
  const io = app.get("io");
  io.emit("products", await productManager.getAll());
  res.json(product);
});

app.put("/api/products/:pid", async (req, res) => {
  res.json(await productManager.update(req.params.pid, req.body));
});

app.delete("/api/products/:pid", async (req, res) => {
  const deleted = await productManager.delete(req.params.pid);
  const io = app.get("io");
  io.emit("products", await productManager.getAll());
  res.json(deleted);
});

app.post("/api/carts", async (req, res) => {
  res.json(await cartManager.create());
});

app.get("/api/carts/:cid", async (req, res) => {
  res.json(await cartManager.getById(req.params.cid));
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  res.json(await cartManager.addProdToCart(req.params.cid, req.params.pid));
});

const httpServer = app.listen(8080, () =>
  console.log("Server running on port 8080"),
);

const io = new Server(httpServer);
app.set("io", io);

io.on("connection", async (socket) => {
  socket.emit("products", await productManager.getAll());

  socket.on("addProduct", async (product) => {
    await productManager.create(product);
    io.emit("products", await productManager.getAll());
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.delete(id);
    io.emit("products", await productManager.getAll());
  });
});
