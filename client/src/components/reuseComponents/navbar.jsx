import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../public/css/navbarStyle.css";
import { getUser } from "../../api/navbar.js";
import { Fade } from "react-awesome-reveal";
import { toast } from "react-toastify";
import logo from "../../public/resources/logo/logo_blanco.jpeg";

function Navbar() {
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
        }
      } catch (err) {
        console.error(err);
      }
    };

    fecthData();
  }, []);

  console.log(dataUser);
  return (
    <nav className="nav-homepage">
      <Fade>
        <section>
          Bienvenido,{" "}
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
              {dataUser.admin && dataUser.admin == 1 ? (
                <li>
                  <Link className="link-navbar" to="../users">
                    Usuarios
                  </Link>
                </li>
              ) : null}

              {dataUser.superAdmin && dataUser.superAdmin == 0 ? (
                <li>
                  <Link className="link-navbar" to="../configurations">
                    Mi restaurante
                  </Link>
                </li>
              ) : (
                <li>
                  <Link className="link-navbar" to="../allRestaurant">
                    Restaurantes
                  </Link>
                </li>
              )}
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
