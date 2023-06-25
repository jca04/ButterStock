import React from "react";
import { AxioInterceptor } from "../auth/auth";
import "../public/css/homepageStyle.css";
import Navbar from "./reuseComponents/navbar";

AxioInterceptor();


function HomePage() {
    document.title = "HomePage";
    
    return (
        <Navbar/>
    )
}

export default HomePage;
