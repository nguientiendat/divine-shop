import { Row, Col, Container, Button, Card, Image, Badge, Pagination, Form, InputGroup, Dropdown } from "react-bootstrap";
import api from "../api/api";
import { useEffect, useState } from "react";
import EditProductModal from "../components/EditProductModal";
import AddProductModal from "../components/header/AddProductModal";
import { FaPlus, FaEdit, FaTrashAlt, FaSync, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const ProductManage = () => {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("all");
    const [sortDirection, setSortDirection] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const userData = JSON.parse(localStorage.getItem("user"));
    const accessToken = userData?.result?.accessToken;


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

        api.get(url)
            .then(res => {
                setProducts(res.data.content);
                setPage(res.data.number);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải sản phẩm:", err.message);
                setLoading(false);
            });
    };

    const fetchCategories = () => {
        api.get('/api/categories')
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => {
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

    const handleDeleteProduct = async (product_id,product) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
        if (!confirmed) return;

        try {
            await api.delete(`/api/products/${product_id}`,{
              headers: {"Authorization": `Bearer ${accessToken}`}
            });
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === product_id ? { ...p, deleted: true } : p
                )
            );
            console.log(product)
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
        }
    };

    const handleRestoreProduct = async (product_id, product) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn khôi phục sản phẩm này không?");
        if (!confirmed) return;

        try {
            await api.patch(`/api/products/${product_id}`,null,{
                headers:{ Authorization: `Bearer ${accessToken}`}
            });
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === product_id ? { ...p, deleted: false } : p
                )
            );
            console.log(product)
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
        if (amount === null || amount === undefined) return '0 đ';

        try {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            })
                .format(Number(amount))
                .replace('₫', 'đ');
        } catch (error) {
            console.error("Lỗi khi định dạng tiền tệ:", error);
            return '0 đ';
        }
    };

    const toggleSortDirection = () => {
        if (!sortDirection) {
            setSortDirection('ASC');
        } else if (sortDirection === 'ASC') {
            setSortDirection('DESC');
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

    const filteredProducts = products && Array.isArray(products) ? products.filter(product => {
        if (viewMode === "all") return true;
        if (viewMode === "active") return !product.deleted;
        if (viewMode === "deleted") return product.deleted;
        return true;
    }) : [];

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
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                    <h2 className="fw-bold text-primary mb-3 mb-md-0">
                        Quản lý sản phẩm
                        <Badge bg="info" className="ms-2 fs-6">
                            {products ? products.length : 0} sản phẩm
                        </Badge>
                    </h2>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4 d-flex align-items-center"
                        onClick={() => setShowAdd(true)}
                    >
                        <FaPlus className="me-2" /> Thêm sản phẩm mới
                    </Button>
                </div>

                <Row className="mb-3">
                    <Col md={6} lg={4} className="mb-3 mb-md-0">
                        <Form onSubmit={handleSearch}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline-secondary" type="submit">
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                    <Col md={6} lg={8} className="ms-auto">
                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                            {/* Dropdown danh mục */}
                            <Dropdown className="me-2">
                                <Dropdown.Toggle variant="outline-secondary" id="dropdown-category">
                                    <FaFilter className="me-1" />
                                    {selectedCategory ? `Danh mục: ${selectedCategory.name}` : "Chọn danh mục"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => handleCategoryChange("")}
                                        active={!selectedCategory}
                                    >
                                        Tất cả danh mục
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    {categories.map(category => (
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
                            >
                                {sortDirection === 'asc' ? (
                                    <>
                                        <FaSortAmountUp className="me-1" /> Giá tăng dần
                                    </>
                                ) : sortDirection === 'desc' ? (
                                    <>
                                        <FaSortAmountDown className="me-1" /> Giá giảm dần
                                    </>
                                ) : (
                                    <>
                                        <FaSortAmountDown className="me-1" /> Sắp xếp theo giá
                                    </>
                                )}
                            </Button>

                            {(searchTerm || sortDirection || selectedCategory || viewMode !== "all") && (
                                <Button
                                    variant="outline-danger"
                                    onClick={resetFilters}
                                    className="d-flex align-items-center"
                                >
                                    <FaSync className="me-1" /> Đặt lại bộ lọc
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="btn-group w-100">
                            <Button
                                variant={viewMode === "all" ? "secondary" : "outline-secondary"}
                                onClick={() => setViewMode("all")}
                                className="flex-grow-1"
                            >
                                Tất cả
                            </Button>
                            <Button
                                variant={viewMode === "active" ? "success" : "outline-success"}
                                onClick={() => setViewMode("active")}
                                className="flex-grow-1"
                            >
                                Đang bán
                            </Button>
                            <Button
                                variant={viewMode === "deleted" ? "danger" : "outline-danger"}
                                onClick={() => setViewMode("deleted")}
                                className="flex-grow-1"
                            >
                                Đã ẩn
                            </Button>
                        </div>
                    </Col>
                </Row>

                {(searchTerm || sortDirection || selectedCategory) && (
                    <div className="mt-3 p-2 bg-light rounded">
                        <small className="text-muted">Bộ lọc đang áp dụng:</small>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                            {searchTerm && (
                                <Badge bg="info" className="py-1 px-2">
                                    Tìm kiếm: {searchTerm}
                                    <button
                                        className="btn-close btn-close-white ms-2 p-0"
                                        style={{ fontSize: "0.5rem" }}
                                        onClick={() => {
                                            setSearchTerm("");
                                            fetchProducts(0);
                                        }}
                                    ></button>
                                </Badge>
                            )}
                            {sortDirection && (
                                <Badge bg="info" className="py-1 px-2">
                                    Sắp xếp: Giá {sortDirection === 'asc' ? 'tăng dần' : 'giảm dần'}
                                    <button
                                        className="btn-close btn-close-white ms-2 p-0"
                                        style={{ fontSize: "0.5rem" }}
                                        onClick={() => {
                                            setSortDirection(null);
                                            fetchProducts(0);
                                        }}
                                    ></button>
                                </Badge>
                            )}
                            {selectedCategory && (
                                <Badge bg="info" className="py-1 px-2">
                                    Danh mục: {selectedCategory.name}
                                    <button
                                        className="btn-close btn-close-white ms-2 p-0"
                                        style={{ fontSize: "0.5rem" }}
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

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2 text-muted">Đang tải danh sách sản phẩm...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <Card className="border-0 shadow-sm text-center p-5">
                    <Card.Body>
                        <div className="mb-4">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <h5 className="text-muted">Không tìm thấy sản phẩm nào</h5>
                        <p className="text-secondary">
                            {searchTerm || sortDirection || selectedCategory
                                ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn"
                                : viewMode !== "all"
                                    ? `Không có sản phẩm nào trong mục "${viewMode === "active" ? "Đang bán" : "Đã ẩn"}"`
                                    : "Bạn chưa có sản phẩm nào trong hệ thống."
                            }
                        </p>
                        {(searchTerm || sortDirection || selectedCategory || viewMode !== "all") && (
                            <Button
                                variant="outline-secondary"
                                onClick={resetFilters}
                            >
                                Đặt lại bộ lọc
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                <div className="product-list">
                    <Card className="border-0 shadow-sm mb-3 overflow-hidden">
                        <Card.Header className="bg-white py-3">
                            <Row className="fw-bold text-secondary">
                                <Col md={2} className="d-none d-md-block text-center">Hình ảnh</Col>
                                <Col xs={12} md={4}>Tên sản phẩm</Col>
                                <Col xs={6} md={2} className="text-md-center">Giá bán</Col>
                                <Col xs={6} md={2} className="text-md-center">Tồn kho</Col>
                                <Col md={2} className="text-end">Thao tác</Col>
                            </Row>
                        </Card.Header>
                    </Card>

                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className={`mb-3 border-0 shadow-sm product-card ${product.deleted ? 'bg-light' : ''}`}
                        >
                            <Card.Body className="py-3">
                                <Row className="align-items-center">
                                    <Col md={2} xs={12} className="mb-3 mb-md-0 text-center">
                                        <div className="product-img-container">
                                            <Image
                                                src={product.avatarUrl || "/placeholder-product.png"}
                                                alt={product.name}
                                                fluid
                                                className="product-img"
                                                style={{
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid #eee"
                                                }}
                                                onError={(e) => {
                                                    e.target.src = "/placeholder-product.png";
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col md={4} xs={12} className="mb-2 mb-md-0">
                                        <h5 className="product-name mb-1 text-truncate" title={product.name}>
                                            {product.name || 'Sản phẩm không tên'}
                                        </h5>
                                        <div>
                                            <Badge
                                                bg={product.deleted ? "danger" : "success"}
                                                className="rounded-pill"
                                            >
                                                {product.deleted ? "Đã ẩn" : "Đang bán"}
                                            </Badge>
                                            {product.category && typeof product.category === 'string' ? (
                                                <Badge bg="info" className="ms-2 rounded-pill">
                                                    {product.category}
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </Col>

                                    <Col md={2} xs={6} className="text-md-center">
                                        <p className="mb-0 text-muted small">Giá bán:</p>
                                        <h6 className="fw-bold text-primary">
                                            {formatCurrency(product.price)}
                                        </h6>
                                    </Col>

                                    <Col md={2} xs={6} className="text-md-center">
                                        <p className="mb-0 text-muted small">Tồn kho:</p>
                                        <h6 className={`fw-bold ${product.quantity <= 5 ? 'text-danger' : ''}`}>
                                            {product.quantity}
                                            <span className="ms-1 text-muted small">sản phẩm</span>
                                        </h6>
                                    </Col>

                                    <Col md={2} className="d-flex justify-content-end gap-2 mt-3 mt-md-0">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="rounded-pill px-3"
                                            onClick={() => setEditing(product)}
                                        >
                                            <FaEdit className="me-md-1" />
                                            <span className="d-none d-md-inline">Sửa</span>
                                        </Button>
                                        {product.deleted ? (
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                className="rounded-pill px-3"
                                                onClick={() => handleRestoreProduct(product.id,product)}
                                            >
                                                <FaSync className="me-md-1" />
                                                <span className="d-none d-md-inline">Khôi phục</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="rounded-pill px-3"
                                                onClick={() => handleDeleteProduct(product.id,product)}
                                            >
                                                <FaTrashAlt className="me-md-1" />
                                                <span className="d-none d-md-inline">Xóa</span>
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination className="m-0">
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
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
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

            <div className="mt-4 p-3 bg-white rounded shadow-sm">
                <Row className="text-center">
                    <Col md={4} className="mb-3 mb-md-0">
                        <div className="py-2">
                            <h4 className="mb-0">{products ? products.length : 0}</h4>
                            <p className="text-muted mb-0">Tổng số sản phẩm</p>
                        </div>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <div className="py-2">
                            <h4 className="mb-0 text-success">
                                {products ? products.filter(p => !p.deleted).length : 0}
                            </h4>
                            <p className="text-muted mb-0">Sản phẩm đang bán</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="py-2">
                            <h4 className="mb-0 text-danger">
                                {products ? products.filter(p => p.deleted).length : 0}
                            </h4>
                            <p className="text-muted mb-0">Sản phẩm đã ẩn</p>
                        </div>
                    </Col>
                </Row>
            </div>

            <AddProductModal
                show={showAdd}
                onHide={() => setShowAdd(false)}
                onSave={(newProduct) => {
                    setShowAdd(false);
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
                }
                .product-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.08) !important;
                }
                .product-img {
                    transition: all 0.3s ease;
                }
                .product-img:hover {
                    transform: scale(1.05);
                }
                .pagination .page-link {
                    border-radius: 50%;
                    margin: 0 3px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </Container>
    );
};

export default ProductManage;