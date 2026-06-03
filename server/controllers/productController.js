import Product from "../models/Product.js";
import Review from "../models/Review.js";
import ApiFeatures from "../utils/apiFeatures.js";
import cloudinary from "../config/cloudinary.js";

//get products
export const getProducts = async (req, res, next) => {
  try {
    const totalCount = await Product.countDocuments();

    const features = new ApiFeatures(
      Product.find().populate("category", "name slug"),
      req.query,
    )
      .search()
      .filter()
      .sort()
      .paginate();

    const products = await features.query;

    res.json({
      success: true,
      count: products.length,
      total: totalCount,
      products,
    });
  } catch (error) {
    next(error);
  }
};

//getProductById
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "name avatar")
      .sort("-createdAt");

    res.json({ product, reviews });
  } catch (error) {
    next(error);
  }
};

//CreateProduct(admin)
export const createProduct = async (req, res, next) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);                                    

    const { name, description, price, category, stock } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log('CREATE ERROR:', error.message)
    next(error);
  }
};

//updateProduct (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not Found",
      });
    }

    // Naye images upload hue hain?
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      // Purani images ke saath naye add karo
      req.body.images = [...product.images, ...newImages];
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
};

//deleteProduct (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not Found",
      });
    }

    // Cloudinary se images delete karo
    for (const imageUrl of product.images) {
      try {
        // URL se public_id nikalo
        const parts = imageUrl.split("/");
        const filename = parts[parts.length - 1];
        const publicId = `ecommerce/products/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Image delete error:", err);
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const existing = await Review.findOne({
      product: req.params.id,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Review already given",
      });
    }

    await Review.create({
      product: req.params.id,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review Added",
    });
  } catch (error) {
    next(error);
  }
};
