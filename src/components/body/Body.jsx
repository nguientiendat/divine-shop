import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router";
import Carousel from "react-bootstrap/Carousel";
import { useState, useEffect } from "react";
import Option from "./Option";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faVirus } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faStream } from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faSteam,
  faWindows,
  faXbox,
} from "@fortawesome/free-brands-svg-icons";

function Body() {
  const [images, setImages] = useState([]);

  const getData = async () => {
    const url = "http://localhost:5000/slideShow";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();

      setImages(json);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mt-3 w-100  ">
      <Container>
        <Row>
          <Col className="mx-2 set-bg-3 rounded">
            <Row className="d-flex flex-column justify-content-between">
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faGamepad}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Giải trí
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Làm việc
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Học tập
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faStream}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Edit Anh
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faWindows}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                WinDow
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faGoogle}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Google
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faSteam}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Steam Wallet
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faVirus}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Diệt Virus
              </Link>
              <Link className="tw tb mg fs-5 ">
                <FontAwesomeIcon
                  icon={faXbox}
                  style={{ color: "#404245" }}
                  className="mx-2"
                />
                Xbox, iTunes Gift Card
              </Link>
            </Row>
          </Col>
          <Col className=" mx-2 p-0   " xs={6}>
            <Carousel>
              {/* {images.map((image) => (
                <Carousel.Item key={image.id} interval={1500}>
                  <img className="d-block w-100 p-0  rounded" src={image.src} />
                </Carousel.Item>
              ))} */}

              <Carousel.Item interval={1500}>
                <img
                  alt="banner"
                  className="d-block w-100 p-0 rounded"
                  src="https://cdn.divineshop.vn/image/catalog/Banner/Netflix%20banner%2025k-96766.png?hash=1734103546"
                />
              </Carousel.Item>
              <Carousel.Item interval={1500}>
                <img
                  alt="banner"
                  className="d-block w-100 p-0 rounded"
                  src="https://cdn.divineshop.vn/image/catalog/Banner mới/iQIYI29k-87594.png?hash=1743745440"
                />
              </Carousel.Item>
            </Carousel>
          </Col>
          <Col className="p-0 mx-3 ct-row ">
            <Row className="">
              <img
                alt="img"
                className=" ctm-img p-0 rounded hc "
                src="https://cdn.divineshop.vn/image/catalog/Banner mới/VPN-61865.png?hash=1735200289 "
              ></img>
            </Row>
            <Row className="">
              <img
                alt="img"
                className="ctm-img p-0 rounded "
                src=" https://cdn.divineshop.vn/image/catalog/Banner mới/AI-58645.png?hash=1735200362"
              ></img>
            </Row>
          </Col>
        </Row>
        <Row className="my-3">
          <Col className="p-0 mx-1 ct-row ">
            <img
              alt="img"
              className=" ctm-img p-0 rounded "
              src="https://cdn.divineshop.vn/image/catalog/Banner mới/VPN-61865.png?hash=1735200289 "
            ></img>
          </Col>
          <Col className="p-0 mx-2 ct-row ">
            <img
              alt="img"
              className=" ctm-img p-0 rounded"
              src="https://cdn.divineshop.vn/image/catalog/Banner mới/VPN-61865.png?hash=1735200289 "
            ></img>
          </Col>
          <Col className="p-0 mx-2 ct-row ">
            <img
              alt="img"
              className=" ctm-img p-0 rounded "
              src="https://cdn.divineshop.vn/image/catalog/Banner mới/VPN-61865.png?hash=1735200289 "
            ></img>
          </Col>
          <Col className="p-0 mx-2 ct-row ">
            <img
              alt="img"
              className=" ctm-img p-0 rounded "
              src="https://cdn.divineshop.vn/image/catalog/Banner mới/VPN-61865.png?hash=1735200289 "
            ></img>
          </Col>
        </Row>
      </Container>
      <Option
        name="Học tập"
        value="b"
        categoryId="3555c614-4c42-4889-8302-f5c1a1d8cffb"
      />
      <Option
        name="Giải trí"
        value="b"
        categoryId="20aefc93-c4f8-4bb3-a8b4-391bdf9b7091"
      />
      <div className="test-bgr ">
        <div className="my-3 position-relative ">
          <div className="border w-25 rounded-pill d-flex position-absolute spbanchay ">
            <div className="mx-2 my-2">
              <img
                alt="img"
                src="https://cdn.divineshop.vn/static/1478de4bf059d759990c4849f3c3e8ce.svg"
              ></img>
            </div>
            <div className="">
              <h2 className="text-white fw-bold ">#San Pham Ban Chay Nhat</h2>
            </div>
          </div>
          <Option
            className="game"
            categoryId="c4b0f4bb-a879-49f1-9a0c-02317e0fe6bf"
            value="z"
          />
        </div>
      </div>
    </div>
  );
}

export default Body;
