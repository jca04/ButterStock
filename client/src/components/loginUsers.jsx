import React from "react";
import {validateUser} from '../api/users.js'
import { Form, Formik } from "formik";
import "../public/css/loginUserStyle.css";

function LogginUser() {
  return (
    <section className="parent">
      <section className="child">
        <div className="header">
          <h2>Login</h2>
        </div>
        <div className="body">
          <Formik
            // initialValues={task}
            // enableReinitialize={true}
            onSubmit={async (values, actions) => {
              const respos = await validateUser();
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <label for="user">Usuario</label>
                <input type="text" placeholder="ingrese el usuario/correo" name="user"/>
                <label for="pass">Contraseña</label>
                <input type="password" placeholder="ingrese la contraseña" name="pass"/>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando" : "Guardar"}
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
