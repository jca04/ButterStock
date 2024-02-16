import React, { useEffect, useState } from "react";
import { AxioInterceptor } from "../../auth/auth";
import { Link } from "react-router-dom";
import { getUser } from "../../api/navbar.js";
import {useDispatch, useSelector} from 'react-redux'
import {addHome, deleteHome} from "../../features/homepage/homepageSlice";
import logo from "../../public/resources/logo/logo_blanco.png";

//styles
import style from "../../public/css/navbarStyle.module.css";

//import components
import Entradas from "../Entradas.jsx";
import Salidas from "./../component/salidas.jsx";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

//react icon
import { CiHome } from "react-icons/ci";
import { GrConfigure } from "react-icons/gr";
import { TiBusinessCard } from "react-icons/ti";
import { MdOutlineCallToAction } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaClipboardListSolid } from "react-icons/lia";
import { LuChefHat } from "react-icons/lu";
import { CiShoppingCart } from "react-icons/ci";
import { MdOutlineSell } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { MdAttachMoney } from "react-icons/md";
import { AiOutlineCloseCircle } from 'react-icons/ai';

//material ui accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

AxioInterceptor();

function Navbar({restaurant}) {
  //se utiliza para editar el estdao glboal del usuario
  const dispatch = useDispatch();
  //estado global trayendo los datos
  let homeSlice = useSelector(state => state.home);
  let to_64 = btoa(restaurant);
  const [dataUser, setDataUser] = useState({});
  const [modalEntradas, setModalEntradas] = useState(false);
  const [modalSalidas, setModalSalidas] = useState(false);

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
          <Link className={style.linkNavbar} to={`../configurations/${to_64}`} >
            <li className={style.liNavbar}>
              <GrConfigure className={style.iconStrokeMin}/>
              <span> Mi negocio</span>
            </li>
          </Link>
        )
      }else{
        return (
          <Link className={style.linkNavbar} to="../allRestaurant">
            <li className={style.liNavbar}>
              <TiBusinessCard className={style.iconStrokeMin}/>
              <span> Negocios</span>
            </li>
          </Link>
        )
      }
    }
  }

  const renderUser = () => {
    if (dataUser.admin !== undefined){
        if (dataUser.admin == 1 && dataUser.superAdmin == 1 ){
          return (
            <Link className={style.linkNavbar} to="../SuperAdminUser">
              <li>
                <TiBusinessCard  className={style.iconStrokeMin}/>
                <span> Usuarios</span>
              </li>
            </Link>
          )
        }else{
          return (null);
        }
    }
  }

  const logout = () => {
    localStorage.clear();
    dispatch(deleteHome([]));

    try {
      const url = window.location.href;
      const arrayUrl = url.split('/');
      const urlLogOut = arrayUrl[0] + '//' + arrayUrl[2] + '/login';
      window.location.href = urlLogOut;
    } catch (error) {
        window.location.href = "../login";
    }
  }

  const loadSigl = () => {
    let user = dataUser.nombre + ' ' + dataUser.apellido
    let firstSigl = dataUser.nombre[0].toUpperCase();
    let secondSigl = dataUser.apellido[0].toUpperCase();

    return (
      <div className={style.userInfo}>
        <div className={style.chart}>
          <span>{firstSigl}{secondSigl}</span>
        </div>
        <div className={style.welcome}>
          <div className={style.welcomeMin}>
            Bienvenido
          </div>
          <div>{user}</div>
        </div>
      </div>
    )
  }

  return (
  <>
    <nav className={style.navContainer}>
        <section className={style.sectionImgUserNavbar}>
          <img className={style.logoNavbar} src={logo}/>
           {dataUser.nombre && dataUser.apellido
            ?  loadSigl()
            : 'Cargando...'}
        </section>
      <section className={style.sectionLinks}>
        <div className={style.linkNav}>
        {/* home */}
          <ul>
            <Link className={style.linkNavbar} to="../homepage"> 
              <li className={style.liNavbar}>
                <CiHome className={` ${style.icon} ${style.iconStrokeMin} `}/>
                <span>Inicio</span>
              </li>
            </Link>
            {renderUser()}      
            {renderSuperAdmin()}     
          </ul>
          {/* comandas */}
          <ul>
              <Accordion id={style.panel1aHeader}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography className={style.typography}>
                    <MdOutlineCallToAction className={` ${style.icon} ${style.iconStrokeMin} `}/><span>Comandas</span> 
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={style.AccordionDetails}>
                  <button type="button" 
                   className={style.btnComanda} 
                   onClick={() => setModalEntradas(true)}>
                    <CiShoppingCart className={style.icon} /> Compras </button>
                  <button type="button" 
                    className={style.btnComanda}
                    onClick={() => setModalSalidas(true)}>
                    <MdOutlineSell className={style.iconStrokeMin}/> Ventas
                    </button>
                </AccordionDetails>
              </Accordion>
          </ul>
          {/* ingredientes */}
          <ul>
            <Link className={style.linkNavbar} to={`/ingredients/all/${to_64}`}> 
              <li className={style.liNavbar}>
                <IoFastFoodOutline className={` ${style.icon} ${style.iconStrokeMin} `}/>
                <span>Ingredientes</span>
              </li>
            </Link>
          </ul>
          {/* Recetas */}
          <ul>
            <Link className={style.linkNavbar} to={`/Recipe_book/all/${to_64}`}> 
              <li className={style.liNavbar}>
                <LuChefHat className={` ${style.icon} `}/>
                <span>Recetario</span>
              </li>
            </Link>
          </ul>
          {/* inventario */}
          <ul>
            <Link className={style.linkNavbar} to={`/inventory/${to_64}`}> 
              <li className={style.liNavbar}>
                <LiaClipboardListSolid className={` ${style.icon} ${style.iconStrokeMin} `}/>
                <span>Inventario</span>
              </li>
            </Link>
          </ul>
          {/* estado de resultado */}
          <ul>
            <Link className={style.linkNavbar} to={`/edr/${to_64}`}> 
              <li className={style.liNavbar}>
                <MdAttachMoney className={` ${style.icon} ${style.iconStrokeMin} `}/>
                <span>Estado de resultado</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className={style.logOutNavHomepage}>
          <button
            className={style.btnLogOut}
            type="button"
            onClick={logout}
          >
          <CiLogout className={` ${style.icon} ${style.iconStrokeMin} `}/>
             Cerrar sesion
          </button>
        </div>
        <span className={style.spanProjecter}>Powered by projecters</span>
      </section>
    </nav>

    {/* Entradas */}      
    
    {modalEntradas ? (
      <Dialog
        open={modalEntradas}
        className={style.modalEntradas}
      >
        <button className={style.btnModalEntradas} onClick={() => setModalEntradas(false)}><AiOutlineCloseCircle/></button>
        <DialogContent>
          <Entradas id_restaurant = {restaurant} />
        </DialogContent>
      </Dialog>
    ) : null}

    {/*Salidas  */}

    {modalSalidas ? ( 
      <Dialog
        open={modalSalidas}
        className={style.modalEntradas}
      >
        <button className={style.btnModalEntradas} onClick={() => setModalSalidas(false)}><AiOutlineCloseCircle/></button>
        <DialogContent>
          <Salidas id_restaurant = {restaurant} />
        </DialogContent>
      </Dialog>
    ) : null}

  </>
  );
}

export default Navbar;