import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


//components
import Navbar from "../reuseComponents/navbar";
import DataTable from "react-data-table-component";
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import { Form, Formik, Field } from "formik";
import Container from '@mui/material/Container';

//Apis
import { getuserPerRest } from "../../api/users";
import { loadRestaurant, editRestaurant } from "../../api/restaurant";
import { verifyUrl } from "../../auth/verifyUrl";

//icons
import {MdAddBusiness} from 'react-icons/md';
import {AiOutlineEdit, AiOutlineLoading3Quarters} from 'react-icons/ai';
import {HiUsers} from 'react-icons/hi';

//style
import style from '../../public/css/myRestaurantStyle.module.css';

function MyRestaurante(){
  let { id } = useParams();
  id = verifyUrl(id);

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDisabledInput, setDisabledInput] = useState(true);

  const showToastMessageNo = (text) => {
    toast.error(text, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessage = (text) => {
    toast.success(text,{
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  useEffect(() => {
    document.title = 'ButterStock | mi negocio';

    const getData = async() => {
      const response = await loadRestaurant(id);
      if (Array.isArray(response.message)){
        setData(response.message);
      }else{
        showToastMessageNo(response.message);
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);

    }
    getData();
  }, []);

  return(
    <div className={style.globalFather}>
      <Navbar restaurant = {id}/>
      {!isLoading ? (
        <section className={style.containerMyBusiness}>
          <section className={style.prebodyContainer}>
          {data.length > 0 ? (
            <>
              <header className={style.headerBusiness}>
                Mi negocio
              </header>
              <section className={style.bodyBusiness}>
              <button className={style.btnEditBusinnes} type="button" onClick={() => {
                    if (isDisabledInput) setDisabledInput(false);
                    else setDisabledInput(true);
                  }
                  }><AiOutlineEdit/>Editar</button>
              <Formik
                initialValues={{
                  id_restaurant: data.length > 0 ? data[0].id_restaurant : "",
                  nombre: data.length > 0 ? data[0].nombre : "",
                  ciudad: data.length > 0 ? data[0].ciudad : "",
                  direccion: data.length > 0 ? data[0].direccion : "",
                  time_stamp: data.length > 0 ? data[0].time_stamp : ""
                
               }} onSubmit={async (values) => {

                  const response  = await editRestaurant(values);
                  try{
                    showToastMessage(response.message);
                  }catch(err){
                    showToastMessageNo(response.message)
                  }
                }}
              >
                {({isSubmitting,}) => (
                  <Form className="form-my-business">
                    <div className="buss-row">
                      <label htmlFor="id_restaurant">Id Negocio</label>
                      <Field type="text" placeholder="id negocio" disabled={true} name="id_restaurant" id="id_restaurant"/>
                    </div>
                    <div className="buss-row">
                      <label htmlFor="nombre">Nombre</label>
                      <Field type="text" placeholder="Nombre del negocio" disabled={isDisabledInput}   name="nombre" id="nombre"/>
                    </div>
                    <div className="buss-row">
                      <label htmlFor="ciudad">Ciudad</label>
                      <Field type="text" placeholder="Ciudad" name="ciudad" disabled={isDisabledInput}  id ="ciudad"/>
                    </div>
                    <div className="buss-row">
                      <label htmlFor="direccion">Dirección</label>
                      <Field type="text" placeholder="Direccion" name="direccion" disabled={isDisabledInput}  id="direccion"/>
                    </div>
                    <div className="buss-row">
                      <label htmlFor="time_stamp">Fecha de creación</label>
                      <Field type="text" placeholder="Fecha de creacion" disabled={true}  name="time_stamp" id="time_stamp"/>
                    </div>
                    <div className={style.boxBtnSave}>
                    {!isDisabledInput ? (
                      <button type="submit" className={style.btnSaveBusiness} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <AiOutlineLoading3Quarters className="load-respie-send" />
                      ) : (
                        "Enviar"
                      )}</button>
                    ): null}
                    </div>
                  </Form>
                )}
              </Formik>
            </section>
            </>
          ) : (null)}
          </section>
      </section>
      ) : (null)}
    </div>
  )
}
 

export default MyRestaurante;