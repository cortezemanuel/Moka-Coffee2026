import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async create(body) {
    const products = await this.getAll();

    const product = {
      id: uuidv4(),
      status: true,
      ...body,
    };

    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async update(id, body) {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    products[index] = { ...products[index], ...body, id };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async delete(id) {
    const products = await this.getAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    const deleted = products.splice(index, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return deleted[0];
  }
}

export const productManager = new ProductManager("./data/products.json");
