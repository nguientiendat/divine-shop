const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getItem);
router.post('/:userId', cartController.addItem);
router.delete('/:userId', cartController.removeItem);

module.exports = router;
