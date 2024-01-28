import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { validateUser } from "../api/users.js";
import { Field, Form, Formik } from "formik";
import  styles from "../public/css/loginUserStyle.module.css";
import wave from '../public/resources/img/wave.png';
import logo from "../public/resources/logo/logo_blanco.png";
import { toast } from "react-toastify";
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
    <section className={styles.parent}>
      <aside className={styles.wave}>
        <img src={wave} />
      </aside>
      <section className={styles.divContainer}>
        <section className={`${styles.separateM} ${styles.separate1} ${styles.separtaLeft}`}>
          <div className={styles.divTextImg}>
            <Fade delay={1e2} cascade damping={1e-1}>
              <p>BY PROJECTERS</p>
            </Fade>
            <Fade delay={1e2} cascade damping={1e-1}>
              <h1 className={styles.textImg}>ButterStock</h1>
            </Fade>
          </div>
        </section>
        <section className={`${styles.separateM} ${styles.separate1}`}>
          <div className={styles.header}>
            <img className={styles.imgLogo} src={logo} />
            <p className={styles.projectersSpan}>powered by projecters</p>
            <h2>Inicie sesion con tu cuenta</h2>
          </div> 
          <div className={styles.body}>
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
                <Form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.divInput}>
                    <Field
                      className={styles.formInput}
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
                    <div className={styles.errorLogin}>
                      {errors.user && touched.user && (
                        <p className={styles.error}>{errors.user}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.divInput}>
                    <Field
                      className={styles.formInput}
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
                    <div className={styles.errorLogin}>
                      {errors.pass && touched.pass && (
                        <p className={styles.error}>{errors.pass}</p>
                      )}
                    </div>
                  </div>
                  <div className={`${styles.divInput} ${styles.divInputBtn}`}>
                    <button
                      type="submit"
                      className={styles.btnSaveLogin}
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
              <p className={styles.pNewUser}>¿Eres un nuevo usuario?</p><Link className={styles.anewuser} to="/createRestaurant">crear cuenta</Link>
          </div>
        </section>
      </section>
    </section>
  );
}
export default LogginUser;
