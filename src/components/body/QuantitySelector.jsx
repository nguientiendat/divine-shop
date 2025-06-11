
const QuantitySelector = ({ price, sale, discount }) => {


  return (
    <div className="d-flex mx-5" style={{ minWidth: "250px" }}>
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
