import React, { useEffect } from "react";
import "../public/css/homepageStyle.css";
import Navbar from "./reuseComponents/navbar";
import {useDispatch, useSelector} from 'react-redux'

function HomePage() {
   

    document.title = "HomePage";
    let homeSlice = useSelector(state => state.home);


   
    
    return (
        <>
            <Navbar/>
            {console.log(homeSlice)}
            <section className="section-homepage-father">
                
            </section>
        </>
    )
}

export default HomePage;
