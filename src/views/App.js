import { Route, Routes } from "react-router";
import PageRoot from "../pages/PageRoot";
import Layout from "../pages/Layout";
import ProductDetail from "../pages/ProductDetail";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import PageAdmin from "../pages/PageAdmin";
import TestA from "../pages/TestA";
import "../styles/style.css";
import Trending from "../pages/Trending";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import ProductManage from "../pages/ProductManage";
import PaymentSuccess from "../pages/PaymentSuccess";
import UsersManager from "../pages/UsersManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser))); // đồng bộ lại user vào Redux store
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageRoot />} />
          <Route path="/:id/product-detail" element={<ProductDetail />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pageadmin" element={<PageAdmin />} />
          <Route path="/dashboard" element={<TestA />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/product-manage" element={<ProductManage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/users-manage" element={<UsersManager />} />
        </Route>
      </Routes>
      <ToastContainer /> {/* <== Đây là nơi ToastContainer được render */}
    </>
  );
}

export default App;
