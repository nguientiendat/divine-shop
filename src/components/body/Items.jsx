import { Link } from "react-router";

function Items({ id, src, name, price, original_price, discount, value }) {
  const textColorClass = value === "z" ? "text-white" : "";

  // Tính giá sau giảm nếu có discount
  const hasDiscount = discount !== null && discount !== undefined;
  const discountedPrice = hasDiscount
    ? Math.round(price * (1 - discount / 100))
    : null;

  return (
    <div className="item">
      <div className="a">
        <Link
          className="link-img"
          to={`http://localhost:3000/${id}/product-detail`}
        >
          <img src={src} className="img-fluid rounded ct-img" />
        </Link>
      </div>
      <div className="detail">
        <Link
          className={`tb tw ct-link line ${textColorClass}`}
          to={`${id}/product-detail`}
        >
          {name}
        </Link>
        <div className="d-flex align-items-center">
          {hasDiscount && (
            <p className={`ct-p fw-bold m-0 ${textColorClass}`}>
              {discountedPrice.toLocaleString("en-US")}đ
            </p>
          )}
          <p
            className={`ct-p fw-bold ${
              hasDiscount ? "ct-c" : ""
            } m-0 mx-2 ${textColorClass}`}
          >
            {price.toLocaleString("en-US")}đ
          </p>
          {hasDiscount && (
            <span className="sale rounded fw-bold px-1">-{discount}%</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;
