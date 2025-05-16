import React, { useState, useEffect } from "react";
import QuantitySelector from "../components/body/QuantitySelector";
import Container from "react-bootstrap/Container";
import { useSelector } from 'react-redux';
import { Button } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api/api"
import { useDispatch } from 'react-redux';
import { deleteToCart } from "../redux/apiRequest";

const Cart = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [account_balance,setAccount_balance] = useState(1000000000)
    const [products, setProducts] = useState(null)
    const user = useSelector((state => state.auth.login.currentUser))
    const dispatch = useDispatch(); // 
    // useEffect(()=>{
    //     api.get(`/v1/cart/${user._id}`)
    //         .then((res)=>{  
    //             setProducts(res.data)
    //         })
    //         .catch(err => console.error("Da co loi: ",err))
    //     },[user._id])
        useEffect(() => {
        if (user && user._id) {
            fetchCartData();
        }
    }, [user._id]);
    
    // Hàm fetch dữ liệu giỏ hàng
    const fetchCartData = () => {
        api.get(`/v1/cart/${user._id}`)
            .then((res) => {  
                setProducts(res.data);
            })
            .catch(err => console.error("Đã có lỗi: ", err));
    };
    const items = products?.items.map(item => item.product_id)
    
    
    const handlePrice = () => {
        let price = 0;
        for (let i = 0; i < items?.length; i++) {
            price += items[i].price;
        }

        return price;

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
        const showQr = () => {
        setIsVisible((prev) => !prev); //
    }

  const handleRemoveCart = (productId) => {
    const data = {
      user_id: user._id,
      product_id: productId
    };
    console.log(data)
    deleteToCart(data, dispatch)
                .then(() => {
            // Đợi một chút để đảm bảo server đã xử lý xong
             setTimeout(() => {
                fetchCartData(); // Cập nhật lại giỏ hàng
            }, 300);
        })
        .catch(error => {
            console.error("Lỗi khi xóa sản phẩm:", error);
        });
  };
    return(
         <div className="my-5">
            <Container>
                <div className='bg-white bg-white p-4 rounded d-flex w-100  '>
                    <div style={{ minWidth: "75%" }}> 
                        <h3 className = 'f-bold'>Giỏ Hàng</h3>
                        {items?.map((item) => {
                            return (
                                <div className="d-flex border p-4 rounded my-3 position-relative" key={item.id} style={{ maxWidth: "1000px" }}>
                                    <div className="mx-3">
                                        <img className="ct-img" src={item.src} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <p className="fw-bold">{item.name}</p>
                                        <QuantitySelector price={item.price.toLocaleString('vi-VN')}
                                            sale={item.original_price.toLocaleString('vi-VN')}
                                            discount={item.discount}

                                        />
                                    </div>
                                    <Button variant="outline-danger"
                                        onClick={()=>  handleRemoveCart(item._id)}
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
                        <img style={{ display: isVisible ? "block" : "none", width: '100%' }} alt = "Đây là mã qr"
                            src={`https://img.vietqr.io/image/mbbank-0352290387-compact2.jpg?amount=${handlePrice()}&addInfo=dong%20gop%20quy%20vac%20xin&accountName=nguyen%20tien%20dat%20`} />
                    </div>

                </div>
            
            </Container>
        </div>

    )
}
    
export default Cart