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
      api.get('/v1/product')
          .then((res) => {
            setProducts(res.data)
          })
          .catch(err => console.error("Loi!!!!!", err.message))
    }, [])
    
    const handleDeleteProduct = (product_id) => {
        const data = {
            product_id: product_id
        }
        deleteProduct(data, dispatch)
            .catch(error => {
                console.error("Loi!!!!!", error)
            })
    }
    
    const handleSaveProduct = (updated) => {
        // Gọi API PUT/PATCH ở đây nếu cần
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        setEditing(null);
    }
    
    return (
        <>
            <Container>
                <Row className="mt-5">
                    <Col xs={4}><p>Tên sản phẩm</p></Col>
                    <Col xs={3}><p>ID sản phẩm</p></Col>
                    <Col xs={1} className="text-end"><p>Giá tiền</p></Col>
                    <Col></Col> 
                </Row>
                {products.map((product) => (
                    <Row key={product._id} className="border">
                        <Col className="mb-2 mt-2" xs={4}>
                            <div className="d-flex">
                                <div>
                                    <img src={product.src} style={{maxHeight: "50px"}} alt={product.name} />
                                </div>
                                <div>
                                    <p>{product.name}</p>
                                </div>                                        
                            </div>
                        </Col>
                        <Col className="mb-2 mt-2" xs={3}>
                            <div>
                                <p>{product._id}</p>
                            </div>
                        </Col>
                        <Col className="mb-2 mt-2 text-end" xs={1}>
                            <div>
                                <p>{product.price ? product.price.toLocaleString('vi-VN') : "loading..."} đ</p>
                            </div>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-end gap-3 align-items-center">
                            <Button 
                                onClick={() => setEditing(product)}
                                style={{maxHeight: "40px"}}>
                                Sửa
                            </Button>
                            <Button
                                onClick={() => handleDeleteProduct(product._id)}
                                style={{maxHeight: "40px", backgroundColor: "red"}}>
                                Xóa
                            </Button>
                        </Col>
                    </Row>
                ))}
                
                <EditProductModal
                    show={!!editing}
                    product={editing}
                    onHide={() => setEditing(null)}
                    onSave={handleSaveProduct}
                />                
         
                <div className="mb-5"></div>
            </Container>
        </>
    )
}

export default ProductManage