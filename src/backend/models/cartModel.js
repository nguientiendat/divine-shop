  const mongoose = require('mongoose');

  const cartSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // tên model liên kết
      required: true
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        }
      //   ,
      // //   quantity: {
      // //     type: Number,
      // //     required: true,
      // //     min: 1
      // //   }
      }
    ],
    created_at: {
      type: Date,
      default: Date.now
    },
    update_at: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model('Cart', cartSchema);
