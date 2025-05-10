import React, { useState, useEffect } from "react";
import QuantitySelector from "../components/body/QuantitySelector";
import Container from "react-bootstrap/Container";
import { useSelector } from 'react-redux';
import { Button } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api/api"



const Cart = () => {
    // deleteCartProduct()
    const [products, setProducts] = useState([])
    const [isVisible, setIsVisible] = useState(false);
    const [account_balance,setAccount_balance] = useState(100000000)
    
    const toggleVisibility = () => {
        setIsVisible((prev) => !prev); // Đảo ngược trạng thái
    };
    const user = useSelector((state => state.auth.login.currentUser))

    useEffect(() => {
        api.get('/cart')
            .then(res=>setProducts(res.data))
            .catch(err => console.error("Loi !!!!",err))

    }, []);
    console.log(products)
 
    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/cart/${productId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error(`Lỗi khi xóa sản phẩm: ${response.statusText}`);
            }
    
            // Cập nhật state, loại bỏ sản phẩm đã xóa
            setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
            console.log(`Sản phẩm với ID ${productId} đã bị xóa.`);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };
   
    const handlePrice = () => {
        let price = 0;
        for (let i = 0; i < products.length; i++) {
            price += products[i].price;
        }

        return price;

    }
    handlePrice()
    const showQr = () => {
        setIsVisible((prev) => !prev); //
    }
    const ammountAdded = () => {
        let amountAdd
        if (account_balance >= handlePrice()) {
            amountAdd = 0;
            return amountAdd
        } else {
            amountAdd = handlePrice() - (account_balance)
            return amountAdd
        }
    }
    useEffect(() => {
        ammountAdded()
    }, [account_balance])

    const handleBuyNow = (amountAdd) => {
        
        if(account_balance>=amountAdd){
            alert("Thanh toan thanh cong, xin doi he thong xu ly")
            setAccount_balance (account_balance - handlePrice())
            console.log(account_balance)
        }
        else{
            alert("So du khong du!!! Vui long nap them tien")
        }
    }


    return (
        <div className="my-5">
            <Container>

                <div className='bg-white bg-white p-4 rounded d-flex w-100  '>
                    <div style={{ minWidth: "75%" }}>
                        {products.map((product) => {
                            return (
                                <div className="d-flex border p-4 rounded my-3 position-relative" key={product.id} style={{ maxWidth: "1000px" }}>
                                    <div className="mx-3">
                                        <img className="ct-img" src={product.src} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <p className="fw-bold">{product.name}</p>
                                        <QuantitySelector price={product.price.toLocaleString('vi-VN')}
                                            sale={product.original_price.toLocaleString('vi-VN')}
                                            discount={product.discount}

                                        />
                                    </div>
                                    <Button variant="outline-danger"
                                        onClick={() => {
                                            deleteProduct(product.id)
                                            console.log(typeof product.id)
                                        }}
                                        className="position-absolute"
                                        style={{ bottom: '10px', right: '10px' }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>

                                </div>
                            )
                        })}
                    </div>
                    <div className="w-100 mx-3 " >
                        <p className="m-0 fw-bold mx-5 my-3">Thanh Toán</p>
                        <div className="d-flex justify-content-between ">
                            <div>Tổng giá</div>
                            <div>{handlePrice().toLocaleString('vi-VN')}</div>
                        </div>
                        <div className="lw my-2 "></div>
                        <div className="d-flex justify-content-between ">
                            <div>Tổng giá trị phải thanh toán</div>
                            <div className="fw-bold">{handlePrice().toLocaleString('vi-VN')}</div>

                        </div>
                        <div className="d-flex justify-content-between my-2 ">
                            <div>Số dư hiện tại: </div>
                            <div className="fw-bold">{account_balance.toLocaleString('vi-VN')}</div>

                        </div>
                        <div className="d-flex justify-content-between my-2">
                            <div>Số tiền cần nạp thêm: </div>
                            <div className="fw-bold">{ammountAdded().toLocaleString('vi-VN')}</div>

                        </div>
                        <Button style={{ width: "100%" }}>Nạp thêm vào tài khoản</Button>

                        <div className="text-center">Quét mã thanh toán không cần nạp</div>
                        <Button onClick={showQr} style={{ width: "100%", marginBottom: "15px", backgroundColor: ' #005BAA' }}>Mua siêu tốc qua Mobile Banking</Button>
                        <Button onClick={()=> handleBuyNow(handlePrice())} style={{ width: "100%", backgroundColor: ' #AE2070' }}>Mua ngay</Button>
                        <img style={{ display: isVisible ? "block" : "none", width: '100%' }}
                            src={`https://img.vietqr.io/image/mbbank-0352290387-compact2.jpg?amount=${handlePrice()}&addInfo=dong%20gop%20quy%20vac%20xin&accountName=nguyen%20tien%20dat%20`} />
                    </div>

                </div>
            
            </Container>
        </div>





    )
}
export default Cart