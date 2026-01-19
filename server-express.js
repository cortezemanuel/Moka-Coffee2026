import express from "express";
import { productManager } from "./managers/ProductManager.js";
import { cartManager } from "./managers/CartManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* PRODUCTS */
app.get("/api/products", async (req, res) => {
  res.json(await productManager.getAll());
});

app.get("/api/products/:pid", async (req, res) => {
  res.json(await productManager.getById(req.params.pid));
});

app.post("/api/products", async (req, res) => {
  res.json(await productManager.create(req.body));
});

app.put("/api/products/:pid", async (req, res) => {
  res.json(await productManager.update(req.params.pid, req.body));
});

app.delete("/api/products/:pid", async (req, res) => {
  res.json(await productManager.delete(req.params.pid));
});

/* CARTS */
app.post("/api/carts", async (req, res) => {
  res.json(await cartManager.create());
});

app.get("/api/carts/:cid", async (req, res) => {
  res.json(await cartManager.getById(req.params.cid));
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  res.json(await cartManager.addProdToCart(req.params.cid, req.params.pid));
});

app.listen(8080, () => console.log("Server running on port 8080"));
