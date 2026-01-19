import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async create() {
    const carts = await this.getAll();

    const cart = {
      id: uuidv4(),
      products: [],
    };

    carts.push(cart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }

  async getById(id) {
    const carts = await this.getAll();
    const cart = carts.find((c) => c.id === id);
    if (!cart) throw new Error("Cart not found");
    return cart;
  }

  async addProdToCart(cid, pid) {
    const carts = await this.getAll();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) throw new Error("Cart not found");

    const prod = cart.products.find((p) => p.product === pid);

    if (prod) {
      prod.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export const cartManager = new CartManager("./data/carts.json");
