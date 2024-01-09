import React, { useEffect, useState } from "react";
import Navbar from "./reuseComponents/navbar";
import IconAside from "./reuseComponents/iconsAside";
import "../public/css/homepageStyle.css";
import { getRestaurant } from "../api/restaurant";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { removeToken } from "../auth/auth";
import Plot from "react-plotly.js";
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Comandas from "./Comandas";
import Load from "./reuseComponents/loadRender";
import { Avatar,List, Dialog, DialogTitle, ListItemButton, ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Salidas from "./component/salidas"; 


function HomePage() {
  const showToastMessageNo = () => {
    toast.error("Ha ocurrido un error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  document.title = "ButterStock | Inicio";

  const [id_restaurant, setIdRestaurant] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntradas, setModalEntradas] = useState(false);
  const [modalSalida, setModalSalidas] = useState(false);

  useEffect(() => {
    const fecthData = async () => {
      const response = await getRestaurant();
      try {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            setIdRestaurant(response[0].id_restaurant);
            setTimeout(() => {
              setLoading(false);
            }, 500);
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
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const closeModalEntradas = () => {
    setModalEntradas(false);
  }

  const closeModalSalidas = () => {
    setModalSalidas(false);
  }

  return (
    <div>
      <Navbar restaurant = {id_restaurant}/>
      {isLoading ? (
        <Load/>
      ) : (
        <>
        <section className="fa-ho-pa">
          <section className="bod-ho-pa">
          <section className="row-2-ho-pa">
              <div className="col-1-ho-in">
                <div className="body-col-ho-in">
                  <div className="box-ho-2" onClick={() => setModalOpen(true)}>
                    <div className="hd-ho-2">
                      Comandas
                    </div>
                    <div className="bod-ho-1">
                      <h4>Iniciar Comandas</h4>
                      <p>Añadir ventas y compras</p>
                      <div className="icon-info-bo">
                        <Tooltip title={'Aqui se añadi las compras y ventas del negocio'}>
                          <InfoIcon/>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  </div>
               </div>
               <div className="col-2-ho-in">
                  <div className="head-info-ingre">
                    Próximos a terminar
                  </div>
                  <div className="bod-info-ingre">
                      
                  </div>
               </div>
            </section>
            <section className="row-1-ho-pa">
                <div className="col-1-ho">
                  <div className="head-col-ho">
                      Tabla de Comandos
                  </div>
                  <div className="body-col-ho">
                    <Link to={`/ingredients/all/${id_restaurant}`} className="box-ho">
                      <div className="hd-ho">
                        Ingredientes
                      </div>
                      <div className="bod-ho">
                          <h4>Ver Ingredientes</h4>
                          <p>Mira, crea y edita tus Ingredientes</p>
                          <div className="icon-info-bo">
                            <Tooltip title={'Aqui se gestiona los ingredientes, se crean, se editan y se eliminan'}>
                              <InfoIcon/> 
                            </Tooltip>
                          </div>
                      </div>
                    </Link>
                    <Link to={`../respies/all/${id_restaurant}`} className="box-ho">
                        <div className="hd-ho">
                          Recetas
                        </div>
                        <div className="bod-ho">
                          <h4>Ver recetas</h4>
                          <p>Mira, crea y edita tus recetas</p>
                          <div className="icon-info-bo">
                          <Tooltip title={'Aqui se crean las recetas estandar'}>
                            <InfoIcon/>
                          </Tooltip>
                         </div>
                        </div>
                      </Link>
                      <Link to={`/inventario/${id_restaurant}`} className="box-ho">
                        <div className="hd-ho">
                          Inventario
                        </div>
                        <div className="bod-ho">
                            <h4>Ver inventario</h4>
                            <p>Registros PEPS o promedio ponderado</p>
                            <div className="icon-info-bo">
                            <Tooltip title={'Aqui se muestra registro de todo lo que ha sucedido con un ingrediente'}>
                              <InfoIcon/>
                            </Tooltip>
                            </div>
                        </div>
                      </Link>
                      <div className="box-ho">
                        <Link to={`/edr/${id_restaurant}`}>
                          <div className="hd-ho">
                            Estado de resultado
                          </div>
                          <div className="bod-ho">
                              <h4>Estado</h4>
                              <p>Informacíon sobre mi negocio</p>
                              <div className="icon-info-bo">
                                <Tooltip title={'Aqui se muestra informacion sobre el negocio, ventas etc'}>
                                  <InfoIcon/>
                                </Tooltip>
                              </div>
                          </div>
                        </Link>
                      </div>
                  </div>
                </div>
                <div className="col-2-ho graff-d">
                  <Plot
                    data={[
                      {
                        x: ["enero", "Febero", "marzo", "Abril", "Mayo"],
                        y: [12, 34, 3, 4, 1],
                        type: "bar",
                        mode: "markers",
                        marker: {
                          color: "#FFEA96",
                          line: {
                            width: 2.5,
                          },
                        },
                      },
                    ]}
                    layout={{ width: 600, height: 300, title: "Resumen del mes" }}
                    useResizeHandler
                    className="plotly"
                  />
                </div>
            </section>
          </section>
        </section>
        <Dialog onClose={closeModal} open={modalOpen}>
          <DialogTitle>Seleccionar Comanda</DialogTitle>
            <List sx={{ pt: 0 }}>
              <ListItem disableGutters key={'comEdt'}>
                <ListItemButton onClick={() => {setModalEntradas(true); closeModal()}}>
                  <ListItemAvatar>
                    <Avatar sx={{bgcolor: 'white', color: 'black' }}>
                      <ShoppingCartIcon />
                    </Avatar>
                  </ListItemAvatar>
                <ListItemText primary={'Compras'}  className="text-comand" />
              </ListItemButton>
            </ListItem>
            <ListItemButton onClick={() => {setModalSalidas(true); closeModal()}}>
                <ListItemAvatar>
                  <Avatar sx={{bgcolor: 'white', color: 'black' }}>
                  <ExitToAppIcon />
                 </Avatar>
                </ListItemAvatar>
                <ListItemText primary={'Ventas'} className="text-comand" />
              </ListItemButton>
          </List>
        </Dialog>
      <IconAside />
        </>
      )}
      {modalEntradas ? (
        <Comandas closeModal={closeModalEntradas} id_restaurant = {id_restaurant} />
      ): null
      }
      {modalSalida ? (
          <Salidas closeModal={closeModalSalidas} id_restaurant={id_restaurant} />
      ): null}
    </div>
  );
}

export default HomePage;
