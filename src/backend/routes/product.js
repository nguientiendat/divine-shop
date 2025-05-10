// const express = require('express');
// const router = express.Router();
// const Product = require('../models/productsModel');

// // Lấy danh sách tất cả sản phẩm
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Lấy chi tiết sản phẩm theo ID Mongo
// router.get('/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Thêm mới sản phẩm
// router.post('/', async (req, res) => {
//   const product = new Product(req.body);
//   try {
//     const newProduct = await product.save();
//     res.status(201).json(newProduct);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../models/productsModel');

// Lấy danh sách tất cả sản phẩm (có thể lọc theo category_id)
router.get('/', async (req, res) => {
  try {
    // Lấy tham số category_id từ query string nếu có
    const { category_id, price_range } = req.query;
    
    // Tạo đối tượng filter để tìm kiếm
    let filter = {};

    // Nếu có category_id, thêm điều kiện vào filter
    if (category_id) {
      filter.category_id = category_id;
    }

    // Nếu có price_range (ví dụ: "100-500"), thêm điều kiện vào filter
    if (price_range) {
      const [minPrice, maxPrice] = price_range.split('-');
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Tìm sản phẩm theo filter
    const products = await Product.find(filter);
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết sản phẩm theo ID Mongo
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm mới sản phẩm
router.post('/', async (req, res) => {
  const product = new Product({
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    original_price: req.body.original_price,
    discount: req.body.discount,
    status: req.body.status,
    src: req.body.src,
    category_id: req.body.category_id,
    description: req.body.description,
    blocks: req.body.blocks,
    entityMap: req.body.entityMap
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

