import React, { useEffect, useState } from "react";
import "../public/css/showRespieStyle.css";
import { Slide } from "react-awesome-reveal";
import { getResipes, getIngredient } from "../api/resipe";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./reuseComponents/navbar";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSearch,
  AiOutlineArrowRight,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import DataTable from "react-data-table-component";
import { Form, Formik, Field } from "formik";

function ShowRespie() {
  //localState
  const [stateResipe, setResipes] = useState([]);
  const [stateActive, setActice] = useState(true);
  const [stateEditCreate, setCreateEdir] = useState(false);
  const [stateDataEdit, setEdit] = useState({});
  const [isContinue, setContinue] = useState(false);
  //Loacl variables-
  let columns = [
    {
      name: "nombre ingrediente",
      selector: (row) => row.nombre_ingrediente
    },
    {
      name: "Unidad de medidad",
      selector: (row) => row.unidad_medida
    },
    {
      name: "cantidad total",
      selector: (row) => row.cantidad_total_ingrediente
    },
    {
      name: "costo unitario",
      selector: (row) => row.costo_unitario
    },
    {
      name: "porcentajeparticipacion",
      selector: (row) => row.porcentaje_participacion
    },

  ];


  useEffect(() => {
    document.title = "Recetas";
    //consulta de todas las recetas
    let getResipesPerRestaurant = async () => {
      const response = await getResipes();
      try {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            setResipes(response);
          } else {
            setResipes(response);
          }

          getIngredients(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getResipesPerRestaurant();
  }, []);

  let getIngredients = async (data) => {
    const response = await getIngredient();
    try {
      if (Array.isArray(response)) {
        let dataIngredient = response;
        let newData = data.filter((val, index) => {
          let ingredient = [];
          dataIngredient.filter((value) => {
            if (value.id_receta == val.id_receta) {
              ingredient.push(value);
            }
          });

          return (val.ingredient = ingredient);
        });

        setContinue(true);
        setResipes(newData);
      }
    } catch (error) {}
  };

  const mapResipe = (data) => {
    if (data.length > 0) {
      return data.map((item) => {
        if (stateActive) {
          if (item.activo == 1) {
            return (
              <div className="body-show-respie" key={item.id_receta}>
                <div className="data-show-respie">
                  <div className="actions-show-respie">
                    <div className="txtResipe">{item.nombre_receta}</div>
                    <div className="section-btn">
                      <AiOutlineEdit
                        className="btn-actions-show-respie first"
                        onClick={() => {
                          setCreateEdir(true);
                          setEdit(item);
                        }}
                      />
                      <AiOutlineDelete className="btn-actions-show-respie" />
                    </div>
                  </div>
                  <div>
                    <img
                      className="img-show-respie"
                      src={
                        "http://localhost:5173/src/public/uploads/" +
                        item.imagen +
                        ""
                      }
                    />
                  </div>
                  <div>
                    Mas info <AiOutlineArrowRight />
                  </div>
                </div>
                <div className="ingredients-per-respie">
                  { item.ingredient.length != undefined && item.ingredient.length > 0   ? (
                    <DataTable
                      columns={columns}
                      data={
                        item.ingredient
                      }
                      pagination
                      responsive
                      expandOnRowClicked
                      expandableRows
                      highlightOnHover
                      pointerOnHover
                      subHeader
                      // subHeaderComponent={subHeaderComponent}
                      // progressPending={pending}
                      // expandableRowExpanded={(row) => row === currentRow}
                      // expandableRowsComponent={(row) =>
                      //   expandableComponent(row)
                      // }
                      // onRowClicked={onRowClicked}
                    />
                  ) : (
                    <h1>No tiene</h1>
                  )}
                </div>
              </div>
            );
          }
        }
      });
    }
  };

  return (
    <>
      <Navbar />
      {/* parte para editar y crear una receta */}
      {stateEditCreate ? (
        <Slide className="edit-show-respie" direction="up" duration="500">
          <section className="edit-show-respie-s">
            <div className="header-edit-respie">
              <h4>Editar/Crear Receta</h4>
            </div>
            <div className="header2-edit-respie">
              <div className="img-edit-respie">
                <img
                  src={
                    "http://localhost:5173/src/public/uploads/" +
                    stateDataEdit.imagen +
                    ""
                  }
                />
              </div>
            </div>
            <div className="body-form-edit-respie">
              <Formik
                initialValues={stateDataEdit}
                // enableReinitialize={true}
                onSubmit={async (values) => {
                  console.log(values);
                }}
              >
                {({ handleSubmit, values, touched, isSubmitting, errors }) => (
                  <Form className="form-respie">
                    <div className="div-input-respie">
                      <label
                        htmlFor="nombre_receta"
                        className="label-show-respie"
                      >
                        Nombre Receta
                      </label>
                      <Field
                        className="input-respie"
                        placeholder="Nombre de la receta"
                        name="nombre_receta"
                        type="text"
                        // validate={validateLength}
                        style={
                          errors.nombre_receta &&
                          touched.nombre_receta && {
                            border: "1px solid red",
                          }
                        }
                      />
                      <div>
                        {errors.nombre_receta && touched.nombre_receta && (
                          <p className="error">{errors.nombre_receta}</p>
                        )}
                      </div>
                    </div>
                    <div className="div-input-respie">
                      <label
                        htmlFor="descripcion"
                        className="label-show-respie"
                      >
                        Descripcion de la receta
                      </label>
                      <Field
                        type="textarea"
                        className="textarea-respie"
                        placeholder="Descripcion"
                        name="descripcion"
                        // validate={validateLength}
                        style={
                          errors.descripcion &&
                          touched.descripcion && {
                            border: "1px solid red",
                          }
                        }
                      />
                      <div>
                        {errors.descripcion && touched.descripcion && (
                          <p className="error">{errors.descripcion}</p>
                        )}
                      </div>
                    </div>
                    <div className="div-input-respie">
                      <label
                        htmlFor="cantidad_plato"
                        className="label-show-respie"
                      >
                        Cantidad plato
                      </label>
                      <Field
                        className="input-respie"
                        placeholder="cantidad por plato"
                        name="cantidad_plato"
                        type="number"
                        // validate={validateLength}
                        style={
                          errors.cantidad_plato &&
                          touched.cantidad_plato && {
                            border: "1px solid red",
                          }
                        }
                      />
                      <div>
                        {errors.cantidad_plato && touched.cantidad_plato && (
                          <p className="error">{errors.cantidad_plato}</p>
                        )}
                      </div>
                    </div>
                    <div className="footer-send-respie">
                      <button type="submit">Enviar</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </section>
        </Slide>
      ) : null}

      {/* Seccion para el tratamiento y vista de todas las recetas */}

      
      <section className="section-show-respie">
      {!isContinue ? (
        <div className="loding-resipe">
          <AiOutlineLoading3Quarters/>
          <p>Cargando</p>
        </div>
        ) 
        :
        (
          <>
            <header className="header-show-respie">
              <h2 className="txt-respies">Lista de recetas</h2>
            </header>
            <div className="txt-search-respie">
              <div className="elem-searh-respie">
                <span className="span-search-respie">
                  <AiOutlineSearch />
                </span>
                <input
                  className="txt-search-respie-s"
                  type="text"
                  placeholder="buscar"
                />
              </div>  
            </div>
            <div className="container-body-respie">
              {isContinue ? mapResipe(stateResipe) : null}
            </div>
            <footer></footer>
          </>
        )}
      </section>
    </>
  );
}

export default ShowRespie;
