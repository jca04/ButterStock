import React, { useEffect, useState } from "react";
import Navbar from "../reuseComponents/navbar";
import { useParams } from "react-router-dom";
import { loadRestaurant } from "../../api/restaurant";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { toast } from "react-toastify";
import { Form, Formik, Field } from "formik";
import Load from "../reuseComponents/loadRender";
import '../../public/css/myRestaurantStyle.css';

function MyRestaurante(){
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const showToastMessageNo = (text) => {
    toast.error(text, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    document.title = 'ButterStock | mi negocio';

    const getData = async() => {
      const response = await loadRestaurant(id);
      if (Array.isArray(response.message)){
        setData(response.message);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }else{
        showToastMessageNo(response.message);
      }
    }

    getData();
  }, []);

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
                <h2>Mi negocio</h2>
              </section>
              <section className="body-business">
              <Formik
                initialValues={{
                  id_restaurant: data.length > 0 ? data[0].id_restaurant : "",
                  nombre: data.length > 0 ? data[0].nombre : "123213",
                  ciudad: data.length > 0 ? data[0].ciudad : "",
                  direccion: data.length > 0 ? data[0].direccion : "",
                  time_stamp: data.length > 0 ? data[0].time_stamp : ""
                
               }} onSubmit={async (values) => { }}
              >
                {({handleSubmit, touched, isSubmitting, errors, values}) => (
                  <Form >
                    <input type="text" placeholder="id negocio" name="id_restaurant" id="id_restaurant"/>
                    <input type="text" placeholder="Nombre del negocio"  name="nombre"/>
                    <input type="text" placeholder="Ciudad" name="ciudad"/>
                    <input type="text" placeholder="Direccion" name="direccion"/>
                    <input type="text" placeholder="Fecha de creacion" name="time_stamp"/>
                  </Form>
                )}
              </Formik>
            </section>
            </>
          ) : (null)}
            
          </section>
        </Box>
      </Container>
      ) : (<Load/>)}
      
    </>
  )
}
 

export default MyRestaurante;