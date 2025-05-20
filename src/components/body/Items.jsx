import { Link } from "react-router";
function Items({ id, src, name, price, original_price, discount, value }) {

  const textColorClass = value === "z" ? "text-white" : "";

  return (
    <div className="item">
      <div className="a">
        <Link className="link-img" to={`${id}/product-detail`}>
          <img src={src} className="img-fluid rounded ct-img" />
        </Link>
      </div>
      <div className="detail">
        <Link className={`tb tw ct-link line ${textColorClass}`} to={`${id}/product-detail`}>
          {name}
        </Link>
        <div className="d-flex align-items-center">
          <p className={`ct-p fw-bold m-0 ${textColorClass}`}>{price}đ</p>
          <p className={`ct-p fw-bold ct-c m-0 mx-2 ${textColorClass}`}>{original_price}đ</p>
          <span className="sale rounded fw-bold px-1">-{discount}%</span>
        </div>
      </div>
    </div>
  );
}
export default Items