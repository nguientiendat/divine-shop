const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: String, // ID dạng text
  src: String,
  category_id:Number
});

module.exports = mongoose.model('Category', categorySchema,'categorys');
