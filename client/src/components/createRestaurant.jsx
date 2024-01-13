import React, { useState, useEffect } from "react";
import { Form, Formik, Field } from "formik";
import { createRestaurant} from "../api/restaurant.js";
import style from "../public/css/createRestaurantStyle.module.css";
import logo from "../public/resources/logo/logo_blanco.png";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { sendMail } from "../api/mail.js";

function FormRestaurant() {
  const [isSecondForm, setSecondForm] = useState(false);
  const [loadSecondForm, setLoadSecondForm] = useState(false);
  const [dataRestaurant, setDataRestaurant] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ButterStock | Crear restaurante";
  }, []);

  const toastSuccesApi = (text) => {
    toast.success(text,{ 
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light"
    }) 
  }

  const toasError = () => {
    toast.error('Ha ocurrido un error inesperado', {
      position: toast.POSITION.TOP_RIGHT,
    })
  }

  const validateTxt = (value) => {
    let error = "";
    if (value.length == 0) {
      error = "* Este campo es requerido";
    }

    if (value.length > 100) {
      error = "* La cantidad de caracteres debe ser menor que 100";
    }

    return error;
  };

  const validateEmail = (value) => {
    let error = "";
    if (value.length == 0){
        error = "* Este campo es requerido";
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)){
        error = "* Dirección de correo invalida";
    }

    return error;
  }

  const sendMailTo = async () => {
      const response = await sendMail('layyagami9@gmail.com','initSesion');


  }

  return (
    <section className="father-create-restaurant">
      <section className="body-create">
        {/* <button onClick={sendMailTo}>sad</button> */}
        <div className="section-form-create">
          <div className="form-create">
            {!loadSecondForm ? (
              <>
                <div className="img-form-create">
                  <img src={logo} />
                </div>
                <div className="footer-projecters">powered by projecters</div>
                <div className="title-create">
                  <h4>
                    {isSecondForm ? "Crear usuario" : "Crear restaurante"}
                  </h4>
                </div>
                <div className="form-create-data">
                  <Formik
                    initialValues={{
                      nameRestaurant: "",
                      city: "",
                      address: "",
                      nameUser: "",
                      lastName: "",
                      email: "",
                      pass: "",
                    }}
                    onSubmit={async (values) => {
                      //activar segundo formulario
                      if (!isSecondForm) {
                        setLoadSecondForm(true);
                        setSecondForm(true);
                        setDataRestaurant(values)
                        setTimeout(() => {
                          setLoadSecondForm(false);
                        }, 1000);

                        return;
                      }
                      const dataSend = {
                        nameRestaurant: dataRestaurant.nameRestaurant,
                        city: dataRestaurant.city,
                        address: dataRestaurant.address,
                        nameUser: values.nameUser,
                        lastName: values.lastName,
                        email: values.email,
                        pass: values.pass                        
                      }

                      //crear restaurante y usuario
                      try{
                        const response = await createRestaurant(dataSend);
                        if (response.message != undefined){
                            if (response.message == '!Restaurante creado'){
                                toastSuccesApi(response.message);

                                setTimeout(() => {
                                    navigate("/login");
                                },1000);
                            }else{
                                toasError();
                            }
                        }
                      }catch(error){
                        console.log(error)
                        toasError();
                      }

                    }}
                  >
                    {({
                      handleSubmit,
                      touched,
                      isSubmitting,
                      errors,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        {!isSecondForm ? (
                          <>
                            {/* Parte del formulario que es para el restaurante  */}
                            <div className="section-input-create">
                              <label>Nombre restaurante:</label>
                              <Field
                                className="input-create"
                                validate={validateTxt}
                                type="text"
                                name="nameRestaurant"
                                placeholder="Ingrese el nombre del restaurante"
                                style={
                                  errors.nameRestaurant &&
                                  touched.nameRestaurant && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.nameRestaurant &&
                                  touched.nameRestaurant && (
                                    <p className="error">
                                      {errors.nameRestaurant}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="section-input-create">
                              <label>Ciudad:</label>
                              <Field
                                className="input-create"
                                validate={validateTxt}
                                type="text"
                                name="city"
                                placeholder="Ingrese la ciudad"
                                style={
                                  errors.city &&
                                  touched.city && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.city && touched.city && (
                                  <p className="error">{errors.city}</p>
                                )}
                              </div>
                            </div>
                            <div className="section-input-create">
                              <label>Dirección:</label>
                              <Field
                                className="input-create"
                                validate={validateTxt}
                                type="text"
                                name="address"
                                placeholder="Dirección"
                                style={
                                  errors.address &&
                                  touched.address && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.address && touched.address && (
                                  <p className="error">{errors.address}</p>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="section-input-create">
                              {/* parte del formulario que es para el usuario */}
                              <label>Nombre:</label>
                              <Field
                                className="input-create"
                                validate={validateTxt}
                                type="text"
                                name="nameUser"
                                placeholder="Ingrese el nombre del usuario"
                                style={
                                  errors.nameUser &&
                                  touched.nameUser && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.nameUser && touched.nameUser && (
                                  <p className="error">{errors.nameUser}</p>
                                )}
                              </div>
                            </div>
                            <div className="section-input-create">
                              <label>Apellido:</label>
                              <Field
                                className="input-create"
                                validate={validateTxt}
                                type="text"
                                name="lastName"
                                placeholder="Ingrese el apellido"
                                style={
                                  errors.lastName &&
                                  touched.lastName && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.lastName && touched.lastName && (
                                  <p className="error">{errors.lastName}</p>
                                )}
                              </div>
                            </div>
                            <div className="section-input-create">
                              <label>Correo electrónico:</label>
                              <Field
                                className="input-create"
                                validate={validateEmail}
                                type="text"
                                name="email"
                                placeholder="Ingrese el apellido"
                                style={
                                  errors.email &&
                                  touched.email && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.email && touched.email && (
                                  <p className="error">{errors.email}</p>
                                )}
                              </div>
                            </div>
                            <div className="section-input-create">
                              <label>Contraseña:</label>
                              <Field
                                className="input-create"
                                validate={validateTxt}
                                type="password"
                                name="pass"
                                placeholder="Ingrese el apellido"
                                style={
                                  errors.pass &&
                                  touched.pass && {
                                    border: "1px solid red",
                                  }
                                }
                              />
                              <div className="error-create-input">
                                {errors.pass && touched.pass && (
                                  <p className="error">{errors.pass}</p>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="section-input-create">
                          <button
                            type="submit"
                            className="btn-send-create"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <AiOutlineLoading3Quarters className="load-respie-send" />
                            ) : (
                              "Enviar"
                            )}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </>
            ) : (
              <div className="load-second-form">
                <AiOutlineLoading3Quarters className="load-respie-send" />
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

export default FormRestaurant;
