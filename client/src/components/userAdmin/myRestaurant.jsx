import React, { useEffect, useState } from "react";
import Navbar from "../reuseComponents/navbar";
import { useParams } from "react-router-dom";
import { loadRestaurant, editRestaurant } from "../../api/restaurant";
import { getuserPerRest } from "../../api/users";
import {MdAddBusiness} from 'react-icons/md';
import {AiOutlineEdit, AiOutlineLoading3Quarters} from 'react-icons/ai';
import {HiUsers} from 'react-icons/hi';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { toast } from "react-toastify";
import { Form, Formik, Field } from "formik";
import DataTable from "react-data-table-component";
import Load from "../reuseComponents/loadRender";
import style from '../../public/css/myRestaurantStyle.module.css';

function MyRestaurante(){
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDisabledInput, setDisabledInput] = useState(true);
  const [users, setUsers] = useState([]);
  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
    },
    {
      name: 'Apellido',
      selector: (row) => row.apellido,
    },
    {
      name: 'Correo',
      selector: (row) => row.correo,
    }
  ]

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
        //consultar usuarios de este restaurante
        const responseUsers = await getuserPerRest(id);
        if (Array.isArray(responseUsers)){
          setUsers(responseUsers);
        }else showToastMessageNo('!Error al cargar los usuarios');

      }else{
        showToastMessageNo(response.message);
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);

    }
    getData();
  }, []);

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return(
    <>
      <Navbar restaurant = {id}/>
      {!isLoading ? (
        <Container>
        <Box className='container-my' sx={{ bgcolor: '#cfe8fc', height: '100vh' }} >
          <section className="business">
          {data.length > 0 ? (
            <>
              <section className="header-business">
                <h2><MdAddBusiness/> Mi negocio</h2>
                <div>
                  <button className="btn-edit-bus" type="button" onClick={() => {
                    if (isDisabledInput) setDisabledInput(false);
                    else setDisabledInput(true);
                  }
                  }><AiOutlineEdit/>Editar</button>
                </div>
              </section>
              <section className="body-business">
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
                    <div className="btn-send-buss">
                    {!isDisabledInput ? (
                      <button type="submit" disabled={isSubmitting}>
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
          <section className="tbl-uss-re">
            <section className="hd-uss-re">
              <h2><HiUsers/> Usuarios</h2>
            </section>
            <section className="body-uss-re">
                <DataTable
                  columns={columns}
                  data={users}
                  responsive={true}
                  pagination
                  paginationComponentOptions={paginationComponentOptions}
                  paginationPerPage={5}
                  striped
                />
            </section>
          </section>
        </Box>
      </Container>
      ) : (<Load/>)}
      
    </>
  )
}
 

export default MyRestaurante;