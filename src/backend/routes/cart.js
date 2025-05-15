const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// router.get('/:userId', cartController.getCart);
router.post('/:userId', cartController.addItem);
// router.put('/:userId', cartController.updateItem);
// router.delete('/:userId', cartController.removeItem);

module.exports = router;
