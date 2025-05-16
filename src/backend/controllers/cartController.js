const Cart = require('../models/cartModel');
console.log('Cart model:', Cart);  // kiểm tra xem nó là object có method hay undefined

exports.addItem = async (req, res) => {
    const { userId } = req.params;
    console.log('Request body:', req.body); // Log toàn bộ request body
    const { product_id } = req.body; // Lấy product_id từ request body
    
    // Kiểm tra nếu product_id không tồn tại hoặc không hợp lệ
    if (!product_id) {
        return res.status(400).json({ 
            error: "Thiếu thông tin product_id",
            receivedBody: req.body // Log để debug
        });
    }
    
    // Kiểm tra xem product_id có phải là ObjectId hợp lệ không
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
        return res.status(400).json({
            error: "product_id không hợp lệ, phải là ObjectId",
            product_id: product_id
        });
    }

    try {
        let cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            // Tạo giỏ hàng mới với mảng items
            console.log('Tạo giỏ hàng mới với product_id:', product_id);
            cart = new Cart({
                user_id: userId,
                items: [{ product_id: product_id }] // Đảm bảo truyền product_id đúng cách
            });
        } else {
            // Kiểm tra sản phẩm đã có trong giỏ chưa
            const itemIndex = cart.items.findIndex(item =>
                item.product_id && item.product_id.toString() === product_id.toString()
            );
            
            if (itemIndex >= 0) {
                // Nếu có rồi thì tạm thời không làm gì (sau này có thể thêm quantity)
                // cart.items[itemIndex].quantity += quantity;
            } else {
                // Nếu chưa có thì thêm mới
                console.log('Thêm sản phẩm mới vào giỏ hàng:', product_id);
                const newItem = { product_id: product_id }; // Tạo object item mới
                cart.items.push(newItem);
                console.log('Mảng items sau khi thêm:', cart.items);
            }
        }
        
        // Cập nhật thời gian update
        cart.update_at = Date.now();
        
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
        res.status(500).json({ err: err.message });
    }
}
exports.getItem = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');

        if (!cart) {
            return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.removeItem = async (req, res) => {
    const { userId, productId: product_id } = req.params;
    // const {  } = req.params;

    console.log("➡️ Params:", req.params);
    console.log(product_id)
    console.log(userId)
    try {
        const cart = await Cart.findOne({ user_id: userId });
        
        if (!cart) {
            console.log("❌ Không tìm thấy giỏ hàng!");
            return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });
        }
        // In ra trước khi lọc
        console.log("🛒 Trước khi xóa:", cart.items);

        const initialLength = cart.items.length;
        console.log("Tong so san pham trong gio hang: ",initialLength)
        // Xoá item có product_id
        cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);

        // Kiểm tra có thực sự xóa gì không
        if (cart.items.length === initialLength) {
            console.log("⚠️ Không có sản phẩm nào bị xóa (không tìm thấy product_id phù hợp)");
            return res.status(400).json({ error: "Không tìm thấy sản phẩm trong giỏ hàng để xóa" });
        }

        await cart.save();

        console.log("✅ Đã xóa xong. Sau khi xóa:", cart.items);
        return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart });

    } catch (err) {
        console.error("💥 Lỗi khi xóa sản phẩm:", err);
        return res.status(500).json({ error: "Đã có lỗi xảy ra trên server" });
    }
};