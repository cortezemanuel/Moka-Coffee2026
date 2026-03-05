import { Product } from "../models/product.model.js";

export const productController = {
  getAll: async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

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

      const result = await Product.paginate(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true,
      });

      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  },

  getById: async (req, res) => {
    res.json(await Product.findById(req.params.pid));
  },

  create: async (req, res) => {
    res.json(await Product.create(req.body));
  },

  update: async (req, res) => {
    res.json(
      await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true }),
    );
  },

  delete: async (req, res) => {
    res.json(await Product.findByIdAndDelete(req.params.pid));
  },
};
