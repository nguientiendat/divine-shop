import { useState, useEffect } from "react";
import { Modal, Form, FloatingLabel, Button, Image } from "react-bootstrap";
import api from "../api/api";

function EditProductModal({ show, onHide, onSave, product }) {

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    daysValid: "",
    receivingProcess: "",
    warrantyPolicy: "",
    frequentlyAskedQuestions: "",
    discount: "",
    category_id: "",
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (show) {
      api.get("/api/categories")
        .then(res => setCategories(res.data))
        .catch(err => console.error("Lỗi load categories:", err.message));

      if (product) {
        setForm({
          name: product.name || "",
          price: product.price || "",
          quantity: product.quantity || "",
          description: product.description || "",
          daysValid: product.daysValid || "",
          receivingProcess: product.receivingProcess || "",
          warrantyPolicy: product.warrantyPolicy || "",
          frequentlyAskedQuestions: product.frequentlyAskedQuestions || "",
          discount: product.discount || "",
          category_id: product.category?.id || "",
        });
        setPreview(product.avatarUrl || null);
      }
      setFile(null);
      setErrors({});
    } else {
      setForm({
        name: "",
        price: "",
        quantity: "",
        description: "",
        daysValid: "",
        receivingProcess: "",
        warrantyPolicy: "",
        frequentlyAskedQuestions: "",
        discount: "",
        category_id: "",
      });
      setFile(null);
      setPreview(null);
      setErrors({});
    }
  }, [show, product]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setErrors(prev => ({ ...prev, avatarUrl: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    } else if (form.name.length > 255) {
      newErrors.name = "Tên sản phẩm tối đa 255 ký tự";
    }

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }

    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (form.discount !== "") {
      const discountValue = Number(form.discount);
      if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
        newErrors.discount = "Giảm giá phải từ 0 đến 100";
      }
    }

    if (!form.daysValid || (isNaN(form.daysValid) || Number(form.daysValid) < 0)) {
      newErrors.daysValid = "Số ngày hiệu lực phải lớn hơn 0";
    }

    if (!form.category_id) {
      newErrors.category_id = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();

    if (file) {
      formData.append("avatarUrl", file);
    }

    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await api.put(`/api/products/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSave(res.data.result);
      onHide();
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật sản phẩm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate>
          <FloatingLabel label="Tên sản phẩm" className="mb-3">
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Giá (VNĐ)" className="mb-3">
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              isInvalid={!!errors.price}
            />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Số lượng" className="mb-3">
            <Form.Control
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              isInvalid={!!errors.quantity}
            />
            <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Mô tả" className="mb-3">
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              style={{ height: "100px" }}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel label="Thời hạn (ngày)" className="mb-3">
            <Form.Control
              type="number"
              name="daysValid"
              value={form.daysValid}
              onChange={handleChange}
              isInvalid={!!errors.daysValid}
            />
            <Form.Control.Feedback type="invalid">{errors.daysValid}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Quy trình nhận hàng" className="mb-3">
            <Form.Control
              as="textarea"
              name="receivingProcess"
              value={form.receivingProcess}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel label="Chính sách bảo hành" className="mb-3">
            <Form.Control
              as="textarea"
              name="warrantyPolicy"
              value={form.warrantyPolicy}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel label="Câu hỏi thường gặp" className="mb-3">
            <Form.Control
              as="textarea"
              name="frequentlyAskedQuestions"
              value={form.frequentlyAskedQuestions}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel label="Giảm giá (%)" className="mb-3">
            <Form.Control
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              isInvalid={!!errors.discount}
            />
            <Form.Control.Feedback type="invalid">{errors.discount}</Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Danh mục sản phẩm" className="mb-3">
            <Form.Select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              isInvalid={!!errors.category_id}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
          </FloatingLabel>

          <Form.Group controlId="imageUpload" className="mb-3">
            <Form.Label>Ảnh sản phẩm</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              isInvalid={!!errors.avatarUrl}
            />
            <Form.Control.Feedback type="invalid">{errors.avatarUrl}</Form.Control.Feedback>
          </Form.Group>

          {preview && (
            <div className="text-center mb-3">
              <Image src={preview} thumbnail style={{ maxHeight: 150 }} />
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="primary" onClick={handleSubmit}>Cập nhật</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProductModal;
