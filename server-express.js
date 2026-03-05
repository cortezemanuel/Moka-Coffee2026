import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { ProductModel } from "./src/models/product.model.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

mongoose.connect(
  "mongodb+srv://cortezemanuel7_db_user:WFV0YICyb9j4JZsk@cluster0.9pa2ltp.mongodb.net/mokacoffee",
);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  const products = await ProductModel.find().lean();
  socket.emit("updateProducts", products);

  socket.on("newProduct", async (product) => {
    await ProductModel.create(product);
    const products = await ProductModel.find().lean();
    io.emit("updateProducts", products);
  });
});

httpServer.listen(8080, () => {
  console.log("Server running on port 8080");
});
