import React from 'react'
import { useParams } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTag, faCreditCard, faCartShopping, faCheck, faImage } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { addToCart } from '../redux/apiRequest';
import { AtomicBlockUtils, CompositeDecorator } from 'draft-js';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import api from "../api/api.js"
import { useSelector } from 'react-redux';

// Component để render ảnh trong editor
const ImageComponent = (props) => {
    let src = '';
    try {
        const entity = props.contentState.getEntity(props.entityKey);
        src = entity.getData().src;
    } catch (error) {
        console.error("Không lấy được src từ entity:", error);
    }

    console.log("ImageComponent src:", src); // In ra để debug

    return (
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <img 
                src={src} 
                alt="Ảnh sản phẩm" 
                style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }} 
                onError={(e) => {
                    console.error("Lỗi tải ảnh:", e);
                    e.target.src = "https://via.placeholder.com/400x300?text=Lỗi+tải+ảnh";
                    e.target.alt = "Lỗi tải ảnh";
                }} 
            />
        </div>
    );
};


const ProductDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]); // Mảng rỗng là giá trị mặc định tốt hơn null
    const [couponCode, setCouponCode] = useState(''); // Thêm state cho mã giảm giá
    const [loading, setLoading] = useState(true); // Thêm state loading để xác định trạng thái tải
    const [error, setError] = useState(null); // Thêm state lỗi để xử lý lỗi
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    // State cho popup chèn ảnh
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    
    const userData = JSON.parse(localStorage.getItem("user"));
    const accessToken = userData?.result?.accessToken;
    const user = userData?.result?.user_id;

   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
    setLoading(true);
    setError(null);
    console.log(user)
    api.get(`/api/products/${id}`)
        .then((response) => {
            const data = response.data;
            setProduct(data);
            console.log(data)
            // Nếu sản phẩm có mô tả, hiển thị trong editor
            if (data.description) {
                try {
                    const contentState = convertFromRaw(data.description);
                    setEditorState(EditorState.createWithContent(
                        contentState,
                        createDecorator() // Sử dụng decorator khi tạo editorState
                    ));
                } catch (error) {
                    console.error("Lỗi khi parse mô tả sản phẩm:", error);
                    // Không set lỗi chung vì không muốn ảnh hưởng đến việc hiển thị sản phẩm
                }
            }
            setLoading(false);
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
            setLoading(false);
        });
}, [id]);
    // console.log(products)
    console.log(user)
    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!product) return;
        if(!email.trim()||!phone.trim()) {
        setError("Vui lòng nhập đầy đủ email và số điện thoại!");
        return
       
        }
        if (user === null) {
                alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
                navigate("/login"); // <-- chuyển hướng đến trang login
                return;
            
        }
        setError("");
        try {
            const response = await api.post("/api/cart-items", {
            email: email,
            password: phone, // hoặc token nếu bạn dùng xác thực bằng token
            userId: user,
            productId: id
        },{
            headers:{"Authorization":`Bearer ${accessToken}`}
        });

        console.log("Thêm vào giỏ thành công:", response.data);
        // Có thể show thông báo hoặc cập nhật UI
    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        // setError("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
      
    };
    // Tạo Decorator để xử lý entity IMAGE
    const createDecorator = () => {
        return new CompositeDecorator([
            {
                strategy: (contentBlock, callback, contentState) => {
                    contentBlock.findEntityRanges(
                        (character) => {
                            const entityKey = character.getEntity();
                            return (
                                entityKey !== null &&
                                contentState.getEntity(entityKey).getType() === 'IMAGE'
                            );
                        },
                        callback
                    );
                },
                component: ImageComponent,
            },
        ]);
    };

    // Khởi tạo editorState với decorator
    const [editorState, setEditorState] = useState(() => 
        EditorState.createEmpty(createDecorator())
    );
    
    useEffect(() => {
        fetch(`http://localhost:8080/api/products`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Không thể tải danh sách sản phẩm");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
                // Không set lỗi chung vì đây chỉ là tính năng phụ
            });
    }, []);



    // Xử lý mua ngay
    const handleBuyNow = () => {
        if (!product) return;

        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            original_price: product.original_price,
            discount: product.discount,
            src: product.src
        };
        addToCart(data, dispatch, navigate);
        navigate('/checkout'); // Chuyển đến trang thanh toán
    };

    // Xử lý mã giảm giá
    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            alert("Vui lòng nhập mã giảm giá!");
            return;
        }
        
        // Gọi API kiểm tra mã giảm giá (giả định)
        console.log("Áp dụng mã giảm giá:", couponCode);
        // Thêm code xử lý mã giảm giá ở đây
        alert(`Đã áp dụng mã giảm giá: ${couponCode}`);
    };

    // Hàm mở modal chèn ảnh
    const openImageModal = () => {
        setImageUrl('');
        setShowImageModal(true);
    };
    
    // Hàm đóng modal chèn ảnh
    const closeImageModal = () => {
        setShowImageModal(false);
    };
    
    // Hàm xử lý khi người dùng xác nhận chèn ảnh
    const handleInsertImage = () => {
        if (!imageUrl || imageUrl.trim() === '') {
            alert('Vui lòng nhập đường dẫn ảnh!');
            return;
        }

        // Kiểm tra xem URL có phải là ảnh không
        const img = new Image();
        img.onload = function() {
            // Ảnh tải thành công - chèn vào editor
            insertImage(imageUrl);
            closeImageModal();
        };
        img.onerror = function() {
            // Lỗi tải ảnh
            alert('URL ảnh không hợp lệ hoặc không thể tải được. Vui lòng kiểm tra lại!');
        };
        img.src = imageUrl;
    };

    // Hàm chèn ảnh vào editor đã được cải tiến
    const insertImage = (imgUrl) => {
        if (!imgUrl) return;
    
        try {
            new URL(imgUrl); // Validate URL
        } catch (e) {
            console.error("URL ảnh không hợp lệ:", e);
            alert("URL ảnh không hợp lệ. Vui lòng kiểm tra lại!");
            return;
        }
    
        try {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
                'IMAGE',
                'IMMUTABLE',
                { src: imgUrl }
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    
            const newEditorState = EditorState.push(
                editorState,
                contentStateWithEntity,
                'apply-entity'
            );
    
            const updatedEditorState = AtomicBlockUtils.insertAtomicBlock(
                newEditorState,
                entityKey,
                ' '
            );
    
            setEditorState(updatedEditorState);
        } catch (error) {
            console.error("Lỗi khi chèn ảnh:", error);
            alert("Có lỗi xảy ra khi chèn ảnh. Vui lòng thử lại!");
        }
    };

    // Hàm xử lý thay đổi nội dung trong editor
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    // Hàm xử lý block renderer cho atomic blocks (ảnh)
    const blockRendererFn = useCallback((contentBlock) => {
        if (contentBlock.getType() === 'atomic') {
            const entityKey = contentBlock.getEntityAt(0);
            if (entityKey) {
                try {
                    const contentState = editorState.getCurrentContent();
                    // Kiểm tra xem contentState có tồn tại và hasEntity là một hàm
                    if (contentState && typeof contentState.hasEntity === 'function') {
                        // Sau đó mới gọi hasEntity
                        if (contentState.hasEntity(entityKey)) {
                            const entity = contentState.getEntity(entityKey);
                            if (entity && entity.getType() === 'IMAGE') {
                                const { src } = entity.getData();
                                console.log("Rendering image:", src); // Debug log
                                return {
                                    component: ImageComponent,
                                    editable: false,
                                    props: { src }
                                };
                            }
                        }
                    } else {
                        console.warn('ContentState chưa được khởi tạo đúng hoặc thiếu phương thức hasEntity');
                    }
                } catch (error) {
                    console.error("Error in blockRendererFn:", error);
                    return null;
                }
            }
        }
        return null;
    }, [editorState]);

    // Hàm lưu mô tả sản phẩm
    const saveDescription = async () => {
        if (!product) {
            alert("Không có thông tin sản phẩm để cập nhật!");
            return;
        }

        try {
            const rawContent = convertToRaw(editorState.getCurrentContent());
            
            // Cập nhật mô tả cho sản phẩm hiện tại
            const productData = {
                ...product,
                description: rawContent
            };
        
            const response = await fetch(`http://localhost:5000/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        
            if (!response.ok) {
                throw new Error("Lỗi khi cập nhật mô tả sản phẩm");
            }
        
            const data = await response.json();
            console.log("Đã cập nhật mô tả sản phẩm:", data);
            alert("Cập nhật mô tả thành công!");
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi khi cập nhật mô tả: " + error.message);
        }
    };

    // Hiển thị màn hình loading
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-2">Đang tải thông tin sản phẩm...</p>
                </div>
            </Container>
        );
    }

    // Hiển thị thông báo lỗi
    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </div>
            </Container>
        );
    }

    // Hiển thị thông báo nếu không tìm thấy sản phẩm
    if (!product) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="text-center">
                    <div className="alert alert-warning" role="alert">
                        Không tìm thấy thông tin sản phẩm
                    </div>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                        Quay lại danh sách sản phẩm
                    </Button>
                </div>
            </Container>
        );
    }
    
    return (
        <Container>
            <div className="d-flex my-4 py-3 b bg-white justify-content-between flex-wrap">
                <div className="mb-3 mb-md-0">
                    <img className="ct-img2 rounded" src={product.result.avatarUrl} alt={product.name} />
                </div>
                <div className="px-4 mb-3 mb-md-0">
                    <p className="m-0">Sản phẩm</p>
                    <h3>{product.result.name}</h3>
                    <p> <FontAwesomeIcon icon={faBox} /> Tình trạng: <span className='ct-color-green'>Còn {product.result.quantity} sản phẩm</span></p>
                    <p><FontAwesomeIcon icon={faTag} /> Thể loại: App, Giải trí, Game</p>
                    <h4>{product.result.price? (product.result.price-(product.result.price * product.result.discount / 100)).toLocaleString('vi-VN') : "Loading...!"}đ</h4>
                    <div className="d-flex align-items-center">
                        <h5 className="ct-c m-0">{product.result.price? product.result.price.toLocaleString('vi-VN') : "Loading...!"}đ </h5>
                        <span className="sale rounded fw-bold mx-2 p-1" >-{product.result.discount}%</span>
                    </div>
                    <div>
                        <div className="border w-100 my-3"></div>
                        <form className ="DesInfo">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Nhập email muốn nhận tài khoản"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                 />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        placeholder="Nhập số điện thoại của bạn"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                     />
                                 </div>                        
                        
                        </form>
                    </div>
                    <div className="border w-100 my-3"></div>
                    <div>
                        <Button type="button" className="ctm-btn-3 no-hover me-2 mb-2" onClick={handleBuyNow}>
                            <FontAwesomeIcon icon={faCreditCard} /> Mua Ngay
                        </Button>
                        <Button type="button" className="ctm-btn-3 no-hover bg-white t-blue border mb-2" onClick={handleAddToCart}>
                            <FontAwesomeIcon icon={faCartShopping} /> Thêm vào giỏ Hàng
                        </Button>
                    </div>

                </div>
                <div>
                    <h5>Mã giảm giá</h5>
                    <div className="d-flex ct-input">
                        <Form.Control
                            type="text"
                            placeholder="Mã giảm giá"
                            className="mr-sm-2"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button type="button" className="ctm-btn mx-2" onClick={handleApplyCoupon}>
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className="mb-5">
                <h3>Mô tả sản phẩm</h3>
                <button className="btn btn-secondary mb-2" onClick={openImageModal}>
                    <FontAwesomeIcon icon={faImage} className="me-2" /> Chèn ảnh
                </button>
                <div className="border p-3 mb-3">
                    <Editor
                        editorState={editorState}
                        onChange={onEditorStateChange}
                        placeholder="Nhập mô tả sản phẩm..."
                        blockRendererFn={blockRendererFn}
                    />
                </div>
                <button className="btn btn-primary" onClick={saveDescription}>Lưu mô tả</button>
                
                {/* Modal chèn ảnh */}
                <Modal show={showImageModal} onHide={closeImageModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chèn ảnh</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Đường dẫn ảnh (URL)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập đường dẫn ảnh..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                autoFocus
                            />
                            <Form.Text className="text-muted">
                                Nhập đường dẫn URL của ảnh bạn muốn chèn vào mô tả sản phẩm
                            </Form.Text>
                        </Form.Group>
                        
                        {/* Xem trước ảnh */}
                        {imageUrl && (
                            <div className="mt-3 text-center">
                                <p className="mb-2">Xem trước:</p>
                                <img 
                                    src={imageUrl} 
                                    alt="Xem trước" 
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '200px',
                                        border: '1px solid #ddd'
                                    }}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x300?text=Lỗi+tải+ảnh";
                                        e.target.alt = "Lỗi tải ảnh";
                                    }}
                                />
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeImageModal}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleInsertImage}>
                            Chèn ảnh
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            
            {/* Phần sản phẩm liên quan */}
            {products.length > 0 && (
                <div className="mb-5">
                    <h3>Sản phẩm liên quan</h3>
                    <div className="row">
                        {products
                            .filter(p => p.id !== product.id) // Loại bỏ sản phẩm hiện tại
                            .slice(0, 4) // Chỉ lấy 4 sản phẩm
                            .map((relatedProduct) => (
                                <div key={relatedProduct.id} className="col-md-3 col-6 mb-3">
                                    <div className="card h-100">
                                        <img 
                                            src={relatedProduct.src} 
                                            className="card-img-top" 
                                            alt={relatedProduct.name}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/200x200?text=Sản+phẩm";
                                            }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{relatedProduct.name}</h5>
                                            <p className="card-text fw-bold">{relatedProduct.price}đ</p>
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => navigate(`/${relatedProduct.id}/product-detail`)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </Container>
    );
};

export default ProductDetail;