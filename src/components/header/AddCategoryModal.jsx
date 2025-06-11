import { useState, useEffect } from "react";
import { Modal, Form, FloatingLabel, Button } from "react-bootstrap";
import api from "../../api/api";

function AddCategoryModal({ show, onHide, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const userData = JSON.parse(localStorage.getItem("user"));
  const accessToken = userData?.result?.accessToken;

  useEffect(() => {
    if (!show) {
      setForm({
        name: "",
        description: "",
      });
      setErrors({});
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    } else if (form.name.length > 255) {
      newErrors.name = "Tên danh mục tối đa 255 ký tự";
    }

    if (form.description.length > 1000) {
      newErrors.description = "Mô tả tối đa 1000 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await api.post("/api/categories", form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onSave(res.data.result);
      onHide();
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm danh mục</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate>
          <FloatingLabel label="Tên danh mục" className="mb-3">
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel label="Mô tả" className="mb-3">
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{ height: "100px" }}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Thêm mới
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCategoryModal;
