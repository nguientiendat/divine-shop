import { Link } from "react-router";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import avatar from "../../assets/images/avatar.jpg";
import Dropdown from "react-bootstrap/Dropdown";
import CartShopping from "./CartShopping";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import api from "../../api/api";
function SHeader() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [products, setProducts] = useState([]);
  const checkAccount = () => {
    let account;
    if (user != null) {
      if (user.admin === true) {
        account = user.admin;
        return account;
      } else {
        account = user.admin;
      }
    } else if (user === null) {
      alert("chua dang nhap");
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/api/products?page=0&size=100`);
        setProducts(response.data.content);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="set-bg-2 ">
      <Container>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="custom-ctn py-1 w-100">
            <div className="fheader d-flex justify-content-between py-1">
              <div className="logo">
                <Link to="" className="tw fs-2 fw-semibold">
                  <img
                    loading="lazy"
                    src="https://cdn.divineshop.vn/static/b1402e84a947ed36cebe9799e47f61c2.svg"
                    className="logo-img"
                    alt="Divine Shop"
                  ></img>
                  DivineShop
                </Link>
              </div>
              <div className="search mx-5">
                <Row>
                  <SearchBar products={products} />
                </Row>
              </div>
              <div className="user w-25 ">
                {user ? (
                  <div>
                    <Dropdown>
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        className="set-bg-2 "
                      >
                        <img
                          src={avatar}
                          className="avatar rounded-circle mx-2"
                          alt="a"
                        />
                        {user.email}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {user.role === "ADMIN" && (
                          <>
                            <Dropdown.Item as={Link} to="/product-manage">
                              Quản lý sản phẩm
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/dashboard">
                              Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/users-manage">
                              Quản lý Users
                            </Dropdown.Item>
                          </>
                        )}
                        {user.role === "USER" && (
                          <Dropdown.Item as={Link} to="/history">
                            Lịch sử mua hàng
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                          }}
                        >
                          Đăng xuất
                        </Dropdown.Item>
                        {checkAccount() ? (
                          <>
                            <Dropdown.Item as={Link} to="/pageadmin">
                              Quản lý
                            </Dropdown.Item>
                          </>
                        ) : (
                          <div></div>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                ) : (
                  <>
                    <Link to="/login">
                      <Button type="submit" className="ctm-btn-2 no-hover">
                        <FontAwesomeIcon icon={faUser} />
                      </Button>
                    </Link>
                    <Link to="/login" className="tw fw-semibold ">
                      Đăng nhập/{" "}
                    </Link>
                    <Link to="/register" className="tw fw-semibold">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
              <div className="">
                <CartShopping />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SHeader;
