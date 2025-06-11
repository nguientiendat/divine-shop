import React from "react";
import { Outlet } from "react-router";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import GroqChatbot from "../components/body/GroqChatBot";
function Layout() {
  return (
    <>
      <div className="">
        <Header />
      </div>
      <Outlet />
      <GroqChatbot />

      <div>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
