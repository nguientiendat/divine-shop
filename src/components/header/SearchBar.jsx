import { useState } from "react";
import { Form, InputGroup, ListGroup, Image } from "react-bootstrap";
import { useNavigate } from "react-router";
const SearchProduct = ({ products }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered =
    search.trim() === ""
      ? []
      : products.filter((p) =>
          p.name?.toLowerCase().includes(search.trim().toLowerCase())
        );

  const handleClickProduct = (id) => {
    navigate(`/${id}/product-detail`);
    setSearch(""); // reset input sau khi click
  };
  return (
    <div className="search-product-wrapper position-relative">
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {search && (
        <ListGroup className="search-dropdown position-absolute w-100 z-3 shadow">
          {filtered.length === 0 ? (
            <ListGroup.Item>Không tìm thấy sản phẩm nào.</ListGroup.Item>
          ) : (
            filtered.map((product) => (
              <ListGroup.Item
                key={product.id}
                action
                className="d-flex align-items-center"
                onClick={() => handleClickProduct(product.id)}
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={product.avatarUrl || "/placeholder-product.png"}
                  alt={product.name}
                  width={40}
                  height={40}
                  rounded
                  className="me-2"
                  style={{ objectFit: "cover" }}
                />
                <span>{product.name}</span>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchProduct;
