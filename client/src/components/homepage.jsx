import React, { useEffect, useState } from "react";
import "../public/css/homepageStyle.css";
import logo from "../public/resources/logo/logo_blanco.jpeg";
import Navbar from "./reuseComponents/navbar";
import { useDispatch } from "react-redux";
import { getRestaurant } from "../api/restaurant";
import { Link } from "react-router-dom";
// import {useDispatch, useSelector} from 'react-redux'

function HomePage() {
  document.title = "HomePage";

  useEffect(() => {
    const fecthData = async () => {
      // const response = await getRestaurant();
    };

    fecthData();
  }, []);



  return (
    <>
      <Navbar />
      <section className="section-homepage-father">
        <section className="img-homepage-father">
          <img src={logo} />
        </section>
        <section className="">
          <table>
            <thead>
              <tr>
                <th>sadad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sadsad</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
      <section className="zone-work">
        <div
          className="create-respie"
        
        > <Link to="../respies/all">
            ir
        </Link>

            <div className="header-work-btn">
                <h3>Crear, editar, elimianr recetas</h3>
            </div>
        </div>
         <div
          className="create-respie"
          onClick={(e) => {
            e.preventDefault();
          }}
        >sadsad</div>
         <div
          className="create-respie"
          onClick={(e) => {
            e.preventDefault();
          }}
        >asdasd</div>
         <div
          className="create-respie"
          onClick={(e) => {
            e.preventDefault();
          }}
        >asdsad</div>
      </section>
    </>
  );
}

export default HomePage;
