import React, { useEffect, useState } from "react";
import "../public/css/homepageStyle.css";
import logo from "../public/resources/logo/logo_blanco.jpeg";
import Navbar from "./reuseComponents/navbar";
import ShowRespie from "./homePageComponents/showRespie";
import { getRestaurant } from "../api/restaurant";
// import {useDispatch, useSelector} from 'react-redux'

function HomePage() {
  document.title = "HomePage";

  const [showRespie, setShowRespie] = useState(false);

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
          onClick={(e) => {
            e.preventDefault();
            setShowRespie(true);
          }}
        >
            <div className="header-work-btn">
                <h3>Crear, editar, elimianr recetas</h3>
            </div>
        </div>
         <div
          className="create-respie"
          onClick={(e) => {
            e.preventDefault();
            setShowRespie(true);
          }}
        >sadsad</div>
         <div
          className="create-respie"
          onClick={(e) => {
            e.preventDefault();
            setShowRespie(true);
          }}
        >asdasd</div>
         <div
          className="create-respie"
          onClick={(e) => {
            e.preventDefault();
            setShowRespie(true);
          }}
        >asdsad</div>
      </section>

      {showRespie ? <ShowRespie /> : null}
    </>
  );
}

export default HomePage;
