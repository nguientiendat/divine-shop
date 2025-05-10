import { Container,Row,Col } from "react-bootstrap"
import { useState, useEffect } from "react"
import api from "../api/api"
import Items from "../components/body/Items"
const Trending = ()=>{
    const [Products,setProducts] = useState([])
   useEffect(()=>{
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Loi !!!!",err))

   },[]);
//    console.log(Products)
    return(
        <div className = "my-3">
            <Container>
                <div className ="">
                    <h4 className = "fw-bold">#San Pham Ban Chay Nhat</h4>
                </div>
                <div>
                    <Row>
                        {Products.map((product)=>{
                           return(
                           <Col lg="3" className = "mb-4">
                             <Items 
                                id={product.id}
                                src={product.src}
                                name={product.name}
                                price={product.price ? product.price.toLocaleString('vi-VN') : "Loading...!"}
                                original_price={product.original_price}
                                discount={product.discount}
                            />
                            </Col>
                           )
                        })}
                    </Row>
                </div>
            </Container>
        </div>

    )
}
export default Trending