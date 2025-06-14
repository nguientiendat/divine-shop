import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../api/api";
import Items from "../components/body/Items";
const Trending = () => {
  const [products, setProducts] = useState([]);
  const getData = () => {
    api
      .get(`/api/products?page=0&size=100`)
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="my-3">
      <Container>
        <div className="">
          <h4 className="fw-bold">Các sản phẩm trong danh mục</h4>
        </div>
        <div>
          <Row>
            {products.content?.map((product) => {
              return (
                <Col lg="3" className="mb-4">
                  <Items
                    id={product.id}
                    src={product.avatarUrl}
                    name={product.name}
                    price={
                      product.price
                        ? product.price.toLocaleString("vi-VN")
                        : "Loading...!"
                    }
                    original_price={product.original_price}
                    discount={product.discount}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </div>
  );
};
export default Trending;
