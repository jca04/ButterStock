import React, { useEffect, useState } from "react";
import style from "../public/css/homepageStyle.module.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';

//components
import Navbar from "./reuseComponents/navbar";
import Comandas from "./Comandas";
import Salidas from "./component/salidas";

//Apis
import { getRestaurant } from "../api/restaurant";
import { removeToken } from "../auth/auth";

//icons
import { MdOutlineSell } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";

function HomePage() {
  const [id_restaurant, setIdRestaurant] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntradas, setModalEntradas] = useState(false);
  const [modalSalida, setModalSalidas] = useState(false);
  const [loadNextEnds, setNextEnds] = useState(false);
  const [loadResume, setLoadResume] = useState(false);

  document.title = "ButterStock | Inicio";

  const showToastMessageNo = () => {
    toast.error("Ha ocurrido un error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    const fecthData = async () => {
      const response = await getRestaurant();
      try {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            setIdRestaurant(response[0].id_restaurant);
            setLoading(false);
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeModalEntradas = () => {
    setModalEntradas(false);
  };

  const closeModalSalidas = () => {
    setModalSalidas(false);
  };

  return (
    <div className={style.globalFather}>
      <Navbar restaurant={id_restaurant} />
      <section className={style.sectionInfoFa}>
        <header className={style.header}>Inicio</header>
        <div className={style.bodyBoxes}>
          <div className={style.comandas}>
            <div className={style.headerComanda}>
              Comandas
            </div>
            <div className={style.bodyComandas}>
              <div>
                <button className={style.btnCompras}><CiShoppingCart className={style.icons}/> Compras</button>
                <button className={style.btnVentas}><MdOutlineSell className={style.icons}/> Ventas</button>
              </div>
              <span className={style.spanComandas}>Ingresa tus compras y tus ventas</span>
            </div>
          </div>
          <div className={style.nextEnds}>
            {!loadNextEnds ? (<div className={style.loadNextEnds}> <CircularProgress color="inherit"/> </div>) : null}
          </div>
        </div>
        <div className={style.secondBodyBoxes}>
          {!loadNextEnds ? (<div className={style.loadNextEnds}> <CircularProgress color="inherit"/> </div>) : 
          (
            <div className={style.headerComanda}>
             Resumen 
            </div>
          )}
        </div>
      </section>
      {modalEntradas ? (
        <Comandas
          closeModal={closeModalEntradas}
          id_restaurant={id_restaurant}
        />
      ) : null}
      {modalSalida ? (
        <Salidas closeModal={closeModalSalidas} id_restaurant={id_restaurant} />
      ) : null}
    </div>
  );
}

export default HomePage;