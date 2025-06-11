import { Container } from "react-bootstrap";
import { Link } from "react-router";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <div className="bgr-row1 py-2">
        <Container>
          <Row>
            <Col xs={1} className="brand">
              {" "}
              <Link>
                <img
                  alt="img"
                  className="brand-logo"
                  src="https://cdn.divineshop.vn/static/b77a2122717d76696bd2b87d7125fd47.svg"
                ></img>{" "}
              </Link>
            </Col>
            <Col xs={1} className="brand">
              {" "}
              <Link>
                <img
                  alt="img"
                  className="brand-logo"
                  src="https://cdn.divineshop.vn/static/72a3a36fc7c66085b3f442940ba45fde.svg"
                ></img>{" "}
              </Link>
            </Col>
            <Col xs={1} className="brand">
              <Link>
                <img
                  alt="img"
                  className="brand-logo"
                  src="https://cdn.divineshop.vn/static/464c7c79044dea88e86adf0e1b9c064c.svg"
                ></img>{" "}
              </Link>
            </Col>
            <Col xs={1} className="brand">
              {" "}
              <Link>
                <img
                  alt="img"
                  className="brand-logo"
                  src="https://cdn.divineshop.vn/static/ddb866eb1214c914ea62417879046b99.svg"
                ></img>{" "}
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="my-2 pb-3">
          <Col xs={1} className="brand">
            <img
              alt="img"
              className="brand-logo"
              src="https://cdn.divineshop.vn/static/4ba68c7a47305b454732e1a9e9beb8a1.svg"
            />
          </Col>
          <Col xs={1} className="brand">
            <img
              alt="img"
              className="brand-logo"
              src="https://cdn.divineshop.vn/static/20334129395885adefc2e5217043f670.svg"
            />
          </Col>
          <Col xs={1} className="brand">
            <img
              alt="img"
              className="brand-logo"
              src="https://cdn.divineshop.vn/static/4ae438165f9d5ea0fc6ff3da6051f938.svg"
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <div className="border"></div>
        <Row>
          <Col xs={4} className="mt-3">
            <Row>
              <h5>Giới thiệu</h5>
            </Row>
            <Row>
              <Link className="linkfooter">Game bản quyền là gì?</Link>
            </Row>
            <Row>
              <Link className="linkfooter">Giới thiệu Devine Shop</Link>
            </Row>
            <Row>
              <Link className="linkfooter">Điều khoản dịch vụ</Link>
            </Row>
            <Row>
              <Link className="linkfooter">Chính sách bảo mật</Link>
            </Row>
          </Col>
          <Col xs={4} className="mt-3">
            <Row>
              <h5>Tài khoản</h5>
            </Row>
            <Row>
              <Link className="linkfooter" to="/login">
                Đăng nhập
              </Link>
            </Row>
            <Row>
              <Link className="linkfooter" to="/register">
                Đăng ký
              </Link>
            </Row>
          </Col>
          <Col xs={4} className="mt-3">
            <Row>
              <h5>Liên hệ</h5>
            </Row>
            <Row>
              <p className="m-0 ">
                Hotline tự động{" "}
                <span style={{ color: "red" }}>1900 633 305</span>
              </p>
            </Row>
            <Row>
              <Link className="linkfooter">Liên hệ hỗ trợ</Link>
            </Row>
            <Row>
              <Link className="linkfooter">Chat với CSKH</Link>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="mb-5"></div>
    </>
  );
};
export default Footer;
