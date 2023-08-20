import React, { useEffect, useState } from "react";
import "../public/css/showRespieStyle.css";

import { getResipes, getIngredient,saveEditRespie } from "../api/resipe";
import Navbar from "./reuseComponents/navbar";
import { useParams } from "react-router-dom";
import {AiOutlineSearch, AiOutlineCloseCircle, AiOutlineLoading3Quarters} from "react-icons/ai";
import {BiImageAdd} from 'react-icons/bi';
import { BiAddToQueue } from "react-icons/bi";
import { Field, Form, Formik } from "formik";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function ShowRespie() {
  //localState
  const [stateResipe, setResipes] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [isContinue, setContinue] = useState(false);
  const [activeModal, setModal] = useState(null);
  const [ingredientSelect, setInSelect] = useState([]);
  const [tipoPlato, setTipoPlato] = useState({});
  const [dataRespiSel, setRespiSelet] = useState([]);
  const [respiseFormated, setRFormta] = useState([]);
  const [errorselet, setErro] = useState(null);
  const dataTipoPlato = [{"label": "Plato", "value": "Plato"},{"label": "Bebida", "value": "Bebida"},{"label": "Postre", "value": "Postre"},{"label": "Otro", "value": "Otro"}];
  let contador = 0;
  const { id } = useParams();
  //Loacl variables-

  useEffect(() => {
    document.title = "Recetas";
    //consulta de todas las recetas
    let getResipesPerRestaurant = async () => {
      const response = await getResipes(id);
      console.log(response)
      try {
        if (Array.isArray(response)) {
          if (response.length > 0) {
           let arr = [];
            //formatear las recetas para meterlas en un array y que este datos vaya a un select
            for (var i in response){
              arr.push({"label": response[i].nombre_receta, "value": response[i].id_receta});
            }
            setRFormta(arr);
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
    const response = await getIngredient(id);
    try {
      if (Array.isArray(response)) {
        setIngredient(response);
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



  const validateTxt = (values) => {
    let error = "";
    if (values.length == 0 ){
      error = "*El campo debe ser llenado";
    }else if (values.length > 100){
      error = "*El campo debe tener minimo 60 caracteres";
    }
    return error;
  }

  const validateTxtarea = (values) => {
    let error = "";
    if (values.length == 0 ){
      error = "*El campo debe ser llenado";
    }else if (values.length > 400){
      error = "*El campo debe tener minimo 400 caracteres";
    }
    return error;
  }

  const mapResipe = () => {
    return stateResipe.map((row) => {
      let imagen;
      if (row.imagen){
        imagen = <img  className="img-respie" src={`http://localhost:5173/src/public/uploads/${row.imagen}`}/>;
      }else if (row.tipo_receta === 'plato'){
        imagen = "plaot";
      }else if (row.tipo_receta === 'bebida'){
        imagen = "bebida";
      }else if (row.tipo_receta === 'postre'){
        imagen = "postre";
      }

      contador++;

      return (
        <div className={`box-respie ${contador > 3 ? "box-resise-up" : "" }`} key={row.id_receta} onClick={(e) => {setModal(row)}}>
          <div className="title-box">
            {row.nombre_receta ? row.nombre_receta : "N/A"}
          </div>
          <div className="img-box">{imagen}</div>
          <div className="btn-box"></div>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />
      <section className="title-page">
        <h2>Recetas</h2>
      </section>
      <section className="create-respie">
        <button onClick={() => {setModal({})}}>
          Agregar nueva receta <BiAddToQueue />
        </button>
      </section>
      <section className="respie-father">
        {/* Recetas  */}
        <section className="respie">
          <div className="title-respie">
            <h2>Lista de Recetas</h2>
          </div>
          <div className="search-respie">
            <div>
              <input
                type="text"
                className="search"
                placeholder="Buscar Receta"
              />
              <span>
                <AiOutlineSearch />
              </span>
            </div>
          </div>
          {/* Data recetas */}
          <div className="data-respie">
            {mapResipe()}
          </div>
        </section>
        {/* Sub-recetas */}
        <section className="sub-respie">
          <section className="sub-respie">
            <div className="sub-title-respie">
              <h2>Lista de Sub-Recetas</h2>
            </div>
            <div className="sub-search-respie">
              <div>
                <input
                  type="text"
                  className="search"
                  placeholder="Buscar Receta"
                />
                <span>
                  <AiOutlineSearch />
                </span>
              </div>
            </div>
            {/* Data recetas */}
            <div className="sub-data-respie">
              <div className="sub-box-respie">
                <div className="sub-title-box"></div>
                <div className="sub-img-box"></div>
                <div className="sub-btn-box"></div>
              </div>
            </div>
          </section>
        </section>
      </section>
      {/* modal para editar y crear  */}
      {/* ------------------------------ */}

      {
        activeModal ? (
          <section className="modal-respie-create">
            <section className="modal-data-respie">
              <div className="aside-respie-left">
                <div className="img-aside-respie">
                  {activeModal.imagen == undefined ? (<BiImageAdd/>) : (<img src={`http://localhost:5173/src/public/uploads/${activeModal.imagen}`}/>)}
                </div>
              </div>
              <div className="aside-respie-rigth">
                <div className="header-body">
                  <div className="close-modal-respie">
                      <button type="button" onClick={() => {setModal(null)}}>Cerrar modal <AiOutlineCloseCircle/></button>
                  </div>
                  <div className="title-modal-respie">
                    {activeModal.id_receta !== undefined ? (<h2>Editar receta</h2>) : (<h2>Crear receta o Sub-receta</h2>)}
                  </div>
                </div>
                <div className="body-respie">
                  {/* Fomrik */}
                  <Formik  
                    initialValues={{
                      cantidad_plato: activeModal.cantidad_plato !== undefined ? activeModal.cantidad_plato : 1,
                      descripcion: activeModal.descripcion !== undefined ? activeModal.descripcion : "",
                      imagen: activeModal.imagen !== undefined ? activeModal.imagen : "",
                      nombre_receta: activeModal.nombre_receta !== undefined ? activeModal.nombre_receta : "",
                      tipo_receta: activeModal.tipo_receta !== undefined ? activeModal.tipo_receta : "",
                      sub_receta : 0,
                      id_receta: activeModal.id_receta !== undefined ? activeModal.id_receta : "",
                    }}

                
                    onSubmit={async (values) => {
                     
                      try{
                        if (tipoPlato.value == undefined){
                          setErro("*Este campo es requerido");
                          return;
                        }

                        values.ingredient = ingredientSelect;
                        values.recetaPadre = dataRespiSel;
                        values.tipoPlato = tipoPlato.value;
                        values.id_restaurant = id;
                        console.log(values)
                        const response = await saveEditRespie(values); 

                        setErro(null)

                        console.log(values)
                      }catch(err){

                      }
                    }}

                  >
                    {({ handleSubmit, values, touched, isSubmitting, errors }) => (
                      <Form onSubmit={handleSubmit} className="form-respie">
                        <Field type="hidden" name="id_receta"/>
                        <div className="section-form-respie">
                          <div className="input-rows-respie">
                          <label className="label-form-respie" htmlFor="nombre_receta">Nombre de la receta</label>
                            <Field type="text" name="nombre_receta" id="nombre_receta" placeholder="Digite el nombre de la receta" validate={validateTxt}/>
                            <div className="error-respi">{errors.nombre_receta && touched.nombre_receta && ( <p className="error">{errors.nombre_receta}</p>)}</div>                       
                          </div>
                          <div className="input-rows-respie">
                            <label htmlFor="cantidad_plato">Cantidad del plato</label>
                            <Field type="number" name="cantidad_plato" id="cantidad_plato" placeholder="Digite la cantidad del plato"/>
                            <div className="error-respi"></div>    
                         </div>
                        </div>
                        <div className="section-form-colum">  
                          <label htmlFor="descripcion">Descripcion de la receta</label>
                          <Field component="textarea" rows="2" validate={validateTxtarea} placeholder="Descripcion de la receta" className="textarea-respie" type="textarea" id="descripcion" name="descripcion"/>
                          <div className="error-respi">{errors.descripcion && touched.descripcion && ( <p className="error">{errors.descripcion}</p>)}</div>    
                        </div>
                        {/* Select multiple */}
                        <div className="section-form-colum">  
                          <label htmlFor="ingredient">Ingredientes</label>
                          {/* Select multiple libreria react select */}
                            <Select onChange={(e) => {setInSelect(e);}}
                              closeMenuOnSelect={false}
                              isMulti
                              options={ingredient}
                              placeholder="Seleccione los ingredientes para crear la receta"
                          />
                           <div className="error-respi"></div>   
                        </div>
                        {/* select normal para tipo de plato */}
                        <div className="section-form-colum">  
                          <label htmlFor="tipo_plato">Tipo de Receta</label>
                          {/* Select normal para tipo de plato */}
                          <Select id="tipo_plato" onChange={(e) => {setTipoPlato(e) }}
                              closeMenuOnSelect={true}                
                              options={dataTipoPlato}
                              placeholder="Seleccione el tipo de plato"
                          />
                           <div className="error-respi">{errorselet ? (<p className="error">{errorselet}</p>)  : null}</div>   
                        </div>
                        <div className="section-form-colum">  
                          <label htmlFor="Sub-receta">La receta es sub</label>
                          {/* Select normal para tipo de plato */}
                          <Select id="tipo_plato" onChange={(e) => {setRespiSelet(e)}}
                              closeMenuOnSelect={false}
                              isMulti                
                              options={respiseFormated}
                              placeholder="Seleccione las recetas que necesitan de esta receta para hacerse"
                          />
                           <div className="error-respi"></div>   
                        </div>
                        <div className="section-form-colum-btn">  
                            <button type="submit" disabled={isSubmitting}>{isSubmitting ? (
                              <AiOutlineLoading3Quarters/>
                           ) : (
                        
                        "Enviar"
                      )}</button>                    
                        </div>
                      </Form>
                   )}
                  </Formik>
                </div>
              </div>
            </section>
          </section>
        ) : null
      }
    </>
  );
}

export default ShowRespie;
