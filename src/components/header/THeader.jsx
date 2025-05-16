import React from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { Container } from 'react-bootstrap';

function THeader() {
    return (
        <div className="set-bg-3">
            <Container>
                <div className="d-flex w-100 justify-content-between ">
                    <div className="custom-ctn py-2 w-100 " >
                        <div className="nav w-100 justify-content-between align-items-center">
                            <div className="tutorial w-25">
                                <Link to="/" className="t-tutorial tw fs-6 tb fw-semibold " ><FontAwesomeIcon icon={faBars} /> Danh mục sản phẩm </Link>
                            </div>
                            <div className="trick w-75">
                                <Link to="/" className="tw tb mx-4"><img src="https://cdn.divineshop.vn/image/catalog/Anh/Icon%20svg/Nap-thesvg-30724.svg?hash=1640449820" /> Thủ thuật và tin tức</Link>
                                <Link to="/" className="tw tb mx-4"><img src="https://cdn.divineshop.vn/image/catalog/Anh/Icon svg/Gioi-thieu-ban-be-87652.svg?hash=1640449820" /> Hướng dẫn mua hàng </Link>
                                <Link to="/" className="tw tb mx-4"><img src="https://cdn.divineshop.vn/image/catalog/Anh/Icon svg/Lien-he-hop-tac-33199.svg?hash=1640449820" /> Liên hệ hợp tác </Link>
                                <Link to="/" className="tw tb mx-4"><img src="https://cdn.divineshop.vn/image/catalog/Anh/14.03.2022/sale-80749.svg?hash=1730876946" /> GA</Link>
                            </div>
                        </div>

                    </div>

                </div>
            </Container>
        </div>
    )
}

export default THeader