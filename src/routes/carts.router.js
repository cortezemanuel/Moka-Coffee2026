import { Router } from "express";
import { CartModel } from "../models/cart.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.send(cart);
});

router.get("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.send(cart);
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);

  const existingProduct = cart.products.find(
    (p) => p.product.toString() === pid,
  );

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();

  res.send(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);

  cart.products = cart.products.filter((p) => p.product.toString() !== pid);

  await cart.save();

  res.send({ status: "success" });
});

router.put("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);

  cart.products = req.body.products;

  await cart.save();

  res.send({ status: "success" });
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;

  const cart = await CartModel.findById(req.params.cid);

  const product = cart.products.find(
    (p) => p.product.toString() === req.params.pid,
  );

  if (product) {
    product.quantity = quantity;
  }

  await cart.save();

  res.send({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid);

  cart.products = [];

  await cart.save();

  res.send({ status: "success" });
});

export default router;
