import React from "react";
import { validateUser } from "../api/users.js";
import { Field, Form, Formik } from "formik";
import  "../public/css/loginUserStyle.css";
import logo from "../public/resources/logo/logo_versaStock.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {coockie} from '../api/generateCoockie.js'
import { useCookies } from 'react-cookie';

function LogginUser() {
  const navigate = useNavigate();
  const  [ cookies ,  setCookie ,  removeCookie ]  =  useCookies ( [ 'cookie-name' ] ) ;
  //validar el campo del correo para el login del usuario

  const showToastMessageSucces = () => {
    toast.success("El restaurante se ha creado con exito !", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 500,
    });
  };

  const showToastMessageA = () => {
    toast.error("Ha ocurrido un error, por favor vuelva a intentar !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "*Este campo es requerido";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "*Direccion de email invalida";
    }
    return error;
  };

  //validar el campo de la contraseña
  const validatePass = (values) => {
    let error = "";
    if (values.length <= 0) {
      error = "Este campo es requerido";
      return error;
    }
    
  };


  


  return (
    <section className="parent">
      <section className="child child3">
        <div className="header">
          <img className="img-logo" src={logo} />
          <h2>Inicie sesion con la cuenta de PymeStorage</h2>
        </div>
        <div className="body">
          <Formik
            initialValues={{
              user: "",
              pass: "",
            }}
            // enableReinitialize={true}
            onSubmit={async (values) => {
              try{
                const respos = await  validateUser(values);
                if (respos.data !== undefined){
                  if (respos.data.token !== undefined){
                    let tokenSend = respos.data.token;
                    setCookie('session', tokenSend, { path: '/' });
                  }
                }
             
                navigate("/homepage")

              }catch(err){
                showToastMessageA();
                console.log(err)
              }
           

            }}
          >
            {({ handleSubmit, values, touched, isSubmitting, errors }) => (
              <Form onSubmit={handleSubmit} className="form">
                <div className="div-input">
                  <Field
                    className= "form-input "
                    placeholder="Dirección de correo electrónico"
                    name="user"
                    validate={validateEmail}
                    style={errors.user && touched.user && { border: "1px solid red" }}
                  />
                  <div>{errors.user && touched.user && <p className="error">{errors.user}</p>}</div>
                </div>
                <div className="div-input">
                  <Field
                    className="form-input"
                    type="password"
                    placeholder="Contraseña"
                    name="pass"
                    validate={validatePass}
                    autoComplete="false"
                    style={errors.pass && touched.pass && { border: "1px solid red" }}
                  />
                  <div>{errors.pass  && <p className="error">{errors.pass}</p>}</div>
                </div>
                <button type="submit" className="btn-save-login" disabled={isSubmitting}>
                  {isSubmitting ? <img className="img-load" src="/src/public/resources/icons/loading-svgrepo-com.svg"/>: "Iniciar sesion" }
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </section>
  );
}
export default LogginUser;
