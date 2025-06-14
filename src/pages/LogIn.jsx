import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { loginUser } from "../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const user = {
      email: username,
      password: password,
    };

    try {
      await loginUser(user, dispatch, navigate);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Đăng nhập thất bại");
      } else {
        setErrorMessage("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="my-5">
      <Container>
        <div className="mx-5 ct-w p-4 rounded ct">
          <h2 className="fw-bold my-4">Đăng Nhập</h2>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                className="ct"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                className="ct"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự
                đặc biệt.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Đăng nhập
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default LogIn;
