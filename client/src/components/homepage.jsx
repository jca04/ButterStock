import React, { useEffect, useState } from "react";
import style from "../public/css/homepageStyle.module.css";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';

//components
import Navbar from "./reuseComponents/navbar";
import Entradas from "./Entradas";
import Salidas from "./component/salidas";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

//Apis
import { getRestaurant } from "../api/restaurant";
import { removeToken } from "../auth/auth";

//icons
import { MdOutlineSell } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineCloseCircle } from 'react-icons/ai';

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
                <button className={style.btnCompras} onClick={() => setModalEntradas(true)}><CiShoppingCart className={style.icons}/> Compras</button>
                <button className={style.btnVentas} onClick={() => setModalSalidas(true)}><MdOutlineSell className={style.icons}/> Ventas</button>
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
        <Dialog
         open={modalEntradas}
         className={style.modalEntradas}
        >
        <button className={style.btnModalEntradas} onClick={() => setModalEntradas(false)}><AiOutlineCloseCircle/></button>
          <DialogContent>
            <Entradas id_restaurant = {btoa(id_restaurant)} />
          </DialogContent>
        </Dialog>
      ) : null}


      {modalSalida ? ( 
        <Dialog
          open={modalSalida}
          className={style.modalEntradas}
        >
          <button className={style.btnModalEntradas} onClick={() => setModalSalidas(false)}><AiOutlineCloseCircle/></button>
          <DialogContent>
            <Salidas id_restaurant = {btoa(id_restaurant)} />
          </DialogContent>
        </Dialog>
    ) : null}
    </div>
  );
}

export default HomePage;