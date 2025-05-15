import React from 'react'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { Link } from 'react-router';
import api from '../../api/api';
function Option({value_id, name, value}) {

// const [products, setProducts] = useState([]);

//  const getData = () => {
//     api.get(`http://localhost:5000/product`, {
//         params: {
//             category_id: value_id
//         }
//     })
//     .then((response) => {
//         // console.log(response.data)
//         setProducts(response.data);
    
//     })
//     .catch((error) => {
//         console.error("Lỗi khi lấy danh sách sản phẩm:", error);
//     });
// }


const [products, setProducts] = useState([]);

 const getData = () => {
    api.get(`/v1/product`, {
        params: {
            category_id: value_id
        }
    })
    .then((response) => {
        // console.log(response.data)
        setProducts(response.data);
    
    })
    .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    });
}



useEffect(() => {
    getData();
}, []);

// console.log(products)
    return (
        <Container className="text-align-center py-2 my-2 ">
            <div className="name-option d-flex justify-content-between">
                <div className="tb">
                    <h3>{name}</h3>
                </div>
                <div className="btn" >
                    <Button variant="primary">
                    <Link to="/trending" className="tw fw-semibold ">Kham Pha </Link>

                    </Button>
                </div>

            </div>
            <Row className="my-3 ">
                <ProductGrid products={products} value ={value} />

            </Row>
        </Container>
    )
}

export default Option




