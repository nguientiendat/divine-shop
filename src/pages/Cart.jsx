import React, { useState, useEffect } from "react";
import QuantitySelector from "../components/body/QuantitySelector";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api/api";
import axios from "axios";

const Cart = () => {
  const [Products, setProducts] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  const user_id = userData.user_id;
  const accessToken = userData.accessToken;
  console.log(accessToken);
  useEffect(() => {
    api
      .get(`/api/cart/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Đã có lỗi: ", err));
  }, []);

  const items = Products?.result.items;
  console.log(items);

  const handlePrice = () => {
    let price = 0;
    for (let i = 0; i < items?.length; i++) {
      price += items[i].product.price;
    }

    return price;
  };
  const totalAmount = handlePrice();

  const handleRemoveCart = async (cartItemId) => {
    try {
      await api.delete(`/api/cart-items/${cartItemId}`, {
        params: { userId: user_id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Xóa sản phẩm thành công");

      // Gọi lại API lấy giỏ hàng mới sau khi xóa
      const res = await api.get(`/api/cart/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducts(res.data); // cập nhật state để UI tự động render lại
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };
  const handleMobileBanking = () => {
    axios
      .post(
        "http://localhost:8080/api/payment/create",
        {
          orderCode: items.id,
          totalAmount: totalAmount,
          description: `Thanh toán đơn hàng ${items.id}`,
          // returnUrl:"http://localhost:3000",
          // cancelUrl:"http://localhost:3000",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken} `,
          },
        }
      )
      .then((res) => {
        const payUrl = res.data.result;
        window.location.href = payUrl;
      })
      .catch((err) => {
        console.error("Lỗi tạo đơn hàng:", err);
      });
  };

  return (
    <div className="my-5">
      <Container>
        <div className="bg-white bg-white p-4 rounded d-flex w-100  ">
          <div style={{ minWidth: "75%" }}>
            <h3 className="f-bold">Giỏ Hàng</h3>
            {items?.map((item) => {
              return (
                <div
                  className="d-flex border p-4 rounded my-3 position-relative"
                  key={item.id}
                  style={{ maxWidth: "1000px" }}
                >
                  <div className="mx-3">
                    <img
                      className="ct-img"
                      src={item.product.avatarUrl}
                      alt=""
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <p className="fw-bold">{item.product.name}</p>
                    <QuantitySelector
                      price={
                        item.product.price ? item.product.price : "loading...."
                      }
                      // sale={item.original_price.toLocaleString('vi-VN')}
                      discount={item.product.discount}
                    />
                  </div>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveCart(item.id)}
                    className="position-absolute"
                    style={{ bottom: "10px", right: "10px" }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="w-100 mx-3 ">
            <p className="m-0 fw-bold mx-5 my-3">Thanh Toán</p>
            <div className="d-flex justify-content-between ">
              <div>Tổng giá</div>
              <div>{totalAmount.toLocaleString("vi-VN")}</div>
            </div>
            <div className="lw my-2 "></div>
            <div className="d-flex justify-content-between ">
              <div>Tổng giá trị phải thanh toán</div>
              <div className="fw-bold">
                {totalAmount.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="d-flex justify-content-between my-2 "></div>
            <div className="d-flex justify-content-between my-2"></div>

            <div className="text-center">Quét mã thanh toán không cần nạp</div>
            <Button
              onClick={() => handleMobileBanking()}
              style={{
                width: "100%",
                marginBottom: "15px",
                backgroundColor: " #005BAA",
              }}
            >
              Mua siêu tốc qua Mobile Banking
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart;
