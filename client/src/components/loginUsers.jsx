import React from "react";
import { validateUser } from "../api/users.js";
import { Field, Form, Formik } from "formik";
import  "../public/css/loginUserStyle.css";
import logo from "../public/resources/logo/logo_versaStock.png";


function LogginUser() {

  // const history = useHistory();


  //validar el campo del correo para el login del usuario

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
    if (!values) {
      error = "Este campo es requerido";
    }
    return error;
    
  };

  const getStyle = (val, filed) => {
    if (val[filed]){
      return {
        border: "1px solid red",
        color: "red"
      }
    }
  }

  return (
    <section className="parent">
      <section className="child">
        <div className="header">
          <img className="img-logo" src={logo} />
          <h2>Inicie sesion con la cuenta de versaStock</h2>
        </div>
        <div className="body">
          <Formik
            initialValues={{
              user: "",
              pass: "",
            }}
            // enableReinitialize={true}
<<<<<<< HEAD
            onSubmit={(values, {setSubmitting}) => {
              setSubmitting(true);
              setTimeout( async () => {
                  setSubmitting(false);
                  const respos = await validateUser(values);
                  console.log(respos);
                  if (respos.status === 200) window.location.href = "/createRestaurant";
                  else alert("Usuario o contraseña incorrectos");
              },500);
=======
            onSubmit={async (values, {setSubmitting}) => {
              const respos = await  validateUser(values);
              console.log(respos)
>>>>>>> f67abbf45797867776c920a69268d32b81accf19

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
                    style={getStyle(errors, "user")}
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
                    style={getStyle(errors, "pass")}
                  />
                  <div>{errors.pass  && <p className="error">{errors.pass}</p>}</div>
                </div>
<<<<<<< HEAD
                <button type="submit" className="btn-save-login" disabled={isSubmitting} >
                  {isSubmitting ?  <img className="img-load" src="/src/public/resources/icons/loading-svgrepo-com.svg"/>: "Iniciar sesion" }
=======
                <button type="submit" className="btn-save-login" disabled={isSubmitting}>
                  {isSubmitting ? <img className="img-load" src="/src/public/resources/icons/loading-svgrepo-com.svg"/>: "Iniciar sesion" }
>>>>>>> f67abbf45797867776c920a69268d32b81accf19
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
