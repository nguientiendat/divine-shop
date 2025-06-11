import { Button, InputGroup, FormControl } from "react-bootstrap";
import React, { useState } from "react";

const QuantitySelector = ({ price, sale, discount }) => {
  const [quantity, setQuantity] = useState(1);
  const handlePrev = () => {
    setQuantity((prev) => {
      return prev + 1;
    });
  };
  const handleNext = () => {
    setQuantity((next) => {
      if (quantity < 2) {
        alert("So luong toi thieu can mua la 1");
        setQuantity(1);
      }
      return next - 1;
    });
  };
  const handleValue = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div className="d-flex mx-5" style={{ minWidth: "250px" }}>
      <InputGroup
        style={{ maxWidth: "115px", maxHeight: "1vh", marginRight: "20px" }}
      >
        <Button variant="light" onClick={handleNext}>
          -
        </Button>
        <FormControl
          type="number"
          style={{ textAlign: "center" }}
          value={quantity}
          onChange={handleValue}
        />
        <Button variant="light" onClick={handlePrev}>
          +
        </Button>
      </InputGroup>
      <div>
        <div>
          <p className="m-0 fw-bold">
            {(price - (price * discount) / 100).toLocaleString("vi-VN")}đ
          </p>
        </div>
        <div className="d-flex">
          {discount != null && discount !== 0 && (
            <p className="m-0 fw-bold ct-c mx-1">
              {price.toLocaleString("vi-VN")}đ
            </p>
          )}
          {discount != null && discount !== 0 && (
            <span className="sale rounded fw-bold m-0 p-1">-{discount}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
