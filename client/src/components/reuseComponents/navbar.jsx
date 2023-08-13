import React, { useEffect, useState } from "react";
import { AxioInterceptor } from "../../auth/auth";
import { Link } from "react-router-dom";
import "../../public/css/navbarStyle.css";
import { getUser } from "../../api/navbar.js";
import { Fade } from "react-awesome-reveal";
import {useDispatch, useSelector} from 'react-redux'
import {RxHamburgerMenu} from "react-icons/rx"; 
import {addHome, deleteHome} from "../../features/homepage/homepageSlice";
import logo from "../../public/resources/logo/logo_blanco.png";


AxioInterceptor();

function Navbar() {
  //se utiliza para editar el estdao glboal del usuario
  const dispatch = useDispatch();
  //estado global trayendo los datos
  let homeSlice = useSelector(state => state.home);
  const [dataUser, setDataUser] = useState({});
  

  useEffect(() => {
    const fecthData = async () => {
      const res = await getUser();
      try { 
        //si fallo el token
        if (res.message) {
          if (res.message.message === "Request failed with status code 400") {
            console.error("Request failed with status code 400");
            // localStorage.clear();
            // navigate('/login');
          }
        } else {
          let dataUser = res;
          setDataUser(dataUser);
          dispatch(addHome(dataUser));
        }
      } catch (err) {
        console.error(err);
      }
    };

    //si el estado global tiene datos entonces
    //se le agrega al estado del navbar para que renderize los datos y no tenga que hacer la misma consulta siempre
    if (homeSlice.length == 1){
      setDataUser(homeSlice[0]);
    }else{
      //solo pasa cuando se loguea que consulta los datos del usuairo por primera vez
      fecthData();
    }


    

    
  }, []);

  const renderSuperAdmin = () => {
    if (dataUser.superAdmin !== undefined){
      if (dataUser.superAdmin == 0){
        return(
          <li>
            <Link className="link-navbar configurations" to="../configurations">
              Mi restaurante
            </Link>
          </li>
        )
      }else{
        return (
          <li>
            <Link className="link-navbar allRestaurant" to="../allRestaurant">
              Restaurantes
            </Link>
          </li>
        )
      }
    }
  }

  const renderUser = () => {
    if (dataUser.admin !== undefined){
      // if (dataUser.admin == 1 && dataUser.superAdmin == 0){
      //   return (
      //     <li>
      //       <Link className="link-navbar" to="../users">
      //         Usuarios
      //       </Link>
      //     </li>
      //   )
      // }else{
        if (dataUser.admin == 1 && dataUser.superAdmin == 1 ){
          return (
            <li>
              <Link className="link-navbar SuperAdminUser" to="../SuperAdminUser">
                Usuarios
              </Link>
            </li>
          )
        }else{
          return (null);
        }
      // }
    }
  }

  const selectStyle = () => {
    let localtion = window.location.href.split("/").pop();

    let interval = setInterval(() => {
      if (document.querySelector("."+localtion)){
        document.querySelector("."+localtion).classList.add('btn-location');
        clearInterval(interval)
      }
    },800);
  }

  return (
    <nav className="nav-homepage">
      <Fade className="fade-navbar">
        <section className="section-img-user-navbar">
          <img className="logo-navbar" src={logo}/>
          Bienvenido, 
           {dataUser.nombre && dataUser.apellido
            ? " " +dataUser.nombre + " " + dataUser.apellido
            : null}
        </section>
      </Fade>
      <input type="checkbox" id="check" className="check-responsive"/>
      <section className="section-link" >
        <div className="link-nav-homepgae">
          <Fade>
            <ul>
              <li>
                <Link className="link-navbar homepage" to="../homepage"> 
                  Inicio
                </Link>
              </li>
              {renderUser()}      
              {renderSuperAdmin()}     
              {selectStyle()}
            </ul>
          </Fade>
        </div>
        <div className="log-out-nav-homepage">
          <button
            className="btn-log-out"
            type="button"
            onClick={() => {
              localStorage.clear();
              dispatch(deleteHome([]));
              window.location.href = "../login";
            }}
          >
            Cerrar sesion
          </button>
        </div>
      </section>
      <div className="div-hamburguer-responsive">
        <Fade className="fade-hamburger-responsive">
            <label htmlFor="check">
              <RxHamburgerMenu className="icon-hamburger-responsive"/>
          </label>
        </Fade>
      </div>
    </nav>
  );
}

export default Navbar;
