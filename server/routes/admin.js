import express from 'express';
import upload from '../middleware/upload.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { auth, admin } from '../utils/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// ===== PRODUCT ROUTES =====

// Get all products for admin (with filters)
router.get('/products', auth, admin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      subcategory, 
      search,
      inStock 
    } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ msg: 'Error fetching products' });
  }
});

// Add product (with image upload and additional local image)
import multer from 'multer';
const multiUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'localImage', maxCount: 1 }
]);
router.post('/products', auth, admin, multiUpload, async (req, res) => {
  try {
    let { name, description, price, category, subcategory, ...rest } = req.body;
    // Validate required fields
    if (!name || !description || !price) {
      return res.status(400).json({ msg: 'Името, описанието и цената са задължителни.' });
    }
    if (!category || category === "") {
      return res.status(400).json({ msg: 'Категорията е задължителна.' });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ msg: 'Цената трябва да е положително число.' });
    }
    if (typeof category === 'string') category = category.trim();
    if (typeof subcategory === 'string') subcategory = subcategory.trim();
    if (category === "") category = null;
    if (subcategory === "") subcategory = null;
    let categoryId = undefined;
    if (category) {
      if (!category.match(/^[0-9a-fA-F]{24}$/)) {
        let foundCategory = await Category.findOne({ $or: [ { slug: category }, { name: category } ] });
        if (!foundCategory) {
          const errMsg = 'Category not found by slug or name';
          console.error('Add product error:', errMsg, category);
          return res.status(400).json({ msg: errMsg });
        }
        categoryId = foundCategory._id;
      } else {
        categoryId = category;
      }
    }
    let subcategoryId = subcategory;
    if (subcategory) {
      if (!subcategory.match(/^[0-9a-fA-F]{24}$/)) {
        let foundSubcategory = await Subcategory.findOne({ $or: [ { slug: subcategory }, { name: subcategory } ] });
        if (!foundSubcategory) {
          const errMsg = 'Subcategory not found by slug or name';
          console.error('Add product error:', errMsg, subcategory);
          return res.status(400).json({ msg: errMsg });
        }
        subcategoryId = foundSubcategory._id;
      }
    }
    // Handle image upload
    let imagePath = '';
    if (req.files && req.files['image'] && req.files['image'][0]) {
      let filename = req.files['image'][0].filename;
      imagePath = filename.startsWith('/uploads/') ? filename : `/uploads/${filename}`;
    }
    // Handle additional local image upload for images[]
    let imagesArr = [];
    if (rest.images) {
      if (Array.isArray(rest.images)) {
        imagesArr = rest.images.filter(Boolean).map(img => img.startsWith('/uploads/') ? img : (img.startsWith('http') ? img : `/uploads/${img}`));
      } else if (typeof rest.images === 'string') {
        let img = rest.images;
        imagesArr = [img.startsWith('/uploads/') ? img : (img.startsWith('http') ? img : `/uploads/${img}`)];
      }
    }
    if (req.files && req.files['localImage'] && req.files['localImage'][0]) {
      let filename = req.files['localImage'][0].filename;
      imagesArr.push(filename.startsWith('/uploads/') ? filename : `/uploads/${filename}`);
    }
    try {
      const product = new Product({ name, description, price: parseFloat(price), ...rest, category: categoryId, subcategory: subcategoryId, image: imagePath, images: imagesArr });
      await product.save();
      await product.populate('category', 'name');
      if (product.subcategory) {
        await product.populate('subcategory', 'name');
      }
      res.status(201).json(product);
    } catch (error) {
      console.error('Add product error:', error, req.body);
      res.status(500).json({ msg: 'Error adding product', error: error.message });
    }
  } catch (error) {
    console.error('Add product error (outer):', error, req.body);
    res.status(500).json({ msg: 'Error adding product (outer)', error: error.message });
  }
});

// Edit product
router.put('/products/:id', auth, admin, async (req, res) => {
  try {
    // Fix: Convert empty string category to null to avoid CastError
    if (req.body.category === "") {
      req.body.category = null;
    }
    if (req.body.subcategory === "") {
      req.body.subcategory = null;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('category', 'name').populate('subcategory', 'name');
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).json({ msg: 'Error updating product', error: error.message });
  }
});

// Delete product
router.delete('/products/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json({ msg: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ msg: 'Error deleting product' });
  }
});

// ===== CATEGORY ROUTES =====

// Get all categories
router.get('/categories', auth, admin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ msg: 'Error fetching categories' });
  }
});

// Add category
router.post('/categories', auth, admin, async (req, res) => {
  try {
    if ('slug' in req.body && (!req.body.slug || req.body.slug === '')) {
      delete req.body.slug;
    }
    // Check for existing category by name or slug
    const existing = await Category.findOne({ $or: [ { name: req.body.name }, { slug: req.body.slug } ] });
    if (existing) {
      return res.status(400).json({ msg: 'Category with this name or slug already exists.' });
    }
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Add category error:', error, req.body);
    if (error.code === 11000) {
      res.status(400).json({ msg: 'Category name or slug must be unique.' });
    } else {
      res.status(500).json({ msg: 'Error adding category', error: error.message });
    }
  }
});

// Edit category
router.put('/categories/:id', auth, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Edit category error:', error);
    if (error.code === 11000) {
      res.status(400).json({ msg: 'Category name already exists' });
    } else {
      res.status(500).json({ msg: 'Error updating category', error: error.message });
    }
  }
});

// Delete category
router.delete('/categories/:id', auth, admin, async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({ 
        msg: `Cannot delete category. It has ${productCount} products assigned to it.` 
      });
    }
    
    // Delete subcategories first
    await Subcategory.deleteMany({ category: req.params.id });
    
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.json({ msg: 'Category and its subcategories deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ msg: 'Error deleting category' });
  }
});

// ===== SUBCATEGORY ROUTES =====

// Get subcategories by category
router.get('/subcategories/:categoryId', auth, admin, async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ 
      category: req.params.categoryId 
    }).sort({ sortOrder: 1, name: 1 });
    
    res.json(subcategories);
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ msg: 'Error fetching subcategories' });
  }
});

// Get all subcategories
router.get('/subcategories', auth, admin, async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate('category', 'name')
      .sort({ 'category.name': 1, sortOrder: 1, name: 1 });
    
    res.json(subcategories);
  } catch (error) {
    console.error('Get all subcategories error:', error);
    res.status(500).json({ msg: 'Error fetching subcategories' });
  }
});

// Add subcategory (prevent duplicates)
router.post('/subcategories', auth, admin, async (req, res) => {
  try {
    // Check for duplicate subcategory name in the same category
    const existing = await Subcategory.findOne({
      name: req.body.name,
      category: req.body.category
    });
    if (existing) {
      return res.status(400).json({ msg: 'Вече има подкатегория с това име в тази категория.' });
    }
    const subcategory = new Subcategory(req.body);
    await subcategory.save();
    await subcategory.populate('category', 'name');
    res.status(201).json(subcategory);
  } catch (error) {
    console.error('Add subcategory error:', error);
    if (error.code === 11000) {
      res.status(400).json({ msg: 'Subcategory name already exists in this category' });
    } else {
      res.status(500).json({ msg: 'Error adding subcategory', error: error.message });
    }
  }
});

// Edit subcategory
router.put('/subcategories/:id', auth, admin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('category', 'name');
    
    if (!subcategory) {
      return res.status(404).json({ msg: 'Subcategory not found' });
    }
    
    res.json(subcategory);
  } catch (error) {
    console.error('Edit subcategory error:', error);
    if (error.code === 11000) {
      res.status(400).json({ msg: 'Subcategory name already exists in this category' });
    } else {
      res.status(500).json({ msg: 'Error updating subcategory', error: error.message });
    }
  }
});

// Delete subcategory
router.delete('/subcategories/:id', auth, admin, async (req, res) => {
  try {
    // Check if subcategory has products
    const productCount = await Product.countDocuments({ subcategory: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({ 
        msg: `Cannot delete subcategory. It has ${productCount} products assigned to it.` 
      });
    }
    
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ msg: 'Subcategory not found' });
    }
    
    res.json({ msg: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({ msg: 'Error deleting subcategory' });
  }
});

// ===== ORDER ROUTES =====

// Get all orders
router.get('/orders', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name price')
      .populate('user', 'email firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ msg: 'Error fetching orders' });
  }
});

// ===== ANALYTICS ROUTES =====

// Get dashboard statistics
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalSubcategories,
      totalUsers,
      totalOrders,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Subcategory.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.find()
        .populate('user', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);
    
    res.json({
      totals: {
        products: totalProducts,
        categories: totalCategories,
        subcategories: totalSubcategories,
        users: totalUsers,
        orders: totalOrders
      },
      recentOrders
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ msg: 'Error fetching statistics' });
  }
});

// ===== EMAIL NOTIFICATION =====

// Email notification (on demand, or after new order)
router.post('/notify', auth, admin, async (req, res) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      return res.status(501).json({ msg: 'Email service not configured' });
    }
    
    let transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ msg: 'Missing required email fields' });
    }
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });
    
    res.json({ msg: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ msg: 'Error sending email' });
  }
});

export default router;
