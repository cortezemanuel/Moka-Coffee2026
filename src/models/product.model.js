import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  status: Boolean,
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("products", productSchema);
