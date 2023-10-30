import React, { useEffect, useState } from "react";
import "../public/css/showRespieStyle.css";
import { getResipes, getIngredient,saveEditRespie, getResipe, editIngredientsResipe } from "../api/resipe";
import { convertion } from "../public/js/unitConversion";
import {fileUpload} from "../app/cloudinary";
import Navbar from "./reuseComponents/navbar";
import {Link, useParams } from "react-router-dom";
import {AiOutlineSearch, AiOutlineCloseCircle, AiOutlineLoading3Quarters} from "react-icons/ai";
import {MdOutlineNoFood, MdNoDrinks, MdDinnerDining} from 'react-icons/md';
import {GiCupcake} from 'react-icons/gi';
import {BiImageAdd} from 'react-icons/bi';
import { BiAddToQueue } from "react-icons/bi";
import {FiAlertTriangle} from 'react-icons/fi'
import {BsInboxesFill, BsFillPlusSquareFill} from 'react-icons/bs'
import { Field, Form, Formik } from "formik";
import Select from 'react-select';
import { toast } from "react-toastify";
import { FileInputButton, FileMosaic } from "@files-ui/react";

let unitArr = ['kg','lb','oz','gr','mg','und'];
let json = {};

function ShowRespie() {
  //localState
  const [divide, setDivide] = useState(1);
  const [plusSubRecipe, setPlusSubRecipe] = useState({});
  const [stateResipe, setResipes] = useState([]);
  const [resipeAux, setResipeAux] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [isContinue, setContinue] = useState(false);
  const [activeModal, setModal] = useState(null);
  const [ingredientSelect, setInSelect] = useState([]);
  const [tipoPlato, setTipoPlato] = useState({});
  const [dataRespiSel, setRespiSelet] = useState([]);
  const [respiseFormated, setRFormta] = useState([]);
  const [errorselet, setErro] = useState(null);
  const [ingredientInEdit, setEditIngre] = useState([]);
  const [isSubRespie, setIsSubRespie] = useState(false);
  const [valueImage, setImage] = useState(undefined);
  const [isSending, setSending] = useState(false);
  const [infoReceta , setInfoReceta] = useState({});
  const [ingredientError, setIngredientError] = useState(false);
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
    document.title = "ButterStock | Recetas";
    getResipesPerRestaurant();
  }, []);

  //consulta de todas las recetas
  let getResipesPerRestaurant = async () => {
    const response = await getResipes(id);
    try {
       if (Array.isArray(response)) {
        if (response.length > 0) {
          let arr = [];
          //formatear las recetas para meterlas en un array y que este datos vaya a un select
          for (var i in response){
            if (response[i].sub_receta == 1){
              response[i].label = response[i].nombre_receta,
              response[i].value = response[i].id_receta,
              arr.push(response[i]);
            }
          }
          setRFormta(arr);
          setResipes(response);
        } else {
          setResipes(response);
        }
          getIngredients();
      }
    } catch (error) {
      console.error(error);
    }
  };

  //obtener ingredientes
  let getIngredients = async () => {
    const response = await getIngredient(id);
    try {
      if (Array.isArray(response)) {
        setIngredient(response);
        setTimeout(() => {
          setContinue(true);
        }, 100)
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
    }else if (values.length > 499){
      error = "*El campo debe tener minimo 400 caracteres";
    }
    return error;
  }


  const editIngredients = (row) => {
    //llenar los valores de la infoReceta
    setInfoReceta({
      "subTotal" : parseFloat(row.sub_total),
      "margen_error" : parseFloat(row.margen_error),
      "sub_total_M_E" : parseFloat(row.sub_total_M_E),
      "margenContribucion" : parseFloat(row.margen_contribucion),
      "subTotal_margen_contribucion" : parseFloat(row.subTotal_margen_contribucion),
      "costo_potencial_venta" : parseFloat(row.costo_potencial_venta),
      "iva" : parseFloat(row.iva),
      "costo_venta" : parseFloat(row.costo_venta)
    });


    if (row.ingredientes != undefined){
      let ingredientesEdit = row.ingredientes;
      let arrNew = [];
      ingredient.filter((fill) => {
        let value = fill.value;
        ingredientesEdit.filter((fill1) => {
          if (fill1.id_ingrediente == value){
            arrNew.push({
              label: fill1.nombre_ingrediente, 
              value: fill1.id_ingrediente, 
              unidad_medida: fill1.unidad_medida_r, 
              cantidad_total_ingrediente1: fill1.cantidad_por_receta, 
              id_ingrediente_receta: fill1.id_ingrediente_receta, 
              cantidad_total_ingredeinte_general: fill.cantidad_total_ingrediente,
              unidad_medida_original: fill1.unidad_original,
              cantidad_editable: fill.cantidad_editable_ingrediente,
              costo_total: fill.costo_total,
              costo_unitario: fill.costo_unitario
            });
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
  const mapResipe = (type, arr) => {
    if (resipeAux.length > 0){
      arr = resipeAux;
    }

    let contadorReceta = 0;
    let contadorSubReceta = 0

    for (let i in arr){
      if (arr[i]['sub_receta'] == 1){
        contadorSubReceta++
      }else{
        contadorReceta++
      }
    }

    if (arr.length > 0){
      return arr.map((row, index) => {
        let imagen;
        let isSubReceta = row.sub_receta == 0 ? false : true;
        if (row.imagen){
          imagen = <img className="img-respie" src={`${row.imagen}`}/>;
        }else if (row.tipo_receta === 'Plato'){
          imagen = <MdOutlineNoFood/>;
        }else if (row.tipo_receta === 'Bebida'){
          imagen = <MdNoDrinks/>;
        }else if (row.tipo_receta === 'Postre'){
          imagen = <GiCupcake/>;
        }else{
          imagen = <MdDinnerDining/>;
        }
  
        contador++;
  
        row.index = index;
        if (type == 0){
          //recetas
          if (row.sub_receta == 0 && contadorReceta > 0){
            return (
             <div className={`box-respie ${contador > 3 ? "" : "" }`} key={row.id_receta} onClick={() => {setCostSell(row.sub_recetas); editIngredients(row); editSubRecetas(row), setIsSubRespie(isSubReceta), setRespiSelet(row.sub_recetas); setImagenShow(row); setDivide(row.cantidad_plato); setModal(row);}}>
               <div className="title-box">
                 {row.nombre_receta ? row.nombre_receta : "N/A"}
               </div>
               <div className="img-box">{imagen}</div>
              <div className="btn-box-resipe">
                <div>$ {row.costo_venta}</div>
              </div>
             </div>
          );
         }
        }else{
          //sub-recetas
          if (row.sub_receta == 1 && contadorSubReceta > 0){
            return (
             <div className={`box-respie ${contador > 3 ? "" : "" }`} key={row.id_receta} onClick={() => {setCostSell(row.sub_recetas);  setModal(row); editIngredients(row); editSubRecetas(row), setIsSubRespie(isSubReceta), setRespiSelet(row.sub_recetas); setImagenShow(row); setDivide(row.cantidad_plato); setModal(row);}}>
               <div className="title-box">
                 {row.nombre_receta ? row.nombre_receta : "N/A"}
               </div>
               <div className="img-box">{imagen}</div>
               <div className="btn-box-resipe">
                <div>$ {row.costo_venta}</div>
              </div>
             </div>
          );
         }
        }
        
      });
    }
  };

  const activeDesactieToggle = () => {
    let element = document.getElementById('switchResipe');
    element.classList.remove('circle-respie-desactivate');
    element.classList.remove('circle-respie-active');
  }

  //validar los ingredientes
  const validateIngredient = (row, index) => {
    let idInput = 'resipe_'+index;
    //valor de las unidades de medida
    let valueSelect = document.getElementById('select-'+index).value;
    //valor de la cantidad del ingrediente
    let valueInput = parseFloat(document.getElementById(idInput).value);
    //unidad de medida original
    let unityOriginal = row.unidad_medida_original == undefined ? row.unidad_medida : row.unidad_medida_original ;
    //stock que tiene hasta el momento el ingrediente
    let quantityBD = row.cantidad_editable  == undefined ? row.cantidad_editable_ingrediente : row.cantidad_editable;
    //valor que tiene el ingrediente seleccionado para esta receta
    let valueInitialBdInput = convertion(valueSelect, row.cantidad_total_ingrediente1 == undefined ? 0 : row.cantidad_total_ingrediente1, unityOriginal) ;
    //conversion de unidades
    let valueConvertion = convertion(valueSelect, valueInput , unityOriginal);
    //operacion para sacar cuanto le queda al ingrediente
    let operation = quantityBD - (valueConvertion - valueInitialBdInput);
    //si el stock se vuelve 0 no hay que dejar que siga a aumentado
    let isZero = false;

    document.getElementById(idInput).classList.remove('input-exhausted');
    document.getElementById(idInput).removeAttribute('max', valueInput);
    if (document.getElementById(idInput + 'exhauste')) document.getElementById( idInput + 'exhauste').remove();

    if (operation <= 0){
      const p = document.createElement('p');
      p.textContent = 'Agotado';
      p.setAttribute('id',idInput +'exhauste')
      document.getElementById(idInput).parentNode.appendChild(p);
      document.getElementById(idInput).classList.add('input-exhausted');

      if (document.getElementById(idInput).getAttribute('max') == undefined){
        document.getElementById(idInput).setAttribute('max', valueInput);
      }

      isZero = true;
    }

    ingredient.filter((rowIn) => {
      if (row.value == rowIn.value){
        if (isZero){
          document.getElementById('total_'+index).textContent = '0';
        }else{
          document.getElementById('total_'+index).textContent = '' + operation.toFixed(2);
          document.getElementById(idInput).setAttribute('quantytyToRest', operation.toFixed(2));
        }
      }
    });
  }

  const updateFiles = (incommingFiles) => {
    setImage(incommingFiles[0]);
  };

  const removeFile = () => {
    setImage(undefined);
  };

  //funcion onchange del formulario para la informacion de la receta
  const onchangeForm = (arr) => {
    let arrIngredients = ingredientSelect;
    if (arr != undefined){
      arrIngredients = arr;
    }

    //cuando se crea una nueva receta
    let sumatoria = 0;
    for (let i in arrIngredients){
      let unidadMedida = arrIngredients[i].unidad_medida_original != undefined ? arrIngredients[i].unidad_medida_original : arrIngredients[i].unidad_medida;
      let costoUnitario = arrIngredients[i].costo_unitario;
      let idIngrediente = arrIngredients[i].value;
      let inputIngrediente = document.querySelector('input[cod="'+idIngrediente+'"]'); 


      if (inputIngrediente){
        let index = inputIngrediente.getAttribute('index');
        let selectValue = document.getElementById('select-'+index).value; 
        let valueConvertion = inputIngrediente.value
        if (valueConvertion == '') valueConvertion = 1;


        let costoUnitarioValor = convertion(selectValue, parseFloat(valueConvertion), unidadMedida);

        sumatoria = sumatoria + (costoUnitarioValor *  costoUnitario);     
      }
    }


    //margen de error
    let margenError = infoReceta.margen_error != undefined ? infoReceta.margen_error : 0.05;
    let valueMargenError =  sumatoria + (sumatoria * margenError);

    //margen contribucion
    let margenContribucion = infoReceta.margenContribucion != undefined ? infoReceta.margenContribucion : 0.3;
    let valueMargenContribucion = valueMargenError + (valueMargenError * margenContribucion);

    //costo potencial venta
    let costoPotencialVenta = (valueMargenError + valueMargenContribucion)

    //costo Venta
    let iva = infoReceta.iva != undefined ? infoReceta.iva : 0.19;
    let costoVenta = costoPotencialVenta + (costoPotencialVenta * iva);

    setInfoReceta({
      "subTotal" : sumatoria.toFixed(0),
      "margen_error" : margenError,
      "sub_total_M_E" :valueMargenError.toFixed(2),
      "margenContribucion" : margenContribucion,
      "subTotal_margen_contribucion" : valueMargenContribucion.toFixed(0),
      "costo_potencial_venta" : costoPotencialVenta.toFixed(2),
      "iva" : iva,
      "costo_venta" :  costoVenta.toFixed(2) 
    });

  }


  const setImagenShow = (row) => {
    if ( row.imagen != null){
      setImage({ id: "fileId",
        size: 28 * 1024 * 1024,
        type: "image/jpeg",
        name: `${row.nombre_receta}`,
        imageUrl: `${row.imagen}`})
    }else{
      setImage(0);
    }
  }
 
 
  const setInfoRespie = (key, value) => {
    if (infoReceta[key] != undefined){
      if (value > 0){
        infoReceta[key] = parseFloat((value / 100).toFixed(2));
      }else{
        if (value == ''){
          if (key == 'margenContribucion'){
            infoReceta[key] = parseFloat(0.3);
          }else{
            if (key == 'margen_error'){
              infoReceta[key] = parseFloat(0.05);
            }else{
              if (key == 'costo_venta'){
                infoReceta[key] = parseFloat(0);
              }else{
                if (key == 'iva'){
                  infoReceta[key] = parseFloat(0.19)
                }
              }
            }
          }
        } else{
         infoReceta[key] = parseFloat(value);
        }
      }
    }

    setInfoReceta(infoReceta);
    onchangeForm();
    return value;
  }

  //buscar una receta 
  const searchRespie = (text) => {
    let arrSend = [];
    if (text != ''){     
      let arrSearch = stateResipe;
      for (let i in arrSearch){
        if (JSON.stringify(arrSearch[i]) != '{}'){
          if (arrSearch[i].nombre_receta != undefined){
            let textArr = arrSearch[i].nombre_receta.toLowerCase();
            let textIn = text.toLowerCase();
            if (textArr.includes(textIn)){
              arrSend.push(arrSearch[i])
            }
          }
        }
      }
    }

    setResipeAux(arrSend);
    mapResipe(0, stateResipe);
    mapResipe(1, stateResipe);

  }

  //arreglar los precios si tiene subRecetas
  const setCostSell = (row,scontinue) => {
    let sumaVenta = 0;
    if (row != undefined){
      if (row.length > 0){
        for (let ic in row){
          let id = row[ic]['id_receta'];
          for (let i in stateResipe){
            if (stateResipe[i].id_receta == id){
              if (stateResipe[i].costo_venta != null){
                if (infoReceta['subs'] != undefined){
                  if (infoReceta['subs'][id] != undefined){
                    sumaVenta = sumaVenta + parseFloat(infoReceta['subs'][id]['valor_sum']);
                  }
                }else{
                  sumaVenta = sumaVenta + stateResipe[i].costo_venta;
                } 
              }
            }
          }
        }
      }
    }else{
      for (let i in dataRespiSel){
        sumaVenta = sumaVenta + dataRespiSel[i].costo_venta;
      }
    }

    if (scontinue != undefined){
      return sumaVenta;
    }  
  }
 
  //validar el costo de venta
  const validateCostVent = (way,row) =>{

    if (JSON.stringify(infoReceta) != '{}'){
      //costo venta
      if (way){
        let margenContribucion = infoReceta.subTotal_margen_contribucion
        let margenError = infoReceta.sub_total_M_E;
        let iva = infoReceta.iva;
        let value = 0;

        if (divide != 0){
          value = (parseFloat(margenContribucion) +  parseFloat(margenError)) / divide;
        }
        

        let costo_venta = parseFloat(value + (value * iva))  + setCostSell(dataRespiSel, true);

        json = {
        'costo_potencial_venta' : value,
        'costo_venta' : parseFloat(costo_venta.toFixed(2))
        }



        return costo_venta.toFixed(2);
        
      }
    }else{
      return ('N/A');
    }
  }

  //intervalo para volver a renderizar ingrediente cuando estos se hayan actualizado eliminado o creado
  const intervalIngredients = setInterval(() => {
      const valueLocal = localStorage.getItem('refreshIngredients');
      if (valueLocal != undefined){
        getResipesPerRestaurant();
        setModal(null);
        localStorage.removeItem('refreshIngredients')
      }
  }, 1000);


  //validar los datos de los numero
  const validateNumber = (value) => {
    let error = '';
    if (value.length == 0){
      error = '* Este campo debe ser llenado';
    }

    return error
  }

  //renderizar los valores de la sub receta dentro de una receta

  const showSubRecipe = (row, recipes) => {
    const id_sub_receta = row.id_receta;

    for (let i in recipes){
      if (recipes[i].id_receta == id_sub_receta){
        return (
          <tr key={recipes[i].id_receta}>
            <td className="td-input-plus-recipe">
              <input placeholder="plus" min={1} type="number" value={1} disabled={true} className="input-plus-sub-recipe"  onChange={(e) => 
                addPlusSubRecipe(id_sub_receta,recipes[i].costo_venta, e.target.value) 
                } 
              />
            </td>
            <td>{recipes[i].imagen == '' ? 'No tiene' : <img className="img-table-subRespie" src={`${recipes[i].imagen}`}/>}</td>
            <td>{recipes[i].nombre_receta}</td>
            <td>{recipes[i].tipo_receta}</td>
            <td id={`td_plus_${id_sub_receta}`} >${recipes[i].costo_venta}</td>
          </tr>
        );
      }
    }
  }

  // Renderizado del html
  return (
    <>
      <Navbar />
      {isContinue ? (
        <>
        <div className="body-respie-all">
          <section className="title-page">
          <BsInboxesFill/>
            <h2>Recetas</h2>
          </section>
          <div className="backgroun-resipe">
          <section className="search-section">
            <button onClick={() => {setModal({}); setInSelect([]); setEditIngre([]); setRespiSelet([]); setImage(undefined); setInfoReceta({}); }}>
            <BiAddToQueue /> Agregar nueva receta 
            </button>
            <div className="search-respie">
              <div>
                  <AiOutlineSearch  className="icon-search-recipe"/>
                <input type="text" className="search" placeholder="Buscar" onInput={(e) => searchRespie(e.target.value)}/>
              </div>
            </div>
          </section>
          <section className="respie-father">
          {/* Recetas  */}
          <section className="respie">
            <div className="title-respie">
              <h2>Lista de Recetas</h2>
            </div>
            {/* Data recetas */}
            <div className="data-respie">
              {mapResipe(0, stateResipe)}
            </div>
          </section>
          {/* Sub-recetas */}
          <section className="sub-respie">
            <div className="sub-title-respie">
              <h2>Lista de Sub-Recetas</h2>
            </div>
            {/* Data recetas */}
            <div className="sub-data-respie">
              { mapResipe(1, stateResipe)}
              </div>
          </section>
        </section>
        </div>
      </div>
      </>
      ) : ( 
        <div className="loading-first-resipe">
          <AiOutlineLoading3Quarters className="loading-first-resipe-svg"/>
        </div>
        )}
      {/* modal para editar y crear  */}
      {/* ------------------------------ */}
      {
        activeModal ? (
          <section className="modal-respie-create">
            <section className="modal-data-respie">
              <div className="aside-respie-left">
                <div className="img-aside-respie">
                  {valueImage ? (
                    <FileMosaic {...valueImage} onDelete={removeFile} info preview />
                  ) : (
                    <div className="div-image-respie">
                      <FileInputButton id="fileUpload" onChange={updateFiles} accept="image/*" label={<BiImageAdd className="icon-resipe-image"/>} color="#FFEA96"/>
                    </div>
                  )}
                </div>
                <div className="info-ingredients-respie">
                  <h4 className="h4-go-ingredients">Para agregar un nuevo ingrediente</h4>
                  <Link to={`/ingredients/all/${id}`} target="_blank">Ir a ingredientes</Link>
                </div>
              </div>
              <div className="aside-respie-rigth">
                <div className="header-body">
                  <div className="close-modal-respie">
                      <button type="button" onClick={() => {setModal(null); setInSelect([]); setImage(undefined);}}>Cerrar modal <AiOutlineCloseCircle/></button>
                  </div>
                  <div className="title-modal-respie">
                    {activeModal.id_receta !== undefined ? (<h2>Editar receta</h2>) : (<h2>Crear receta</h2>)}
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
                      margenError : JSON.stringify(infoReceta) != '{}' && infoReceta.margen_error != null ? (infoReceta.margen_error * 100).toFixed(0) : 5, 
                      margenContribucion  : JSON.stringify(infoReceta) != '{}' && infoReceta.margenContribucion != null ? (infoReceta.margenContribucion * 100).toFixed(0) : 30,
                      costoVenta: JSON.stringify(infoReceta) != '{}' && infoReceta.costo_venta != null ? infoReceta.costo_venta : 0,
                      iva : JSON.stringify(infoReceta) != '{}' && infoReceta.iva != null ? (infoReceta.iva * 100).toFixed(0) : 19
                    }}

                
                    onSubmit={async (values) => {
                      if (document.querySelectorAll(".input-cantidad-resipe").length == 0){
                        setIngredientError(true);
                        return;
                      }

                      setSending(true);

                      let imagen = activeModal.imagen != undefined ? activeModal.imagen : '';
                      if (valueImage != undefined){
                        if (valueImage.file != undefined){
                          imagen = await fileUpload(valueImage.file);
                       } 
                      }
                    
                      try{
                        if (JSON.stringify(tipoPlato) ==  '{}'){
                          tipoPlato.value = activeModal.tipo_receta;
                        }

                        let dataTable = [];
                        let ingredientEditColumn = [];
                        document.querySelectorAll(".input-cantidad-resipe").forEach((e) => {
                          let value = e.value;
                          let index = e.getAttribute('index');
                          let id_ingredientSend = e.getAttribute('cod'); 
                          let selectData = document.getElementById("select-"+index).value;
                          let cantidad_ingrediente_a_restar = parseFloat(e.getAttribute('count'));
                          let cantidad_ingrediente_a_restar_general = parseFloat(e.getAttribute('countgeneral'));
                          let cantidad_editable = e.getAttribute('quantytytorest');

                          if (cantidad_editable !== undefined){
                            ingredientEditColumn.push([parseFloat(cantidad_editable), id_ingredientSend]);
                          }

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

                        let infoRecetaSum = infoReceta;
                        if (infoRecetaSum != undefined){
                          if (JSON.stringify(json) != '{}'){
                            infoRecetaSum.costo_venta_final = json.costo_venta;
                          }
                        }



                        values.ingredientes = dataTable;
                        values.sub_receta =  !isSubRespie ? dataRespiSel : [];
                        values.tipoPlato = tipoPlato.value;
                        values.id_restaurant = id;
                        values.imagen = imagen;
                        values.isSubreceta = isSubRespie ? 1 : 0;
                        values.infoReceta = infoRecetaSum;

                        //Guardar o editar la receta
                        let idResipeSend = values.id_receta;
                        const response = await saveEditRespie(values);    

                        if (response){
                            //Editar los valores de la receta
                          if (ingredientEditColumn.length > 0){
                            for (let i in ingredientEditColumn){
                              const responseIngredients = await editIngredientsResipe(id, ingredientEditColumn[i]);

                              try{
                                if (responseIngredients){
                                  console.log('create succesfully');
                                }else console.log('error');
                              }catch(err){
                                console.log(err)
                              }
                            }
                          }

                          if (values.id_receta.length == 0){
                            //consultar la ultima receta
                            const responseLimit = await getResipe(id, response);
                            try{
                              if (Array.isArray(responseLimit)){
                                idResipeSend = responseLimit[0].id_receta;
                                stateResipe.unshift(responseLimit[0]);
                                setResipes(stateResipe);
                              }
                            }catch(err){
                              console.log(err);
                            }
                            //cuando se esta editando va por este lado
                          }else{
                            const responseEdit = await getResipe(id, values.id_receta);

                            try{
                              if (Array.isArray(responseEdit)){
                                let resultEdit = responseEdit.length > 0 ? responseEdit[0] : {};
                                let id_respie = responseEdit.length > 0 ? responseEdit[0].id_receta : '';
                                let arr_respi = stateResipe;

                                for (var i in arr_respi){
                                  if (arr_respi[i].id_receta == id_respie){
                                    arr_respi[i] = resultEdit;
                                  }
                                }
                                setResipes(arr_respi);
                              }
                            }catch(err){
                              console.log(err)
                            }
                          }
                        
                          await getIngredients();
                        }else{
                          //algo fallo y no se deberia fallar
                          showToastMessageErr();
                        } 

                        let arrSubRespie = [];
                        for (var i in stateResipe){
                          if (stateResipe[i].sub_receta == 1){
                            stateResipe[i].label = stateResipe[i].nombre_receta,
                            stateResipe[i].value = stateResipe[i].id_receta,
                            arrSubRespie.push(stateResipe[i]);
                          }
                        }

                        setRFormta(arrSubRespie);

                        setTimeout(() => {
                          showToastMessage();
                          setModal(null); 
                          setInSelect([]);
                          activeDesactieToggle();
                          setSending(false);
                        }, 500);

                        setErro(null);


                        localStorage.setItem('refreshRecipe', true);

                      }catch(err){
                        console.log(err)
                      }
                    }}
                  >
                    {({ handleSubmit, touched, isSubmitting, errors }) => (
                      <Form onSubmit={handleSubmit}  className="form-respie">
                        <Field type="hidden" name="id_receta"/>
                        <div className="section-form-colum">  
                          <label>¿Es sub receta?</label>
                          <div className="div-swicth-label">
                            <div className="switch-respie">
                              <div className="rail-respie">
                                <span className={`circle-respie ${isSubRespie ? 'circle-respie-active' : 'circle-respie-desactivate'}`}  id="switchResipe" onClick={(e) => {
                                  e.target.classList.remove('circle-respie-desactivate');
                                  e.target.classList.remove('circle-respie-active');
                                  if (isSubRespie){
                                    setIsSubRespie(false);
                                    e.target.classList.add('circle-respie-desactivate');
                                  }else {
                                    e.target.classList.add('circle-respie-active');
                                    setIsSubRespie(true);
                                  }
                                }}></span>
                              </div>
                            </div>
                            <span>{isSubRespie ? 'SI' : 'NO'}</span>
                          </div>
                        </div>
                        <div className="section-form-respie">
                          <div className="input-rows-respie">
                          <label className="label-form-respie" htmlFor="nombre_receta">Nombre de la {isSubRespie ? 'sub receta' : 'receta'}</label>
                            <Field type="text" name="nombre_receta" id="nombre_receta" placeholder="Digite el nombre de la receta" validate={validateTxt}   
                              style={
                                errors.nombre_receta &&
                                touched.nombre_receta && {
                                border: "1px solid red",
                                }
                              }/>
                            <div className="error-respi">{errors.nombre_receta && touched.nombre_receta && ( <p className="error">{errors.nombre_receta}</p>)}</div>                       
                          </div>
                          <div className="input-rows-respie">
                            <label htmlFor="cantidad_plato">Cantidad del plato</label>
                            <Field type="number" name="cantidad_plato" id="cantidad_plato" step="1"  min="1" placeholder="Digite la cantidad del plato" onInput={(e) => {
                              if (e.target.value != ''){
                                setDivide(parseFloat(e.target.value))
                              }else{
                                setDivide(1);
                              }
                              onchangeForm();
                              }}/>
                            <div className="error-respi"></div>    
                         </div>
                        </div>
                        <div className="section-form-colum">  
                          <label htmlFor="descripcion">Descripcion de la {isSubRespie ? 'sub receta' : 'receta'}</label>
                          <Field component="textarea" rows="2" validate={validateTxtarea} placeholder={`Descripcion de la ${isSubRespie ? 'sub receta' : 'receta'}`} className="textarea-respie" type="textarea" id="descripcion" name="descripcion"
                            style={
                                errors.descripcion &&
                                touched.descripcion && {
                                border: "1px solid red",
                                }
                            }
                          />
                          <div className="error-respi">{errors.descripcion && touched.descripcion && ( <p className="error">{errors.descripcion}</p>)}</div>    
                        </div>
                        <div className="section-form-respie">
                          <div className="input-rows-respie"> 
                          <label className="label-form-respie" htmlFor="margen_error">Margen de error %</label>
                            <Field type="number" name="margenError" id="margen_error" placeholder="Digite el margen de error" validate={validateNumber} min={'0'} onInput={(e) => setInfoRespie('margen_error', e.target.value)}
                              style={
                                errors.margenError &&
                                touched.margenError && {
                                border: "1px solid red",
                                }
                              }
                            />
                            <div className="error-respi">{errors.margenError && touched.margenError && ( <p className="error">{errors.margenError}</p>)}</div>                 
                          </div>
                          <div className="input-rows-respie">
                            <label htmlFor="margenContribucion">Margen de contribucion %</label>
                            <Field type="number" name="margenContribucion" id="margenContribucion"  validate={validateNumber}  min={'0'} placeholder="Digite el margen de contribucion" onInput={(e) => setInfoRespie('margenContribucion', e.target.value)}
                              style={
                                errors.margenContribucion &&
                                touched.margenContribucion && {
                                border: "1px solid red",
                                }
                              }
                            />
                            <div className="error-respi">{errors.margenContribucion && touched.margenContribucion && ( <p className="error">{errors.margenContribucion}</p>)}</div>    
                         </div>
                         <div className="input-rows-respie"> 
                          <label className="label-form-respie" htmlFor="iva">Iva % </label>
                            <Field type="number" name="iva" id="iva" placeholder="Digite el iva (opcional)"  validate={validateNumber}  min={'0'} onInput={(e) => setInfoRespie('iva', e.target.value)}
                              style={
                                errors.iva &&
                                touched.iva && {
                                border: "1px solid red",
                                }
                              }
                            />
                           <div className="error-respi">{errors.iva && touched.iva && ( <p className="error">{errors.iva}</p>)}</div>                    
                          </div>
                         <div className="input-rows-respie">
                            <label htmlFor="costoVenta">Costo venta (Opcional)</label>
                            <Field type="number" name="costoVenta" id="costoVenta" min={'0'} step={'any'} placeholder="Digite el costo de venta si lo tiene" onInput={(e) => setInfoRespie('costo_venta', e.target.value)}/>
                            <div className="error-respi"></div>    
                         </div>
                        </div>
                        {/* Select multiple */}
                        <div className="section-form-colum">  
                          <label htmlFor="ingredient">Ingredientes</label>
                          {/* Select multiple libreria react select */}
                            <Select onChange={(e) => {setInSelect(e); setIngredientError(false);  onchangeForm(e);}}
                              closeMenuOnSelect={false}
                              defaultValue={ingredientInEdit.length > 0 ? ingredientInEdit : null}
                              options={ingredient}
                              placeholder="Seleccione los ingredientes para crear la receta"
                              isMulti
                          />
                           <div className="error-respi">{ingredientError ? (<p className="error">{'*Debe seleccionar al menos un ingrediente'}</p>) : null}</div>   
                          {ingredient.length == 0 ? (<div className="not-ingredients-respie"><p><FiAlertTriangle/> No hay ingredientes disponibles, <Link to={`/ingredients/all/${id}`} target="_blank">Ir a ingredientes</Link></p></div>): (null)}
                            {
                              ingredientSelect.length > 0 ?
                              (
                                <table className="table-ingredient-respie">
                                  <thead>
                                    <tr>
                                      <th>Nombre</th>
                                      <th>Cantidad por ingrediente</th>
                                      <th>Unidad de medida</th>
                                      <th>Cantidad disponible</th>
                                      <th>Unidad de medida original</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                      {ingredientSelect.map((row, index) => {
                                        return (
                                          <tr key={row.label}>
                                            <td> {row.label} </td>
                                            <td> 
                                              <input className="input-cantidad-resipe" step="1" min="0" index={index} id={`resipe_${index}`} cod={`${row.value}`} count={`${row.cantidad_total_ingrediente}`} 
                                              countgeneral={`${row.cantidad_total_ingredeinte_general}`} type="number" placeholder="cantidad ingrediente" defaultValue={row.cantidad_total_ingrediente1 ? row.cantidad_total_ingrediente1 : 0} onChange={() => {validateIngredient(row, index); onchangeForm()}} />  
                                            </td>
                                            <td> 
                                              <span className="span-table-respie">
                                                Inicial : {row.unidad_medida} 
                                              </span>
                                              <select className="select-respie-gra"  id={`select-${index}`} defaultValue={row.unidad_medida != undefined ? row.unidad_medida : ""} onChange={() => {validateIngredient(row, index); onchangeForm()}}>
                                              {!row.unidad_medida != undefined  && unitArr.includes(row.unidad_medida) ? (
                                                  <>
                                                  <option value="und">und</option>
                                                  <option value="gr">gr</option>
                                                  <option value="lb">lb</option>
                                                  <option value="kg">kg</option>
                                                  <option value="oz">oz</option>
                                                  </>
                                              ) : (
                                                <>
                                                <option value="lt">lt</option>
                                                <option value="cm3">cm3</option>
                                                <option value="ml">ml</option>
                                                </>
                                              )}                                                
                                              </select>
                                             </td>
                                             <td id={`total_${index}`}>{row.cantidad_editable == undefined ? row.cantidad_editable_ingrediente :row.cantidad_editable }</td>
                                             <td>{row.unidad_medida_original == undefined ? row.unidad_medida : row.unidad_medida_original}</td>
                                          </tr>
                                        )
                                      })}
                                  </tbody>
                                </table>
                              ) 
                              : (null)                            
                            }
                        </div>
                        {!isSubRespie ? (
                        <div className="section-form-colum">  
                          <label htmlFor="Sub-receta">Sub-recetas</label>
                          {/* Select para las sub-recetas */}
                          <Select id="Sub-receta" onChange={(e) => {setRespiSelet(e); onchangeForm(); }}
                              closeMenuOnSelect={false}
                              defaultValue={activeModal.sub_recetas}
                              isMulti                
                              options={respiseFormated}
                              placeholder="Seleccione las sub-recetas"
                          />
                           <div className="error-respi"></div>   
                           {/* Crear la tabla para las sub-recetas solo visual */}
                           {
                            dataRespiSel.length > 0 ? 
                            (
                              <table className="table-ingredient-respie">
                                <thead>
                                  <tr>
                                    <th>Plus</th>
                                    <th>imagen</th>
                                    <th>Nombre</th>
                                    <th>Tipo receta</th>
                                    <th>Costo</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    dataRespiSel.map((row) => {
                                      return showSubRecipe(row,stateResipe)
                                    })
                                  }
                                </tbody>
                              </table> 
                              ) : (null)
                            }
                        </div>
                        ) : (null)}
                         <div className="section-form-colum">  
                          <label htmlFor="tipo_plato">Tipo de Receta</label>
                          {/* Select normal para tipo de plato */}
                          <Select id="tipo_plato" onChange={(e) => {setTipoPlato(e); onchangeForm()}}
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

              {/* tabla de la informacion general de la receta */}
              <div className="div-info-resipe">
                <table className="tbl-info-resipe">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-info-resipe">Subtotal</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>${infoReceta.subTotal}</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">Margen de error</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>{((parseFloat(infoReceta.margen_error*100)).toFixed(0))}%</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">SubTotal + margen de error</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>${infoReceta.sub_total_M_E}</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">Margen contribucion</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>{(parseFloat(infoReceta.margenContribucion*100)).toFixed(0)}%</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">subTotal margen contribucion</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>${infoReceta.subTotal_margen_contribucion}</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">Costo potencial venta</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>${(parseFloat(infoReceta.costo_potencial_venta) / divide).toFixed(2)}</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">Iva</td>
                  </tr>
                  <tr>
                    <td className="td-info-data-resipe">{JSON.stringify(infoReceta) != '{}' ? (<p>{(infoReceta.iva*100).toFixed(0)}%</p>) : ('N/A')}</td>
                  </tr>
                  <tr>
                    <td className="td-info-resipe">Costo venta</td>
                  </tr>
                  <tr>
                   <td className="td-info-data-resipe">
                   {infoReceta['subs'] != undefined ?  (<p>${validateCostVent(true, activeModal.sub_recetas) }</p>) : (<p>${validateCostVent(true, activeModal.sub_recetas) }</p>) }
                   </td>
                  </tr>
                </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null
      }
      {isSending ? (
        <div className="sending-respie">
          <div className="body-info-respie">
            <div className="info-sending-respie">
              <div className="icon-loading-respie">
                <AiOutlineLoading3Quarters className="load-send-respie"/>
              </div>
              <div className="txt-loading-respie">Enviando, por favor espere</div>
            </div>
          </div>
        </div>
        ) : (null)}
    </>
  );
}

export default ShowRespie;
