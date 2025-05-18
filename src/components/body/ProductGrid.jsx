import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Items from './Items';

const ProductGrid = ({ products = [], value, categoryId }) => {
  // Sử dụng useMemo để tối ưu hiệu suất, chỉ tính toán lại khi products hoặc categoryId thay đổi
  const productRows = useMemo(() => {
    // Lọc products theo categoryId
    const filteredProducts = categoryId 
      ? products.filter(product => product.category?.id === categoryId)
      : products;
    
    // Phân chia thành các hàng, mỗi hàng có tối đa 4 sản phẩm
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 4) {
      rows.push(filteredProducts.slice(i, i + 4));
    }
    return rows;
  }, [products, categoryId]);
  // Nếu không có sản phẩm nào sau khi lọc
  if (productRows.length === 0) {
    return <div className="text-center py-4">Không có sản phẩm nào trong danh mục này</div>;
  }

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
                price={product.price?.toLocaleString('vi-VN') || '0'}
                value={value}
              />
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default ProductGrid;