import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;

  let filter = {};
  if (query) {
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else {
      filter.category = query;
    }
  }

  let sortOption = {};
  if (sort === "asc") sortOption.price = 1;
  if (sort === "desc") sortOption.price = -1;

  const result = await ProductModel.paginate(filter, {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOption,
    lean: true,
  });

  res.render("home", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
  });
});

router.get("/products/:pid", async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();
  res.render("productDetail", { product });
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cartDetail", { cart });
  } catch (error) {
    res.status(400).send("ID de carrito inválido");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
