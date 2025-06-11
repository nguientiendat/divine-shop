import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import Items from "./Items";

const ProductGrid = ({ products = [], value, categoryId }) => {
  const productRows = useMemo(() => {
    const filteredProducts = products
      .filter((product) => !product.deleted)
      .filter((product) => !categoryId || product.category?.id === categoryId);

    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 4) {
      rows.push(filteredProducts.slice(i, i + 4));
    }
    return rows;
  }, [products, categoryId]);

  return (
    <div>
      {productRows.map((row, rowIndex) => (
        <Row key={`row-${rowIndex}`} className="my-3">
          {row.map((product) => (
            <Col key={`product-${product.id}`} xs={12} sm={6} md={3}>
              <Items
                id={product.id}
                src={product.avatarUrl}
                name={product.name}
                price={product.price}
                value={value}
                deleted={product.deleted}
                discount={product.discount}
              />
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default ProductGrid;
