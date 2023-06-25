import React, { useEffect, useState } from "react";
import { AxioInterceptor } from "../../auth/auth";
import { Link } from "react-router-dom";
import "../../public/css/navbarStyle.css";
import { getUser } from "../../api/navbar.js";
import { Fade } from "react-awesome-reveal";
import {useDispatch, useSelector} from 'react-redux'
import {addHome} from "../../features/homepage/homepageSlice";

AxioInterceptor();

function Navbar() {
  const dispac = useDispatch();
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    const fecthData = async () => {
      const res = await getUser();
      try {
        //si fallo el token
        if (res.message) {
          if (res.message.message === "Request failed with status code 400") {
            console.error("Request failed with status code 400");
          }
        } else {
          let dataUser = res;
          setDataUser(dataUser);
          dispac(addHome(dataUser));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fecthData();
  }, []);

  const renderSuperAdmin = () => {
    if (dataUser.superAdmin !== undefined){
      if (dataUser.superAdmin == 0){
        return(
          <li>
            <Link className="link-navbar" to="../configurations">
              Mi restaurante
            </Link>
          </li>
        )
      }else{
        return (
          <li>
            <Link className="link-navbar" to="../allRestaurant">
              Restaurantes
            </Link>
          </li>
        )
      }
    }
  }

  const renderUser = () => {
    if (dataUser.admin !== undefined){
      if (dataUser.admin == 1 && dataUser.superAdmin == 0){
        return (
          <li>
            <Link className="link-navbar" to="../users">
              Usuarios
            </Link>
          </li>
        )
      }else{
        if (dataUser.admin == 1 && dataUser.superAdmin == 1 || dataUser.admin == 0 && dataUser.superAdmin == 1){
          return (
            <li>
              <Link className="link-navbar" to="../SuperAdminUser">
                Usuarios
              </Link>
            </li>
          )
        }else{
          return (null);
        }
      }
    }
  }

  return (
    <nav className="nav-homepage">
      <Fade>
        <section>
          Bienvenido,
          {dataUser.nombre && dataUser.apellido
            ? dataUser.nombre + " " + dataUser.apellido
            : null}
        </section>
      </Fade>
      <section className="section-link">
        <div className="link-nav-homepgae">
          <Fade>
            <ul>
              <li>
                <Link className="link-navbar" to="../homepage">
                  Inicio
                </Link>
              </li>
              {renderUser()}      
              {renderSuperAdmin()}     
            </ul>
          </Fade>
        </div>
        <div className="log-out-nav-homepage">
          <button
            className="btn-log-out"
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.href = "../login";
            }}
          >
            Cerrar sesion
          </button>
        </div>
      </section>
    </nav>
  );
}

export default Navbar;
