import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { validateUser } from "../api/users.js";
import { Field, Form, Formik } from "formik";
import "../public/css/loginUserStyle.css";
import logo from "../public/resources/logo/logo_blanco.png";
import { toast } from "react-toastify";
import imgRoom from "../public/resources/img/room.jpeg";
import { Fade } from "react-awesome-reveal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LogginUser() {

  useEffect(() => {
    document.title = "ButterStock | login"
  }, [])

  //validar el campo del correo para el login del usuario
  //si no coinciden
  const showToastMessageNo = () => {
    toast.error("Correo y/o contraseña incorrectos", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  //cuando sucede un error inesperado
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
      error = "*Este campo es requerido";
      return error;
    }
  };

  return (
    <section className="parent">
      <section className="child child3 div-container">
        <section className="separate-m separate-1">
          <div className="div-text-img">
            <Fade delay={1e2} cascade damping={1e-1}>
              <p>BY PROJECTERS</p>
            </Fade>
            <Fade delay={1e2} cascade damping={1e-1}>
              <h1 className="text-img">ButterStock</h1>
            </Fade>
          </div>
          <img className="img-room" src={imgRoom} />
        </section>
        <section className="separate-m separate-2">
          <div className="header">
            <img className="img-logo" src={logo} />
            <p className="projecters-span">powered by projecters</p>
            <h2>Inicie sesion con la cuenta de ButterStock</h2>
          </div>
          <div className="body">
            <Formik
              initialValues={{
                user: "",
                pass: "",
              }}
              // enableReinitialize={true}
              onSubmit={async (values) => {
                try {
                  const respos = await validateUser(values);
                  if (respos.message === "continue") {
                    window.location.href = "/homepage";
                  }
                  else if (respos.message === "failed"){
                    showToastMessageNo();
                  }
                  else{
                    showToastMessageA();
                    console.log(respos.message);
                  }
                } catch (err) {
                  showToastMessageA();
                  console.log(err);
                }
              }}
            >
              {({ handleSubmit, values, touched, isSubmitting, errors }) => (
                <Form onSubmit={handleSubmit} className="form">
                  <div className="div-input">
                    <Field
                      className="form-input "
                      placeholder="Dirección de correo electrónico"
                      name="user"
                      validate={validateEmail}
                      style={
                        errors.user &&
                        touched.user && {
                          border: "1px solid red",
                        }
                      }
                    />
                    <div className="error-login">
                      {errors.user && touched.user && (
                        <p className="error">{errors.user}</p>
                      )}
                    </div>
                  </div>
                  <div className="div-input">
                    <Field
                      className="form-input"
                      type="password"
                      placeholder="Contraseña"
                      name="pass"
                      validate={validatePass}
                      autoComplete="false"
                      style={
                        errors.pass &&
                        touched.pass && {
                          border: "1px solid red",
                        }
                      }
                    />
                    <div className="error-login">
                      {errors.pass && touched.pass && (
                        <p className="error">{errors.pass}</p>
                      )}
                    </div>
                  </div>
                  <div className="div-input div-input-btn">
                    <button
                      type="submit"
                      className="btn-save-login"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <AiOutlineLoading3Quarters/>
                      ) : (
                        
                        "Iniciar sesion"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
              <p className="p-new-user">¿Eres un nuevo usuario?</p><Link className="a-new-user" to="/createRestaurant">crear cuenta</Link>
          </div>
        </section>
      </section>
    </section>
  );
}
export default LogginUser;
