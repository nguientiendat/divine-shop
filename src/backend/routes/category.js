const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new category
router.post('/', async (req, res) => {
  const category = new Category({
    id: req.body.id,
    src: req.body.src,
    category_id: req.body.category_id
  });

  try {
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
