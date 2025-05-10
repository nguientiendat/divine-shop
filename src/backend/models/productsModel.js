const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String, // ID dạng text
  name: String,
  price: Number,
  original_price: Number,
  discount: Number,
  status: String,
  src: String, // hình ảnh
  category_id: Number,
  description: {
    blocks: Array,    // nếu dùng kiểu Draft.js hoặc rich-text
    entityMap: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
