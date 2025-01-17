import "../styles/App.css";
import Header from "../components/header/Header";
import Body from "../components/body/Body";
import { Route, Routes } from "react-router";
import PageRoot from "../pages/PageRoot";
import Layout from "../pages/Layout";
import ProductDetail from "../pages/ProductDetail";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import PageAdmin from "../pages/PageAdmin";
function App() {
  return (
  <Routes>
    <Route path ='/' element = {<Layout/>} >
      <Route index element ={<PageRoot />} />
      <Route path = '/:id/product-detail' element = {<ProductDetail />} />
      <Route path = "/login" element = {<LogIn />} />
      <Route path = "/register" element = {<Register />} />
      <Route path = "/cart" element = {<Cart />} />
      <Route path = "/pageadmin" element = {<PageAdmin />} />


    </Route>
  </Routes>
  );
}

export default App;
