const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define Mongoose Schemas & Models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: Number, default: 0 }, // Default role as 'customer' (0)
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  brand: String,
  category: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link product to user
});

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);

// ✅ Middleware to Validate JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }
    req.user = decoded; // Attach user data to request
    next();
  });
};

// ✅ Signup Route
app.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 0,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Signin Route
app.post("/user/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "✅ Sign-in successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Sign-in Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Get Currently Logged-in User Details
app.get("/user/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ username: user.username, email: user.email, role: user.role });
  } catch (error) {
    console.error("❌ Get User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ NEW: Get Products for Logged-in User
app.get("/product/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    console.error("❌ Get Products Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ NEW: Add Product
app.post("/product/products", verifyToken, async (req, res) => {
  try {
    const { name, description, price, brand, category } = req.body;
    console.log("Received Data:", req.body); // Debugging line
    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Product name and price are required" });
    }

    console.log("Received Data:", req.body); // Debugging line

    const newProduct = new Product({
      name,
      description,
      price: Number(price), // Ensure price is a number
      brand,
      category,
      userId: req.user.id,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "✅ Product added successfully", product: newProduct });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ NEW: Update Product
app.put("/product/products/:id", verifyToken, async (req, res) => {
  try {
    const { name, description, price, brand, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price), // ✅ Ensure price is a number
        brand,
        category,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// for detail page
app.get("/product/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure regionId is a string
    const productData = {
      ...product._doc,
      regionId: String(product.regionId || ""),
    };

    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//deleting product
app.delete("/product/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
