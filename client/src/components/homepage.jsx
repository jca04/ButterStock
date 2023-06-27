import React, { useEffect } from "react";
import "../public/css/homepageStyle.css";
import logo from '../public/resources/logo/logo_blanco.jpeg';
import Navbar from "./reuseComponents/navbar";
import { getRestaurant } from "../api/restaurant";
// import {useDispatch, useSelector} from 'react-redux'

function HomePage() {
    document.title = "HomePage";

    useEffect(() => {
        const fecthData = async() => {
            // const response = await getRestaurant();
        }

        fecthData();
    }, []);

    return (
        <>
            <Navbar/>
            <section className="section-homepage-father">
                <section className="img-homepage-father">
                    <img src={logo}/>
                </section>
                <section className="">

                </section>
            </section>
        </>
    )
}

export default HomePage;
