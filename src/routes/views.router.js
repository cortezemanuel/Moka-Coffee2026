import { Router } from "express";
import { productManager } from "../../managers/ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("home", {
    products: await productManager.getAll(),
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
