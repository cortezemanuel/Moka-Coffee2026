import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { ProductModel } from "./src/models/product.model.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.error(err));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  try {
    const products = await ProductModel.find().lean();
    socket.emit("updateProducts", products);
  } catch (error) {
    console.error(error);
  }

  socket.on("newProduct", async (product) => {
    try {
      await ProductModel.create(product);
      const products = await ProductModel.find().lean();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error(error);
    }
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
