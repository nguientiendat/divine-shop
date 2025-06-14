import {
  Row,
  Col,
  Container,
  Button,
  Card,
  Image,
  Badge,
  Pagination,
  Form,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import api from "../api/api";
import { useEffect, useState } from "react";
import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/header/AddProductModal";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaSync,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTags,
  FaBox,
} from "react-icons/fa";
import AddCategoryModal from "../components/header/AddCategoryModal";

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [sortDirection, setSortDirection] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProducts = (pageNumber = 0) => {
    setLoading(true);

    let url = `/api/products?page=${pageNumber}&size=5`;

    if (searchTerm) {
      url += `&name=${searchTerm}`;
    }

    if (selectedCategory) {
      url += `&categoryId=${selectedCategory.id}`;
    }

    if (sortDirection) {
      url += `&sort=price,${sortDirection}`;
    }

    api
      .get(url)
      .then((res) => {
        setProducts(res.data.content);
        setPage(res.data.number);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm:", err.message);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    api
      .get("/api/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh mục:", err.message);
      });
  };

  useEffect(() => {
    fetchProducts(page);
    fetchCategories();
  }, [page]);

  useEffect(() => {
    if (page === 0) {
      fetchProducts(0);
    } else {
      setPage(0);
    }
  }, [sortDirection, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(0);
  };

  const handleDeleteProduct = async (product_id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/products/${product_id}`);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product_id ? { ...p, deleted: true } : p
        )
      );
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    }
  };

  const handleRestoreProduct = async (product_id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn khôi phục sản phẩm này không?"
    );
    if (!confirmed) return;

    try {
      await api.patch(`/api/products/${product_id}`);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product_id ? { ...p, deleted: false } : p
        )
      );
    } catch (error) {
      console.error("Lỗi khôi phục sản phẩm:", error);
    }
  };

  const handleSaveProduct = (updated) => {
    if (updated && updated.result) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.result.id ? updated.result : p))
      );
    } else if (updated && updated.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    }
    setEditing(null);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 đ";

    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      })
        .format(Number(amount))
        .replace("₫", "đ");
    } catch (error) {
      console.error("Lỗi khi định dạng tiền tệ:", error);
      return "0 đ";
    }
  };

  const toggleSortDirection = () => {
    if (!sortDirection) {
      setSortDirection("ASC");
    } else if (sortDirection === "ASC") {
      setSortDirection("DESC");
    } else {
      setSortDirection(null);
    }
  };

  const getSortButtonVariant = () => {
    if (!sortDirection) return "outline-secondary";
    return "secondary";
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const renderPaginationItems = () => {
    let items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      items.push(
        <Pagination.Item key="first" onClick={() => setPage(0)}>
          1
        </Pagination.Item>
      );
      if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => setPage(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item key="last" onClick={() => setPage(totalPages - 1)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  const filteredProducts =
    products && Array.isArray(products)
      ? products.filter((product) => {
          if (viewMode === "all") return true;
          if (viewMode === "active") return !product.deleted;
          if (viewMode === "deleted") return product.deleted;
          return true;
        })
      : [];

  const resetFilters = () => {
    setSearchTerm("");
    setSortDirection(null);
    setSelectedCategory("");
    setViewMode("all");
    fetchProducts(0);
  };

  return (
    <Container fluid className="py-4 px-md-4 bg-light min-vh-100">
      <div className="bg-white rounded shadow-sm p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4">
          <div className="mb-3 mb-lg-0">
            <h2 className="fw-bold text-primary mb-2">
              <FaBox className="me-2" />
              Quản lý sản phẩm
            </h2>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="info" className="fs-6 px-3 py-2">
                <strong>{products ? products.length : 0}</strong> sản phẩm
              </Badge>
              <Badge bg="success" className="fs-6 px-3 py-2">
                <strong>
                  {products ? products.filter((p) => !p.deleted).length : 0}
                </strong>{" "}
                đang bán
              </Badge>
              <Badge bg="danger" className="fs-6 px-3 py-2">
                <strong>
                  {products ? products.filter((p) => p.deleted).length : 0}
                </strong>{" "}
                đã ẩn
              </Badge>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2">
            <Button
              variant="outline-primary"
              className="rounded-pill px-4 d-flex align-items-center justify-content-center"
              onClick={() => setShowAddCategory(true)}
            >
              <FaTags className="me-2" />
              <span>Thêm danh mục</span>
            </Button>
            <Button
              variant="primary"
              className="rounded-pill px-4 d-flex align-items-center justify-content-center"
              onClick={() => setShowAddProduct(true)}
            >
              <FaPlus className="me-2" />
              <span>Thêm sản phẩm</span>
            </Button>
          </div>
        </div>

        <Row className="mb-4">
          <Col lg={5} className="mb-3 mb-lg-0">
            <Form onSubmit={handleSearch}>
              <InputGroup size="lg">
                <Form.Control
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-end-0"
                />
                <Button
                  variant="outline-secondary"
                  type="submit"
                  className="border-start-0"
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </Col>

          <Col lg={7}>
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-category"
                  className="d-flex align-items-center"
                  size="lg"
                >
                  <FaFilter className="me-2" />
                  {selectedCategory ? `${selectedCategory.name}` : "Danh mục"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleCategoryChange("")}
                    active={!selectedCategory}
                  >
                    <FaTags className="me-2" />
                    Tất cả danh mục
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {categories.map((category) => (
                    <Dropdown.Item
                      key={category.id || category.name}
                      onClick={() => handleCategoryChange(category)}
                      active={selectedCategory.id === category.id}
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Button
                variant={getSortButtonVariant()}
                onClick={toggleSortDirection}
                className="d-flex align-items-center"
                size="lg"
              >
                {sortDirection === "ASC" ? (
                  <>
                    <FaSortAmountUp className="me-2" /> Giá tăng
                  </>
                ) : sortDirection === "DESC" ? (
                  <>
                    <FaSortAmountDown className="me-2" /> Giá giảm
                  </>
                ) : (
                  <>
                    <FaSortAmountDown className="me-2" /> Sắp xếp
                  </>
                )}
              </Button>

              {(searchTerm ||
                sortDirection ||
                selectedCategory ||
                viewMode !== "all") && (
                <Button
                  variant="outline-danger"
                  onClick={resetFilters}
                  className="d-flex align-items-center"
                  size="lg"
                >
                  <FaSync className="me-2" /> Đặt lại
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* View mode buttons được cải thiện */}
        <Row className="mb-3">
          <Col>
            <div className="btn-group w-100" role="group">
              <Button
                variant={viewMode === "all" ? "primary" : "outline-primary"}
                onClick={() => setViewMode("all")}
                className="flex-grow-1 py-2"
              >
                <FaBox className="me-2 d-none d-sm-inline" />
                Tất cả ({products ? products.length : 0})
              </Button>
              <Button
                variant={viewMode === "active" ? "success" : "outline-success"}
                onClick={() => setViewMode("active")}
                className="flex-grow-1 py-2"
              >
                <FaSync className="me-2 d-none d-sm-inline" />
                Đang bán (
                {products ? products.filter((p) => !p.deleted).length : 0})
              </Button>
              <Button
                variant={viewMode === "deleted" ? "danger" : "outline-danger"}
                onClick={() => setViewMode("deleted")}
                className="flex-grow-1 py-2"
              >
                <FaTrashAlt className="me-2 d-none d-sm-inline" />
                Đã ẩn ({products ? products.filter((p) => p.deleted).length : 0}
                )
              </Button>
            </div>
          </Col>
        </Row>

        {/* Active filters display được cải thiện */}
        {(searchTerm || sortDirection || selectedCategory) && (
          <div className="mt-3 p-3 bg-light rounded border">
            <div className="d-flex align-items-center mb-2">
              <FaFilter className="me-2 text-muted" />
              <small className="text-muted fw-bold">Bộ lọc đang áp dụng:</small>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  bg="info"
                  className="py-2 px-3 d-flex align-items-center"
                >
                  <FaSearch className="me-1" style={{ fontSize: "0.8rem" }} />
                  Tìm kiếm: "{searchTerm}"
                  <button
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => {
                      setSearchTerm("");
                      fetchProducts(0);
                    }}
                  ></button>
                </Badge>
              )}
              {sortDirection && (
                <Badge
                  bg="secondary"
                  className="py-2 px-3 d-flex align-items-center"
                >
                  {sortDirection === "ASC" ? (
                    <FaSortAmountUp
                      className="me-1"
                      style={{ fontSize: "0.8rem" }}
                    />
                  ) : (
                    <FaSortAmountDown
                      className="me-1"
                      style={{ fontSize: "0.8rem" }}
                    />
                  )}
                  Giá {sortDirection === "ASC" ? "tăng dần" : "giảm dần"}
                  <button
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => {
                      setSortDirection(null);
                      fetchProducts(0);
                    }}
                  ></button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge
                  bg="primary"
                  className="py-2 px-3 d-flex align-items-center"
                >
                  <FaTags className="me-1" style={{ fontSize: "0.8rem" }} />
                  {selectedCategory.name}
                  <button
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: "0.6rem" }}
                    onClick={() => {
                      setSelectedCategory("");
                      fetchProducts(0);
                    }}
                  ></button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product list section */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <h5 className="text-muted">Đang tải danh sách sản phẩm...</h5>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5">
          <Card.Body>
            <div className="mb-4">
              <FaBox size={80} className="text-muted" />
            </div>
            <h4 className="text-muted mb-3">Không tìm thấy sản phẩm nào</h4>
            <p className="text-secondary mb-4">
              {searchTerm || sortDirection || selectedCategory
                ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn"
                : viewMode !== "all"
                ? `Không có sản phẩm nào trong mục "${
                    viewMode === "active" ? "Đang bán" : "Đã ẩn"
                  }"`
                : "Bạn chưa có sản phẩm nào trong hệ thống."}
            </p>
            {(searchTerm ||
              sortDirection ||
              selectedCategory ||
              viewMode !== "all") && (
              <Button
                variant="outline-primary"
                onClick={resetFilters}
                size="lg"
              >
                <FaSync className="me-2" />
                Đặt lại bộ lọc
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="product-list">
          <Card className="border-0 shadow-sm mb-3 overflow-hidden">
            <Card.Header className="bg-primary text-white py-3">
              <Row className="fw-bold">
                <Col md={2} className="d-none d-md-block text-center">
                  Hình ảnh
                </Col>
                <Col xs={12} md={4}>
                  Thông tin sản phẩm
                </Col>
                <Col xs={6} md={2} className="text-md-center">
                  Giá bán
                </Col>
                <Col xs={6} md={2} className="text-md-center">
                  Tồn kho
                </Col>
                <Col md={2} className="text-end">
                  Thao tác
                </Col>
              </Row>
            </Card.Header>
          </Card>

          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`mb-3 border-0 shadow-sm product-card ${
                product.deleted ? "opacity-75" : ""
              }`}
            >
              <Card.Body className="py-4">
                <Row className="align-items-center">
                  <Col md={2} xs={12} className="mb-3 mb-md-0 text-center">
                    <div className="product-img-container">
                      <Image
                        src={product.avatarUrl || "/placeholder-product.png"}
                        alt={product.name}
                        fluid
                        className="product-img shadow-sm w-auto"
                        style={{
                          height: "90px",
                          width: "90px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border: "2px solid #f8f9fa",
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.png";
                        }}
                      />
                    </div>
                  </Col>

                  <Col md={4} xs={12} className="mb-3 mb-md-0">
                    <h5
                      className="product-name mb-2 text-truncate fw-bold"
                      title={product.name}
                    >
                      {product.name || "Sản phẩm không tên"}
                    </h5>
                    <div className="d-flex flex-wrap gap-2">
                      <Badge
                        bg={product.deleted ? "danger" : "success"}
                        className="rounded-pill px-3 py-2"
                      >
                        {product.deleted ? "Đã ẩn" : "Đang bán"}
                      </Badge>
                      {product.category &&
                      typeof product.category === "string" ? (
                        <Badge bg="info" className="rounded-pill px-3 py-2">
                          <FaTags
                            className="me-1"
                            style={{ fontSize: "0.8rem" }}
                          />
                          {product.category}
                        </Badge>
                      ) : null}
                    </div>
                  </Col>

                  <Col md={2} xs={6} className="text-md-center mb-3 mb-md-0">
                    <p className="mb-1 text-muted small fw-bold">Giá bán</p>
                    <h5 className="fw-bold text-primary mb-0">
                      {formatCurrency(product.price)}
                    </h5>
                  </Col>

                  <Col md={2} xs={6} className="text-md-center mb-3 mb-md-0">
                    <p className="mb-1 text-muted small fw-bold">Tồn kho</p>
                    <h5
                      className={`fw-bold mb-0 ${
                        product.quantity <= 5 ? "text-danger" : "text-success"
                      }`}
                    >
                      {product.quantity}
                      <small className="ms-1 text-muted fw-normal">sp</small>
                    </h5>
                  </Col>

                  <Col md={2} className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-3 py-2"
                      onClick={() => setEditing(product)}
                    >
                      <FaEdit className="me-1" />
                      <span className="d-none d-lg-inline">Sửa</span>
                    </Button>
                    {product.deleted ? (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="rounded-pill px-3 py-2"
                        onClick={() => handleRestoreProduct(product.id)}
                      >
                        <FaSync className="me-1" />
                        <span className="d-none d-lg-inline">Khôi phục</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-3 py-2"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <FaTrashAlt className="me-1" />
                        <span className="d-none d-lg-inline">Xóa</span>
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination size="lg" className="shadow-sm">
                <Pagination.First
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                />
                <Pagination.Prev
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, totalPages - 1))
                  }
                  disabled={page === totalPages - 1}
                />
                <Pagination.Last
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page === totalPages - 1}
                />
              </Pagination>
            </div>
          )}
        </div>
      )}

      <AddProductModal
        show={showAddProduct}
        onHide={() => setShowAddProduct(false)}
        onSave={(newProduct) => {
          setShowAddProduct(false);
          fetchProducts(0);
          fetchCategories();
        }}
      />

      <AddCategoryModal
        show={showAddCategory}
        onHide={() => setShowAddCategory(false)}
        onSave={() => {
          setShowAddCategory(false);
          fetchCategories();
          fetchProducts(0);
        }}
      />

      <EditProductModal
        show={!!editing}
        product={editing}
        onHide={() => setEditing(null)}
        onSave={handleSaveProduct}
      />

      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
          border-left: 4px solid transparent;
        }
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.1) !important;
          border-left-color: #0d6efd;
        }
        .product-img {
          transition: all 0.3s ease;
        }
        .product-img:hover {
          transform: scale(1.1);
        }
        .pagination .page-link {
          border-radius: 12px;
          margin: 0 4px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .pagination .page-link:hover {
          transform: translateY(-2px);
        }
        .btn-group .btn {
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .badge {
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      `}</style>
    </Container>
  );
};

export default ProductManage;
