import React, { useEffect, useState } from "react";
import "../public/css/showRespieStyle.css";
import { getResipes, getIngredient,saveEditRespie, getResipeLimit } from "../api/resipe";
import {fileUpload} from "../app/cloudinary";
import Navbar from "./reuseComponents/navbar";
import { useParams } from "react-router-dom";
import {AiOutlineSearch, AiOutlineCloseCircle, AiOutlineLoading3Quarters} from "react-icons/ai";
import {MdOutlineNoFood, MdNoDrinks} from 'react-icons/md';
import {BiImageAdd} from 'react-icons/bi';
import { BiAddToQueue } from "react-icons/bi";
import { Field, Form, Formik } from "formik";
import Select from 'react-select';
import { toast } from "react-toastify";

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
  const [ingredientInEdit, setEditIngre] = useState([]);
  const [subRecetas, setSubRecetas] = useState([]);
  const { id } = useParams();
  const dataTipoPlato = [{"label": "Plato", "value": "Plato"},{"label": "Bebida", "value": "Bebida"},{"label": "Postre", "value": "Postre"},{"label": "Otro", "value": "Otro"}];
  let contador = 0;

  //Loacl variables-

  const showToastMessage = () => {
    toast.success("Guardado con exito", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const showToastMessageErr = () => {
    toast.error("Ha ocurrido un error", {
      position: toast.POSITION.TOP_CENTER,
    });
  };


  useEffect(() => {
    document.title = "Recetas";
    //consulta de todas las recetas
    let getResipesPerRestaurant = async () => {
      const response = await getResipes(id);
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

  //obtener ingredientes
  let getIngredients = async (data) => {
    const response = await getIngredient(id);
    try {
      if (Array.isArray(response)) {
        setIngredient(response);
        setContinue(true);
      }
    } catch (error) {
      console.log(error)
    }
  };


//validacion en los campos
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


  const editIngredients = (row) => {
    if (row.ingredientes != undefined){
      let ingredientesEdit = row.ingredientes;
      let arrNew = [];
      ingredient.filter((fill) => {
        let value = fill.value;
        ingredientesEdit.filter((fill1) => {
          if (fill1.id_ingrediente == value){
            arrNew.push({label: fill1.nombre_ingrediente, value: fill1.id_ingrediente, unidad_medida: fill1.unidad_medida_r, cantidad_total_ingrediente1: fill1.cantidad_por_receta, id_ingrediente_receta: fill1.id_ingrediente_receta, cantidad_total_ingredeinte_general: fill.cantidad_total_ingrediente
            })
          }
        })
     });

     setEditIngre(arrNew);
     setInSelect(arrNew);
     return;
    }

    setEditIngre([]);
  }

  const editSubRecetas = (row) => {
    if (row.sub_recetas != undefined){
      for (var i in row.sub_recetas){
        row.sub_recetas[i].label = row.sub_recetas[i].nombre_receta;
        row.sub_recetas[i].value = row.sub_recetas[i].id_receta;
      }
    }

  }


  //Renderizado de la recetas
  const mapResipe = (type) => {

    if (stateResipe.length > 0){
      return stateResipe.map((row) => {
        let imagen;
        if (row.imagen){
          imagen = <img className="img-respie" src={`${row.imagen}`}/>;
        }else if (row.tipo_receta === 'Plato'){
          imagen = <MdOutlineNoFood/>;
        }else if (row.tipo_receta === 'Bebida'){
          imagen = <MdNoDrinks/>;
        }else if (row.tipo_receta === 'Postre'){
          imagen = "postre";
        }else{
          imagen = "otro";
        }
  
        contador++;
  
        if (type == 0){
          //recetas
          if (row.sub_receta == 0){
            return (
             <div className={`box-respie ${contador > 3 ? "box-resise-up" : "" }`} key={row.id_receta} onClick={(e) => {setModal(row); editIngredients(row); editSubRecetas(row)}}>
               <div className="title-box">
                 {row.nombre_receta ? row.nombre_receta : "N/A"}
               </div>
               <div className="img-box">{imagen}</div>
              <div className="btn-box"></div>
             </div>
          );
         }
        }else{
          //sub-recetas
          if (row.sub_receta == 1){
            return (
             <div className={`box-respie ${contador > 3 ? "" : "" }`} key={row.id_receta} onClick={(e) => {setModal(row); editIngredients(row); editSubRecetas(row)}}>
               <div className="title-box">
                 {row.nombre_receta ? row.nombre_receta : "N/A"}
               </div>
               <div className="img-box">{imagen}</div>
              <div className="btn-box"></div>
             </div>
          );
         }
        }
        
      });
    }
  };


  // Renderizado del html
  return (
    <>
      <Navbar />
      <section className="title-page">
        <h2>Recetas</h2>
      </section>
      <section className="create-respie">
        <button onClick={() => {setModal({}); setInSelect([]); setEditIngre([])}}>
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
            {mapResipe(0)}
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
            { mapResipe(1)}
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
                  {activeModal.imagen == undefined ? (<BiImageAdd/>) : (<img src={`${activeModal.imagen}`}/>)}
                  <input type="file"  id="fileUpload" accept=".jpg, .jpeg, .png" />
                </div>
              </div>
              <div className="aside-respie-rigth">
                <div className="header-body">
                  <div className="close-modal-respie">
                      <button type="button" onClick={() => {setModal(null); setInSelect([])}}>Cerrar modal <AiOutlineCloseCircle/></button>
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
                      let imagen = "";
                      if (document.getElementById('fileUpload').files){
                        imagen = await fileUpload(document.getElementById('fileUpload').files[0]);
                      } 

                      try{
                        if (JSON.stringify(tipoPlato) ==  '{}'){
                          tipoPlato.value = activeModal.tipo_receta;
                        }

                        let dataTable = [];
                        document.querySelectorAll(".input-cantidad-resipe").forEach((e) => {
                          let value = e.value;
                          let index = e.getAttribute('id');
                          let id_ingredientSend = e.getAttribute('cod'); 
                          let selectData = document.getElementById("select-"+index).value;
                          let cantidad_ingrediente_a_restar = parseFloat(e.getAttribute('count'));
                          let cantidad_ingrediente_a_restar_general = parseFloat(e.getAttribute('countgeneral'));
                          if (isNaN(cantidad_ingrediente_a_restar)){
                            cantidad_ingrediente_a_restar = cantidad_ingrediente_a_restar_general;
                          }

                          if (value == ''){
                            value = 0;
                          }else{
                            value = parseFloat(value);
                          }
                          dataTable.push([id_ingredientSend, value, selectData, cantidad_ingrediente_a_restar]);
                        });


                        values.ingredient = dataTable;
                        values.sub_receta = dataRespiSel;
                        values.tipoPlato = tipoPlato.value;
                        values.id_restaurant = id;
                        values.imagen = imagen;

console.log(values)
                        //Editar
                        if (values.id_receta !== ''){
                          // if (dataRespiSel.length == 0){
                          //   values.sub_receta  = activeModal.sub_recetas;
                          // }
                        }

                        //Guardar o editar la receta
                        const response = await saveEditRespie(values);                      
                        if (response){
                          //todo funciono bien
                          if (values.id_receta.length == 0){
                            //se creo una nueva receta falta consultarla para agregarla al arreglo general
                            const responseLimit = await getResipeLimit(id);
                            if (Array.isArray(responseLimit)){
                              stateResipe.unshift(responseLimit[0]);
                              setResipes(stateResipe);
                              showToastMessage();
                              setModal(null); 
                              setInSelect([]);
                            }
                            //cuando se esta editando va por este lado
                          }else{

                          }
                        }else{
                          //algo fallo y no se deberia fallar
                          showToastMessageErr();
                        } 

                        setErro(null);

                      }catch(err){
                        console.log(err)
                      }
                    }}
                  >
                    {({ handleSubmit, touched, isSubmitting, errors }) => (
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
                            <Field type="number" name="cantidad_plato" id="cantidad_plato" step="1"  placeholder="Digite la cantidad del plato"/>
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
                              defaultValue={ingredientInEdit.length > 0 ? ingredientInEdit : null}
                              isMulti
                              options={ingredient}
                              placeholder="Seleccione los ingredientes para crear la receta"
                          />
                           <div className="error-respi"></div>   
                            {
                              ingredientSelect.length > 0 ?
                              (
                                <table className="table-ingredient-respie">
                                  <thead>
                                    <tr>
                                      <th>Nombre</th>
                                      <th>Cantidad por ingrediente</th>
                                      <th>Unidad de medida</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                      {ingredientSelect.map((row, index) => {
                                        return (
                                          <tr key={row.label}>
                                            <td> {row.label} </td>
                                            <td> 
                                              <input className="input-cantidad-resipe" step="any" id={`${index}`} cod={`${row.value}`} count={`${row.cantidad_total_ingrediente}`} 
                                              countgeneral={`${row.cantidad_total_ingredeinte_general}`} type="number" placeholder="cantidad ingrediente" defaultValue={row.cantidad_total_ingrediente1 ? row.cantidad_total_ingrediente1 : 0} />  
                                            </td>
                                            <td> 
                                              <span className="span-table-respie">
                                                Inicial : {row.unidad_medida} 
                                              </span>
                                              <select className="select-respie-gra" id={`select-${index}`} defaultValue={row.unidad_medida != undefined ? row.unidad_medida : ""}>
                                                {/* <option selected={true} disabled={true} defaultValue={""} value="unidad">Unidad de medida</option> */}
                                                <option value="und">und</option>
                                                <option value="gr">gr</option>
                                                <option value="mg">mg</option>
                                                <option value="lb">lb</option>
                                                <option value="kr">kr</option>
                                                <option value="oz">oz</option>
                                                <option value="lt">lt</option>
                                                <option value="cm3">cm3</option>
                                                <option value="ml">ml</option>
                                              </select>
                                             </td>
                                          </tr>
                                        )
                                      })}
                                  </tbody>
                                </table>
                              ) 
                              : (null)                            
                            }
                        </div>
                        <div className="section-form-colum">  
                          <label htmlFor="Sub-receta">Sub-recetas</label>
                          {/* Select para las sub-recetas */}
                          <Select id="Sub-receta" onChange={(e) => {setRespiSelet(e);}}
                              closeMenuOnSelect={false}
                              defaultValue={activeModal.sub_recetas}
                              isMulti                
                              options={respiseFormated}
                              placeholder="Seleccione las recetas que necesitan de esta receta para hacerse"
                          />
                           <div className="error-respi"></div>   
                           {console.log(respiseFormated)}
                        </div>
                         {/* select normal para tipo de plato */}
                         <div className="section-form-colum">  
                          <label htmlFor="tipo_plato">Tipo de Receta</label>
                          {/* Select normal para tipo de plato */}
                          <Select id="tipo_plato" onChange={(e) => {setTipoPlato(e);}}
                              closeMenuOnSelect={true}  
                              defaultValue={activeModal.tipo_receta ? [{"label": activeModal.tipo_receta, "value": activeModal.tipo_receta}] : ""}              
                              options={dataTipoPlato}
                              placeholder="Seleccione el tipo de plato"
                          />
                           <div className="error-respi">{errorselet ? (<p className="error">{errorselet}</p>)  : null}</div>   
                        </div>
                        <div className="section-form-colum-btn">  
                            <button type="submit" disabled={isSubmitting}>{isSubmitting ? (
                              <AiOutlineLoading3Quarters className="load-respie-send"/>
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
