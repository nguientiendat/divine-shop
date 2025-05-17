import { useState, useEffect } from "react";
import { Modal, Form, FloatingLabel, Button, Image } from "react-bootstrap";

function EditProductModal({ show, onHide, product, onSave }) {
  const [form, setForm]   = useState({ name: "", price: 0 });
  const [file, setFile]   = useState(null);          // file ảnh mới
  const [preview, setPreview] = useState(null);      // URL xem trước

  /* --- nạp dữ liệu khi mở modal --- */
  useEffect(() => {
    if (product) {
      setForm({ name: product.name || "", price: product.price || 0 });
      setPreview(product.src || null);   // ảnh cũ (nếu có)
      setFile(null);                     // reset file
    }
  }, [product]);

  /* --- khi user chọn file ảnh --- */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));   // xem trước
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!product) return;

    /* Nếu cần upload lên server trước, làm dưới đây */
    let imageUrl = product.src;   // giữ nguyên ảnh cũ nếu không đổi

    if (file) {
      // 1) Tạo FormData
      const formData = new FormData();
      formData.append("image", file);

      // 2) Gửi lên server – ví dụ api.patch(`/v1/upload`, formData)
      //    Ở đây minh hoạ bằng fetch, bạn thay bằng axios hay api riêng:
      try {
        const res = await fetch("/v1/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.url; // server trả về url ảnh mới
      } catch (err) {
        console.error("Upload error", err);
        return;
      }
    }

    const updated = { ...product, ...form, src: imageUrl };
    onSave(updated);     // trả về cha
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa sản phẩm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <FloatingLabel label="Tên sản phẩm" className="mb-3">
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel label="Giá (đ)" className="mb-3">
            <Form.Control
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
            />
          </FloatingLabel>

          {/* ---- Input file ảnh ---- */}
          <Form.Group controlId="imageUpload" className="mb-3">
            <Form.Label>Ảnh sản phẩm</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          {/* ---- Xem trước ảnh ---- */}
          {preview && (
            <div className="text-center">
              <Image src={preview} thumbnail style={{ maxHeight: 150 }} />
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProductModal;
