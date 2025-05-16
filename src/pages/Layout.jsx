import React from 'react'
import { Outlet } from 'react-router'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
function Layout() {
    return (
        <>
            <div className="" ><Header /></div>
            <Outlet />
            <div><Footer /></div>
        </>
    )
}

export default Layout