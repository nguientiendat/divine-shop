import { Row, Col, Container, Button } from "react-bootstrap"
import api from "../api/api"
import { useEffect, useState } from "react"
import { deleteProduct } from "../redux/apiRequest"
import { useDispatch } from "react-redux"
import EditProductModal from "../components/EditProductModal"

const ProductManage = () => {
    const [products, setProducts] = useState([])
    const [editing, setEditing] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        api.get('/api/products')
            .then((res) => {
                console.log(res.data)
                setProducts(res.data)
            })
            .catch(err => console.error("Lỗi khi load sản phẩm:", err.message))
    }, [])

    const items = products?.content || []

    const handleDeleteProduct = (product_id) => {
        const data = { product_id }
        deleteProduct(data, dispatch)
            .then(() => {
                setProducts(prev => ({
                    ...prev,
                    content: prev.content.filter(item => item.id !== product_id)
                }))
            })
            .catch(error => {
                console.error("Lỗi khi xóa sản phẩm:", error)
            })
    }

    const handleSaveProduct = (updated) => {
        setProducts(prev => ({
            ...prev,
            content: prev.content.map(p => (p.id === updated.id ? updated : p))
        }))
        setEditing(null)
    }
    
    

    return (
        <Container>
            <Row className="mt-5 d-flex align-items-center">
                <Col xs={4}><strong>Tên sản phẩm</strong></Col>
                <Col xs={3}><strong>ID sản phẩm</strong></Col>
                <Col xs={1} className="text-end"><strong>Giá tiền</strong></Col>
                <Col className = "d-flex justify-content-end"><Button>Thêm sản phẩm</Button></Col>
            </Row>
            <div className = "mb-3"></div>
            {items.length === 0 ? (
                <p className="text-center mt-5">Không có sản phẩm nào.</p>
            ) : (
                items.map((item) => (
                    <Row key={item.id} className="border align-items-center py-2">
                        <Col xs={4}>
                            <div className="d-flex align-items-center gap-3">
                                <img src={item.avatarUrl} style={{ maxHeight: "50px" }} alt={item.name} />
                                <p className="mb-0">{item.name}</p>
                            </div>
                        </Col>
                        <Col xs={3}>
                            <p className="mb-0">{item.id}</p>
                        </Col>
                        <Col xs={1} className="text-end">
                            <p className="mb-0">
                                {item.price ? item.price.toLocaleString('vi-VN') : "loading..."} đ
                            </p>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-end gap-2">
                            <Button
                                variant="warning"
                                onClick={() => setEditing(item)}
                                style={{ maxHeight: "40px" }}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleDeleteProduct(item.id)}
                                style={{ maxHeight: "40px" }}
                            >
                                Xóa
                            </Button>
                        </Col>
                    </Row>
                ))
            )}

            <EditProductModal
                show={!!editing}
                product={editing}
                onHide={() => setEditing(null)}
                onSave={handleSaveProduct}
            />

            <div className="mb-5"></div>
        </Container>
    )
}

export default ProductManage
