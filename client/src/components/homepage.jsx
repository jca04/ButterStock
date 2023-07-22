import React, { useEffect, useState } from "react";
import "../public/css/homepageStyle.css";
import Navbar from "./reuseComponents/navbar";
import { getRestaurant } from "../api/restaurant";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { removeToken } from "../auth/auth";
// import {useDispatch, useSelector} from 'react-redux'

function HomePage() {
  const showToastMessageNo = () => {
    toast.error("Ha ocurrido un error", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  document.title = "HomePage";

  const [id_restaurant, setIdRestaurant] = useState(null);

  useEffect(() => {
    const fecthData = async () => {
      const response = await getRestaurant();
      try {
        if (Array.isArray(response)){
          if (response.length > 0){
            setIdRestaurant(response[0].id_restaurant)
            return;
          }
        }

        removeToken();
        window.location.href = "/login";
        showToastMessageNo();          
        
        
      } catch (error) {
        showToastMessageNo(); 
      }
    };

    fecthData();
  }, []);



  return (
    <>
      <Navbar />
      <section className="section-homepage-father">
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
        
        > <Link to={`../respies/all/${id_restaurant}`}>
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
