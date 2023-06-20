import React, { useState, useEffect } from "react";
import { Form, Formik, Field } from "formik";
import { createRestaurant, verifiedRestaurant } from "../api/restaurant.js";
import { createUser } from "../api/users.js";
import "../public/css/createRestaurantStyle.css";
import logo from "../public/resources/logo/logo_versaStock.png";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function FormRestaurant() {
    useEffect(() => {
        document.title = "pymeStorage | Crear restaurante";
    }, []);

    const navigate = useNavigate();
    const [form, setForm] = useState(0);
    const [titleForm, setTitleForm] = useState("Registro restaurante");
    const [fileState, setFile] = useState(null);
    const [saveRestarunt, setSaveRestaurant] = useState({});
    const [isLoading, setLoafing] = useState(false);

    const showToastMessageSucces = () => {
        toast.success("El restaurante se ha creado con exito !", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 500,
        });
    };

    const showToastMessageWarn = () => {
        toast.warn("Este restaurante ya existe !", {
            position: toast.POSITION.TOP_CENTER,
        });
    };

    const showToastMessageA = () => {
        toast.error("Ha ocurrido un error, por favor vuelva a intentar !", {
            position: toast.POSITION.TOP_CENTER,
        });
    };

    const loadingPage = () => {
        setTimeout(() => {
            setLoafing(false);
        }, 1500);

        return (
            <div className="div-loading">
                <div>
                    <AiOutlineLoading3Quarters className="img-load" />{" "}
                    Verificando
                </div>
            </div>
        );
    };

    const validateLength = (value, name) => {
        let error = "";

        if (value.length !== undefined) {
            if (value.length == 0) {
                return (error = "*Este campo es requerido");
            } else if (value.length == 100) {
                return (error = "*Este campo es demasiado grande");
            }
        }
    };

    const validateCorreo = (value) => {
        let error = "";

        if (value.length !== undefined) {
            if (value.length < 0) {
                return (error = "*Este campo es requerido");
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
            ) {
                return (error = "*Direccion de correo invalida");
            }
        }
    };

    const obtener = () => {
        //aqui el formulario esta en crear restaurante
        if (form == 0) {
            return (
                <section className="child child1">
                    <Formik
                        initialValues={{
                            restaurant: "",
                            ciudad: "",
                            direccion: "",
                            image: fileState,
                        }}
                        // enableReinitialize={true}
                        onSubmit={async (values, actions) => {
                            // //Agregar el formData a una variable global para que este se envie al final

                            try {
                                //consultar si ya existe el restaurante
                                const response = await verifiedRestaurant(
                                    values.restaurant
                                );
                                if (response.data !== undefined) {
                                    const resData = response.data.messgae;
                                    //si ya existe el restaurante
                                    if (resData === "restaurant exist yet") {
                                        showToastMessageWarn();
                                        //sino existe el restaurante
                                    } else if (
                                        resData === "restaurant doesn´t exist"
                                    ) {
                                        setSaveRestaurant(values);
                                        setLoafing(true);
                                        actions.resetForm();
                                        setForm(1);
                                        setTitleForm("Crear usuario Admin");
                                    }
                                } else {
                                    //si ocurre algun error;
                                    showToastMessageA();
                                }

                                actions.resetForm();
                            } catch (err) {
                                console.log(err);
                            }
                        }}
                    >
                        {({
                            handleSubmit,
                            values,
                            touched,
                            isSubmitting,
                            errors,
                        }) => (
                            <Form
                                onSubmit={handleSubmit}
                                className="form"
                                encType="multipart/form-data"
                            >
                                <div className="div-input">
                                    <label htmlFor="restaurant">
                                        Nombre restaurante
                                    </label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite el nombre del restaurante"
                                        name="restaurant"
                                        validate={validateLength}
                                        style={
                                            errors.restaurant &&
                                            touched.restaurant && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.restaurant &&
                                            touched.restaurant && (
                                                <p className="error">
                                                    {errors.restaurant}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="div-input">
                                    <label htmlFor="ciudad">Ciudad</label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite el nombre de la ciudad"
                                        name="ciudad"
                                        validate={validateLength}
                                        style={
                                            errors.ciudad &&
                                            touched.ciudad && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.ciudad && touched.ciudad && (
                                            <p className="error">
                                                {errors.ciudad}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="div-input">
                                    <label htmlFor="direccion">Direccion</label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite la direccion del restaurante"
                                        name="direccion"
                                        validate={validateLength}
                                        style={
                                            errors.direccion &&
                                            touched.direccion && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.direccion &&
                                            touched.direccion && (
                                                <p className="error">
                                                    {errors.direccion}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="div-input">
                                    <label htmlFor="image">
                                        Icono restaurante
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setFile(e.target.files[0])
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-save-login"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <AiOutlineLoading3Quarters />
                                    ) : (
                                        "Enviar"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </section>
            );
        } else {
            //aqui esta en crear usuario por el restaurante
            return (
                <section className="child child1">
                    <Formik
                        enableReinitialize
                        initialValues={{
                            nombreUser: "",
                            apellidoUser: "",
                            correoUser: "",
                            contraseña: "",
                        }}
                        onSubmit={async (values, actions) => {
                            // enviar todos los datos
                            const FormRestaurant = new FormData();
                            FormRestaurant.append(
                                "restaurant",
                                saveRestarunt.restaurant
                            );
                            FormRestaurant.append(
                                "ciudad",
                                saveRestarunt.ciudad
                            );
                            FormRestaurant.append(
                                "direccion",
                                saveRestarunt.direccion
                            );
                            FormRestaurant.append("image", fileState);

                            try {
                                const response = await createRestaurant(
                                    FormRestaurant
                                );
                                if (response.data !== undefined) {
                                    //obtenemos el id para poder crear el usuario segun este id
                                    let idResponse = response.data.messgae;
                                    values.idRestaurant = idResponse;
                                    const responseUser = await createUser(
                                        values
                                    );
                                    if (responseUser.data !== undefined) {
                                        showToastMessageSucces();

                                        setTimeout(() => {
                                            navigate("/login");
                                        }, 1000);
                                    } else {
                                        showToastMessageA();
                                    }
                                }
                            } catch (err) {
                                showToastMessageA();
                            }
                        }}
                    >
                        {({
                            handleSubmit,
                            values,
                            touched,
                            isSubmitting,
                            errors,
                        }) => (
                            <Form onSubmit={handleSubmit} className="form">
                                <div className="div-input">
                                    <label htmlFor="nombreUser">Nombre</label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite el nombre"
                                        name="nombreUser"
                                        validate={validateLength}
                                        style={
                                            errors.nombreUser &&
                                            touched.nombreUser && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.nombreUser &&
                                            touched.nombreUser && (
                                                <p className="error">
                                                    {errors.nombreUser}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="div-input">
                                    <label htmlFor="apellidoUser">
                                        apellido
                                    </label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite el apellido"
                                        name="apellidoUser"
                                        validate={validateLength}
                                        style={
                                            errors.apellidoUser &&
                                            touched.apellidoUser && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.apellidoUser &&
                                            touched.apellidoUser && (
                                                <p className="error">
                                                    {errors.apellidoUser}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="div-input">
                                    <label htmlFor="correoUser">Correo</label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite el correo"
                                        name="correoUser"
                                        validate={validateCorreo}
                                        style={
                                            errors.correoUser &&
                                            touched.correoUser && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.correoUser &&
                                            touched.correoUser && (
                                                <p className="error">
                                                    {errors.correoUser}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="div-input">
                                    <label htmlFor="Contraseña">
                                        Contraseña
                                    </label>
                                    <Field
                                        className="form-input "
                                        placeholder="Digite la contraseña"
                                        name="contraseña"
                                        type="password"
                                        validate={validateLength}
                                        style={
                                            errors.contraseña &&
                                            touched.contraseña && {
                                                border: "1px solid red",
                                            }
                                        }
                                    />
                                    <div>
                                        {errors.contraseña &&
                                            touched.contraseña && (
                                                <p className="error">
                                                    {errors.contraseña}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn-save-login"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <AiOutlineLoading3Quarters />
                                    ) : (
                                        "Enviar"
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </section>
            );
        }
    };

    return (
        <div className="parent">
            <section className="child child2">
                {isLoading ? loadingPage() : null}
                <div className="header">
                    <img className="img-logo" src={logo} />
                    <h2>{titleForm}</h2>
                </div>
                <div className="body">{obtener()}</div>
            </section>
        </div>
    );
}

export default FormRestaurant;
