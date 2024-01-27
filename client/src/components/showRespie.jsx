import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//style
import style from "../public/css/showRespieStyle.module.css";

//APIS
import {
  getResipes,
  getIngredient,
  saveEditRespie,
  getResipe,
  editIngredientsResipe,
} from "../api/resipe";
import { convertion } from "../public/js/unitConversion";
import { fileUpload } from "../app/cloudinary";

//components
import Navbar from "./reuseComponents/navbar";
import { FileInputButton, FileMosaic } from "@files-ui/react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import Select from "react-select";
import { Field, Form, Formik } from "formik";
import Grid from "@mui/material/Grid";

//icons
import {
  AiOutlineSearch,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import {
  MdOutlineNoFood,
  MdNoDrinks,
  MdDinnerDining,
  MdImageNotSupported,
} from "react-icons/md";
import { GiCupcake } from "react-icons/gi";
import { BiImageAdd, BiAddToQueue } from "react-icons/bi";
import { FiAlertTriangle } from "react-icons/fi";
import { GoCloudOffline } from "react-icons/go";

let unitArr = ["kg", "lb", "oz", "gr", "mg", "und"];
let json = {};

function ShowRespie() {
  //localState
  const [divide, setDivide] = useState(1);
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
  const [infoReceta, setInfoReceta] = useState({});
  //new
  const [infoIngredients, setInfoIngredients] = useState({});

  const { id } = useParams();
  const dataTipoPlato = [
    { label: "Plato", value: "Plato" },
    { label: "Bebida", value: "Bebida" },
    { label: "Postre", value: "Postre" },
    { label: "Otro", value: "Otro" },
  ];
  let contador = 0;

  //Loacl variables-
  const showToastMessage = () => {
    toast.success("Guardado con exito", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageErr = () => {
    toast.error("Ha ocurrido un error", {
      position: toast.POSITION.TOP_RIGHT,
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
          for (var i in response) {
            if (response[i].sub_receta == 1) {
              (response[i].label = response[i].nombre_receta),
                (response[i].value = response[i].id_receta),
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
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //validacion en los campos
  const validateTxt = (values) => {
    let error = "";
    if (values.length == 0) {
      error = "*El campo es obligatorio";
    } else if (values.length > 100) {
      error = "*El campo debe tener minimo 60 caracteres";
    }
    return error;
  };

  const editIngredients = (row) => {
    //llenar los valores de la infoReceta
    setInfoReceta({
      subTotal: parseFloat(row.sub_total),
      margen_error: parseFloat(row.margen_error),
      sub_total_M_E: parseFloat(row.sub_total_M_E),
      margenContribucion: parseFloat(row.margen_contribucion),
      subTotal_margen_contribucion: parseFloat(
        row.subTotal_margen_contribucion
      ),
      costo_potencial_venta: parseFloat(row.costo_potencial_venta),
      iva: parseFloat(row.iva),
      costo_venta: parseFloat(row.costo_venta),
    });

    if (row.ingredientes != undefined) {
      let ingredientesEdit = row.ingredientes;
      let arrNew = [];
      let arrInfoIngredients = {};
      ingredient.filter((fill) => {
        let value = fill.value;
        ingredientesEdit.filter((fill1) => {
          if (fill1.id_ingrediente == value) {
            arrNew.push({
              label: fill1.nombre_ingrediente,
              value: fill1.id_ingrediente,
              unidad_medida: fill1.unidad_medida_r,
              cantidad_total_ingrediente1: fill1.cantidad_por_receta,
              id_ingrediente_receta: fill1.id_ingrediente_receta,
              cantidad_total_ingredeinte_general:
                fill.cantidad_total_ingrediente,
              unidad_medida_original: fill1.unidad_original,
              cantidad_editable: fill.cantidad_editable_ingrediente,
              costo_total: fill.costo_total,
              costo_unitario: fill.costo_unitario,
            });

            arrInfoIngredients[fill1["id_ingrediente"]] = {
              input: fill1["cantidad_por_receta"],
              select: fill1["unidad_medida_r"],
              original: fill1["unidad_original"],
              quantity_in: fill1["cantidad_editable_ingrediente"],
              exist: true,
            };
          }
        });
      });

      setInfoIngredients(arrInfoIngredients);
      setEditIngre(arrNew);
      setInSelect(arrNew);

      return;
    }

    setEditIngre([]);
  };

  const editSubRecetas = (row) => {
    if (row.sub_recetas != undefined) {
      for (var i in row.sub_recetas) {
        row.sub_recetas[i].label = row.sub_recetas[i].nombre_receta;
        row.sub_recetas[i].value = row.sub_recetas[i].id_receta;
      }
    }
  };

  //Renderizado de la recetas
  const mapResipe = (arr) => {
    if (resipeAux.length > 0) {
      arr = resipeAux;
    }

    if (arr.length > 0) {
      return arr.map((row, index) => {
        let imagen;
        let isSubReceta = row.sub_receta == 0 ? false : true;
        if (row.imagen) {
          imagen = <img className="img-respie" src={`${row.imagen}`} />;
        } else if (row.tipo_receta === "Plato") {
          imagen = <MdOutlineNoFood />;
        } else if (row.tipo_receta === "Bebida") {
          imagen = <MdNoDrinks />;
        } else if (row.tipo_receta === "Postre") {
          imagen = <GiCupcake />;
        } else {
          imagen = <MdDinnerDining />;
        }

        contador++;
        row.index = index;

        return (
          <Grid
            item
            xs={2}
            key={contador}
            className={style.boxInfoRecipe}
            onClick={() => {
              setCostSell(row.sub_recetas);
              setInfoIngredients({});
              editIngredients(row);
              editSubRecetas(row),
              setIsSubRespie(isSubReceta),
              setRespiSelet(row.sub_recetas);
              setImagenShow(row);
              setDivide(row.cantidad_plato);
              setModal(row);
            }}
          >
            <div className={style.headerInfoRecipe}>
              {row.nombre_receta ? row.nombre_receta : "N/A"}
            </div>
            <div className={style.imageInfoRecipe}>{imagen}</div>
            <div className={style.infoRecipeDown}>$ {row.costo_venta}</div>
            <div className={style.typeRecipe}>
              {row.sub_receta == 0 ? <span>Platillo</span> : <span>Preparación</span>}
            </div>
          </Grid>
        );
      });
    }else{
      //No hay platillos o preparaciones
      return (
        <div className={style.notFind}><GoCloudOffline/>No se encontro platillos o preparaciones</div>
      );
    }
  };

  //validar los ingredientes
  const validateIngredient = (row, index, type, e) => {
    const idIngredient = row.value;
    const value = e.target.value;
    const unityOriginal =
      row.unidad_medida_original == undefined
        ? row.unidad_medida
        : row.unidad_medida_original;
    const quantityBD =
      row.cantidad_editable == undefined
        ? row.cantidad_editable_ingrediente
        : row.cantidad_editable;
    const infoNew = infoIngredients;

    if (infoNew[idIngredient] == undefined) {
      infoNew[idIngredient] = {};
    }

    if (type == "input") {
      try {
        const parseValue = parseFloat(value);
        infoNew[idIngredient]["input"] = parseValue;
      } catch (error) {
        infoNew[idIngredient]["input"] = value;
      }
    } else {
      infoNew[idIngredient]["select"] = value;
    }

    infoNew[idIngredient]["original"] = unityOriginal;
    infoNew[idIngredient]["quantity_in"] = quantityBD;

    setInfoIngredients(infoNew);
    onchangeForm();
  };

  const updateFiles = (incommingFiles) => {
    setImage(incommingFiles[0]);
  };

  const removeFile = () => {
    setImage(undefined);
  };

  //funcion onchange del formulario para la informacion de la receta
  const onchangeForm = (arrSelectIngredients) => {
    const ingredientData = infoIngredients;
    const selectedIngredients = arrSelectIngredients;
    const ingredientsInSelect = ingredientSelect;
    let arrayReal = [];

    if (selectedIngredients != undefined) {
      arrayReal = selectedIngredients;
    } else arrayReal = ingredientsInSelect;

    for (const f in ingredientData) {
      if (ingredientData[f]["exist"] == undefined) {
        ingredientData[f]["exist"] = false;
      } else {
        ingredientData[f]["exist"] = false;
      }
    }

    let sumatoriaIngredients = 0;
    if (arrayReal.length > 0) {
      for (const i in arrayReal) {
        const idIngredientArr = arrayReal[i].value;
        if (ingredientData[idIngredientArr] != undefined) {
          ingredientData[idIngredientArr]["exist"] = true;
          const cost_unit = arrayReal[i].costo_unitario;
          const quantity_in_input = ingredientData[idIngredientArr]["input"];
          const unityOriginal = ingredientData[idIngredientArr]["original"];
          const unityToConvert =
            ingredientData[idIngredientArr]["select"] != undefined
              ? ingredientData[idIngredientArr]["select"]
              : unityOriginal;
          const convertionI = convertion(
            unityToConvert,
            quantity_in_input,
            unityOriginal
          );
          sumatoriaIngredients = sumatoriaIngredients + convertionI * cost_unit;
        }
      }
    }

    const margenError =
      infoReceta.margen_error != undefined ? infoReceta.margen_error : 0.05;
    const valueMargenError =
      sumatoriaIngredients + sumatoriaIngredients * margenError;

    const margenContribucion =
      infoReceta.margenContribucion != undefined
        ? infoReceta.margenContribucion
        : 0.3;
    const valueMargenContribucion =
      valueMargenError + valueMargenError * margenContribucion;
    const costoPotencialVenta = valueMargenError + valueMargenContribucion;
    const iva = infoReceta.iva != undefined ? infoReceta.iva : 0.19;
    const costoVenta = costoPotencialVenta + costoPotencialVenta * iva;

    setInfoReceta({
      subTotal: sumatoriaIngredients.toFixed(0),
      margen_error: margenError,
      sub_total_M_E: valueMargenError.toFixed(2),
      margenContribucion: margenContribucion,
      subTotal_margen_contribucion: valueMargenContribucion.toFixed(0),
      costo_potencial_venta: costoPotencialVenta.toFixed(2),
      iva: iva,
      costo_venta: costoVenta.toFixed(2),
    });
  };

  const setImagenShow = (row) => {
    if (row.imagen != null) {
      setImage({
        id: "fileId",
        size: 28 * 1024 * 1024,
        type: "image/jpeg",
        name: `${row.nombre_receta}`,
        imageUrl: `${row.imagen}`,
      });
    } else {
      setImage(0);
    }
  };

  const setInfoRespie = (key, value) => {
    if (infoReceta[key] != undefined) {
      if (value > 0) {
        infoReceta[key] = parseFloat((value / 100).toFixed(2));
      } else {
        if (value == "") {
          if (key == "margenContribucion") {
            infoReceta[key] = parseFloat(0.3);
          } else {
            if (key == "margen_error") {
              infoReceta[key] = parseFloat(0.05);
            } else {
              if (key == "costo_venta") {
                infoReceta[key] = parseFloat(0);
              } else {
                if (key == "iva") {
                  infoReceta[key] = parseFloat(0.19);
                }
              }
            }
          }
        } else {
          infoReceta[key] = parseFloat(value);
        }
      }
    }

    setInfoReceta(infoReceta);
    onchangeForm();
    return value;
  };

  //buscar una receta
  const searchRespie = (text, type) => {

    if (type == 'input'){
      let arrSend = [];
      if (text != "") {
        let arrSearch = stateResipe;
        arrSend = arrSearch.filter((item) => {
          if (
            item.nombre_receta.toLowerCase().includes(text.toLowerCase()) ||
            JSON.stringify(item.costo_venta).includes(text)
          )
            return item;
        }); 
      }
  
      setResipeAux(arrSend);
      mapResipe(stateResipe);
    }
    else{
      let text_search = text;
      let array_to_show = [];
      let array_from_data = stateResipe;

      if (text_search != 'Todos'){
        if (text_search == 'Platillo'){
          array_to_show = array_from_data.filter((item) => item.sub_receta === 0); 
        }else if (text_search == 'Preparacion'){
          array_to_show = array_from_data.filter((item) => item.sub_receta === 1); 
        }
      }else array_to_show = stateResipe;

      setResipeAux(array_to_show);
      mapResipe(array_to_show)
    }
  };

  //arreglar los precios si tiene subRecetas
  const setCostSell = (row, scontinue) => {
    let sumaVenta = 0;
    if (row != undefined) {
      if (row.length > 0) {
        for (let ic in row) {
          let id = row[ic]["id_receta"];
          for (let i in stateResipe) {
            if (stateResipe[i].id_receta == id) {
              if (stateResipe[i].costo_venta != null) {
                if (infoReceta["subs"] != undefined) {
                  if (infoReceta["subs"][id] != undefined) {
                    sumaVenta =
                      sumaVenta +
                      parseFloat(infoReceta["subs"][id]["valor_sum"]);
                  }
                } else {
                  sumaVenta = sumaVenta + stateResipe[i].costo_venta;
                }
              }
            }
          }
        }
      }
    } else {
      for (let i in dataRespiSel) {
        sumaVenta = sumaVenta + dataRespiSel[i].costo_venta;
      }
    }

    if (scontinue != undefined) {
      return sumaVenta;
    }
  };

  //validar el costo de venta
  const validateCostVent = (way, row) => {
    if (JSON.stringify(infoReceta) != "{}") {
      //costo venta
      if (way) {
        let margenContribucion = infoReceta.subTotal_margen_contribucion;
        let margenError = infoReceta.sub_total_M_E;
        let iva = infoReceta.iva;
        let value = 0;

        if (divide != 0) {
          value =
            (parseFloat(margenContribucion) + parseFloat(margenError)) / divide;
        }

        let costo_venta =
          parseFloat(value + value * iva) + setCostSell(dataRespiSel, true);

        json = {
          costo_potencial_venta: value,
          costo_venta: parseFloat(costo_venta.toFixed(2)),
        };

        return costo_venta.toFixed(2);
      }
    } else {
      return "N/A";
    }
  };

  //validar los datos de los numero
  const validateNumber = (value) => {
    let error = "";
    if (value.length == 0) error = "* Este campo es obligatorio";
    return error;
  };

  //renderizar los valores de la sub receta dentro de una receta
  const showSubRecipe = (row, recipes) => {
    const id_sub_receta = row.id_receta;

    for (let i in recipes) {
      if (recipes[i].id_receta == id_sub_receta) {
        return (
          <tr key={recipes[i].id_receta}>
            <td>
              <input
                placeholder="plus"
                min={1}
                type="number"
                value={1}
                disabled={true}
                className={style.plusPreparation}
                onChange={(e) =>
                  addPlusSubRecipe(
                    id_sub_receta,
                    recipes[i].costo_venta,
                    e.target.value
                  )
                }
              />
            </td>
            <td>
              {recipes[i].imagen == "" ? (
                <MdImageNotSupported />
              ) : (
                <img
                  className={style.imgPreparations}
                  src={`${recipes[i].imagen}`}
                />
              )}
            </td>
            <td>{recipes[i].nombre_receta}</td>
            <td>{recipes[i].tipo_receta}</td>
            <td id={`td_plus_${id_sub_receta}`}>${recipes[i].costo_venta}</td>
          </tr>
        );
      }
    }
  };

  const handleChangeSwitch = () => {
    if (isSubRespie) setIsSubRespie(false);
    else setIsSubRespie(true);
  };

  return (
    <div className={style.globalRecipe}>
      <Navbar restaurant={id} />
      <div className={style.body}>
        <header className={style.headerRecipe}>Recetario</header>
        <div className={style.bodyGroup}>
          <div className={style.boxBtnNew}>
            <button
              onClick={() => {
                setModal({});
                setInfoIngredients({});
                setInSelect([]);
                setEditIngre([]);
                setRespiSelet([]);
                setImage(undefined);
                setInfoReceta({});
              }}
            >
              <BiAddToQueue />
              Agregar un nuevo Platillo o Preparación
            </button>
          </div>
          <div className={style.filtersRecipe}>
            <div className={style.filterRecipeBox}>
              <select onChange={(e) => searchRespie(e.target.value, 'select')}>
                <option value={`Todos`}>Todos</option>
                <option value={`Platillo`}>Platillo</option>
                <option value={`Preparacion`}>Preparación</option>
              </select>
            </div>
            <div className={style.searchBar}>
              <AiOutlineSearch/>
              <input onChange={(e) => searchRespie(e.target.value, 'input')} type="text" placeholder="Buscar por Nombre"/>
            </div>
          </div>
          <div className={style.infoRecipe}>
            {isContinue ? (
              <Grid container spacing={5} className={style.gridFather}>
                {mapResipe(stateResipe)}
              </Grid>
            ) : (
               <div className={style.loadingRecipe}><CircularProgress color="inherit" /></div>
            )}
          </div>
        </div>
      </div>

      {/* modal para editar y crear  */}
              

      {activeModal ? (
        <section className={style.modalGlobalForm}>
          <section className={style.modalFormContent}>
            <div className={style.infoForm}>
              <div className={style.headerForm}>
                <div className={style.titleForm}>
                  {activeModal.id_receta !== undefined && activeModal.sub_receta == 0 ? (
                    <h2>Editar Platillo</h2>
                  ) : (
                    <>
                      {activeModal.id_receta !== undefined && activeModal.sub_receta == 1 ? (
                        <h2>Editar Preparación</h2>
                      ) : <h2>Crear Platillo o Preparación</h2>}
                    </>
                  )}
                </div>
              </div>
              <div className={style.bodyForm}>
                {/* Fomrik */}
                <Formik
                  initialValues={{
                    cantidad_plato:
                      activeModal.cantidad_plato !== undefined
                        ? activeModal.cantidad_plato
                        : 1,
                    descripcion:
                      activeModal.descripcion !== undefined
                        ? activeModal.descripcion
                        : "",
                    imagen:
                      activeModal.imagen !== undefined
                        ? activeModal.imagen
                        : "",
                    nombre_receta:
                      activeModal.nombre_receta !== undefined
                        ? activeModal.nombre_receta
                        : "",
                    tipo_receta:
                      activeModal.tipo_receta !== undefined
                        ? activeModal.tipo_receta
                        : "",
                    sub_receta: 0,
                    id_receta:
                      activeModal.id_receta !== undefined
                        ? activeModal.id_receta
                        : "",
                    margenError:
                      JSON.stringify(infoReceta) != "{}" &&
                      infoReceta.margen_error != null
                        ? (infoReceta.margen_error * 100).toFixed(0)
                        : 5,
                    margenContribucion:
                      JSON.stringify(infoReceta) != "{}" &&
                      infoReceta.margenContribucion != null
                        ? (infoReceta.margenContribucion * 100).toFixed(0)
                        : 30,
                    costoVenta:
                      JSON.stringify(infoReceta) != "{}" &&
                      infoReceta.costo_venta != null
                        ? infoReceta.costo_venta
                        : 0,
                    iva:
                      JSON.stringify(infoReceta) != "{}" &&
                      infoReceta.iva != null
                        ? (infoReceta.iva * 100).toFixed(0)
                        : 19,
                  }}
                  onSubmit={async (values) => {

                    let imagen = activeModal.imagen != undefined ? activeModal.imagen : "";
                    if (valueImage != undefined) {
                      if (valueImage.file != undefined) imagen = await fileUpload(valueImage.file);
                    }

                    try {
                      if (JSON.stringify(tipoPlato) == "{}") tipoPlato.value = activeModal.tipo_receta;
                      if (tipoPlato.value == undefined) tipoPlato.value = "otro";

                      let dataTable = [];
                      let ingredientEditColumn = [];

                      for (const i in infoIngredients) {
                        if (infoIngredients[i]["exist"] == true) {
                          const idIngredientSend = i;
                          const valueInput = infoIngredients[i]["input"];
                          const select = infoIngredients[i]["select"] != undefined ? infoIngredients[i]["select"] : infoIngredients[i]["original"];
                          const restIngredient = infoIngredients[i]["quantity_in"];

                          dataTable.push([
                            idIngredientSend,
                            valueInput,
                            select,
                            restIngredient,
                          ]);

                          ingredientEditColumn.push([
                            valueInput,
                            restIngredient,
                            idIngredientSend,
                          ]);
                        }
                      }

                      let infoRecetaSum = infoReceta;
                      if (infoRecetaSum != undefined) {
                        if (JSON.stringify(json) != "{}") infoRecetaSum.costo_venta_final = json.costo_venta;
                      }

                      values.ingredientes = dataTable;
                      values.sub_receta = !isSubRespie ? dataRespiSel : [];
                      values.tipoPlato = tipoPlato.value;
                      values.id_restaurant = id;
                      values.imagen = imagen;
                      values.isSubreceta = isSubRespie ? 1 : 0;
                      values.infoReceta = infoRecetaSum;

                      let idResipeSend = values.id_receta;  //Guardar o editar la receta

                      const response = await saveEditRespie(values);

                      if (response) {
                        //Editar los valores de la receta
                        if (ingredientEditColumn.length > 0) {
                          const responseIngredients = await editIngredientsResipe(id, ingredientEditColumn);

                          if (responseIngredients) console.log("edit succesfully");
                          else console.log("error");
                        }

                        if (values.id_receta.length == 0) {
                          
                          const responseLimit = await getResipe(id, response);  //consultar la ultima receta

                          if (Array.isArray(responseLimit)) {
                            idResipeSend = responseLimit[0].id_receta;
                            stateResipe.unshift(responseLimit[0]);
                            setResipes(stateResipe);
                          }
    
                         
                        } else {
                          const responseEdit = await getResipe(id,values.id_receta);  //cuando se esta editando va por este lado

                          if (Array.isArray(responseEdit)) {
                            let resultEdit = responseEdit.length > 0 ? responseEdit[0] : {};
                            let id_respie = responseEdit.length > 0 ? responseEdit[0].id_receta : "";
                            let arr_respi = stateResipe;

                            for (var i in arr_respi) {
                              if (arr_respi[i].id_receta == id_respie) arr_respi[i] = resultEdit;
                            }
                            
                              setResipes(arr_respi);
                          }
        
                        }

                        await getIngredients();
                      } else {
                        //algo fallo y no se deberia fallar
                        showToastMessageErr();
                      }

                      let arrSubRespie = [];
                      for (var i in stateResipe) {
                        if (stateResipe[i].sub_receta == 1) {
                          (stateResipe[i].label = stateResipe[i].nombre_receta),
                          (stateResipe[i].value = stateResipe[i].id_receta);

                          arrSubRespie.push(stateResipe[i]);
                        }
                      }

                      setRFormta(arrSubRespie);

                      setTimeout(() => {
                        showToastMessage();
                        setModal(null);
                        setInSelect([]);
                      }, 200);

                      setErro(null);

                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  {({ handleSubmit, touched, isSubmitting, errors }) => (
                    <Form onSubmit={handleSubmit}>
                      <Field type="hidden" name="id_receta" />
                      <div>
                        <label>¿Es Preparación?</label>
                        <div className={style.switched}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch
                                  onChange={handleChangeSwitch}
                                  color="warning"
                                />
                              }
                              label={isSubRespie ? "SI" : "NO"}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      {/* ================================== */}

                      <div className={style.boxInputsForm}>
                        {/* Input del nombre */}
                        <div>
                          <label
                            htmlFor="nombre_receta"
                          >
                            Nombre {isSubRespie ? "de la preparación" : "del platillo"}
                          </label>
                          <Field
                            type="text"
                            name="nombre_receta"
                            id="nombre_receta"
                            placeholder={`Digite el nombre ${isSubRespie ? "de la preparación" : "del platillo"}`}
                            validate={validateTxt}
                            required
                            style={
                              errors.nombre_receta &&
                              touched.nombre_receta && {
                                border: "1px solid red",
                              }
                            }
                          />
                          <div className={style.errorInputBox}>
                            {errors.nombre_receta && touched.nombre_receta && (
                              <p>{errors.nombre_receta}</p>
                            )}
                          </div>
                        </div>

                        {/* TextArea descripcion  */}
                        <div>
                          <label
                            htmlFor="descripcion"
                          >
                          Descripcion de la{" "}
                          {isSubRespie ? "sub receta" : "receta"}
                          </label>
                          <Field
                            component="textarea"
                            rows="1"
                            placeholder={`Descripcion ${isSubRespie ? "de la preparación" : "del platillo"}`}
                            className="textarea-respie"
                            type="textarea"
                            id="descripcion"
                            name="descripcion"
                            style={
                              errors.descripcion &&
                              touched.descripcion && {
                                border: "1px solid red",
                              }
                            }
                          />
                          <div className={style.errorInputBox}>
                            {errors.descripcion && touched.descripcion && (
                              <p>{errors.descripcion}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* ================================== */}

                      <div className={style.boxInputsForm}>

                        {/* Cantidad del plato */}

                        <div>
                          <label
                            htmlFor="cantidad_plato"
                          >
                            Cantidad del plato
                          </label>
                          <Field
                            type="number"
                            name="cantidad_plato"
                            id="cantidad_plato"
                            step="1"
                            min="1"
                            placeholder="Digite la cantidad del plato"
                            required
                            onInput={(e) => {
                              if (e.target.value != "") {
                                setDivide(parseFloat(e.target.value));
                              } else {
                                setDivide(1);
                              }
                            }}                          />
                          <div className={style.errorInputBox}></div>
                        </div>

                        {/* Margen de error */}

                        <div>
                          <label
                            className="label-form-respie"
                            htmlFor="margen_error"
                          >
                            Margen de error %
                          </label>
                          <Field
                            type="number"
                            name="margenError"
                            id="margen_error"
                            placeholder="Digite el margen de error"
                            validate={validateNumber}
                            min={"0"}
                            onInput={(e) =>
                              setInfoRespie("margen_error", e.target.value)
                            }
                            style={
                              errors.margenError &&
                              touched.margenError && {
                                border: "1px solid red",
                              }
                            }
                          />
                          <div className={style.errorInputBox}>
                            {errors.margenError && touched.margenError && (
                              <p className="error">{errors.margenError}</p>
                            )}
                          </div>
                        </div>
                      </div>


                       {/* ================================== */}


                      <div className={style.boxInputsFormThree}>
                        {/* Margen de contribucion */}

                        <div>
                          <label
                            htmlFor="margenContribucion"
                          >
                            Margen de contribucion %
                          </label>
                          <Field
                            type="number"
                            name="margenContribucion"
                            id="margenContribucion"
                            validate={validateNumber}
                            min={"0"}
                            placeholder="Digite el margen de contribucion"
                            onInput={(e) =>
                              setInfoRespie(
                                "margenContribucion",
                                e.target.value
                              )
                            }
                            style={
                              errors.margenContribucion &&
                              touched.margenContribucion && {
                                border: "1px solid red",
                              }
                            }
                          />
                          <div className={style.errorInputBox}>
                            {errors.margenContribucion &&
                              touched.margenContribucion && (
                                <p>
                                  {errors.margenContribucion}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Iva */}

                        <div>
                          <label className="label-form-respie" htmlFor="iva">
                            Iva %
                          </label>
                          <Field
                            type="number"
                            name="iva"
                            id="iva"
                            placeholder="Digite el iva (opcional)"
                            validate={validateNumber}
                            min={"0"}
                            onInput={(e) =>
                              setInfoRespie("iva", e.target.value)
                            }
                            style={
                              errors.iva &&
                              touched.iva && {
                                border: "1px solid red",
                              }
                            }
                          />
                          <div className={style.errorInputBox}>
                            {errors.iva && touched.iva && (
                              <p >{errors.iva}</p>
                            )}
                          </div>
                        </div>

                        {/* Costo venta */}

                        <div>
                          <label
                            htmlFor="costoVenta"
                          >
                            Costo venta (Opcional)
                          </label>
                          <Field
                            type="number"
                            name="costoVenta"
                            id="costoVenta"
                            min={"0"}
                            step={"any"}
                            placeholder="Digite el costo de venta si lo tiene"
                            onInput={(e) =>
                              setInfoRespie("costo_venta", e.target.value)
                            }
                          />
                          <div className={style.errorInputBox}></div>
                        </div>
                      </div>
                      
                      {/* Select multiple */}


                      <div className={style.sectionIngredientsSelected}>
                        <label
                          htmlFor="ingredient"
                        >
                          Lista de Ingredientes
                        </label>
                        {/* Select multiple libreria react select */}
                        <Select
                          onChange={(e) => {
                            setInSelect(e);
                            onchangeForm(e);
                          }}
                          closeMenuOnSelect={false}
                          defaultValue={
                            ingredientInEdit.length > 0
                              ? ingredientInEdit
                              : null
                          }
                          options={ingredient}
                          placeholder="Seleccione los ingredientes para crear la receta"
                          className={style.selectIngredients}
                          isMulti
                        />
                        {ingredient.length == 0 ? (
                          <div className="not-ingredients-respie">
                            <p>
                              <FiAlertTriangle /> No hay ingredientes
                              disponibles,{" "}
                              <Link
                                to={`/ingredients/all/${id}`}
                                target="_blank"
                              >
                                Ir a ingredientes
                              </Link>
                            </p>
                          </div>
                        ) : null}
                        {ingredientSelect.length > 0 ? (
                          <table className={style.tableIngredients}>
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
                                      <input
                                        className={style.inputTableIngredients}
                                        step="any"
                                        min="0"
                                        required
                                        type="number"
                                        placeholder="cantidad ingrediente"
                                        defaultValue={
                                          row.cantidad_total_ingrediente1 !=
                                          undefined
                                            ? row.cantidad_total_ingrediente1
                                            : ""
                                        }
                                        onChange={(e) => {
                                          validateIngredient(
                                            row,
                                            index,
                                            "input",
                                            e
                                          );
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <select
                                        className={style.selectTableIngredients}
                                        required
                                        id={`select-${index}`}
                                        defaultValue={
                                          row.unidad_medida != undefined
                                            ? row.unidad_medida
                                            : ""
                                        }
                                        onChange={(e) => {
                                          validateIngredient(
                                            row,
                                            index,
                                            "select",
                                            e
                                          );
                                        }}
                                      >
                                        <option value="">Ninguno</option>
                                        {!row.unidad_medida != undefined &&
                                        unitArr.includes(row.unidad_medida) ? (
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
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : null}
                      </div>

                      {/* Sub recetas */}

                      {!isSubRespie ? (
                        <div>
                          <label
                            htmlFor="Sub-receta"
                          >
                            Lista de Preparaciónes
                          </label>
                          {/* Select para las sub-recetas */}
                          <Select
                            id="Sub-receta"
                            onChange={(e) => {
                              setRespiSelet(e);
                            }}
                            closeMenuOnSelect={false}
                            defaultValue={activeModal.sub_recetas}
                            isMulti
                            options={respiseFormated}
                            placeholder="Seleccion de preparaciónes"
                            className={style.selectPreparations}
                          />
                          <div className={style.errorInputBox}></div>
                          {/* Crear la tabla para las sub-recetas solo visual */}
                          {dataRespiSel.length > 0 ? (
                            <table className={style.tableIngredients}>
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
                                {dataRespiSel.map((row) => {
                                  return showSubRecipe(row, stateResipe);
                                })}
                              </tbody>
                            </table>
                          ) : null}
                        </div>
                      ) : null}

                      {/* Tipo */}

                      {!isSubRespie ? (
                        <div>
                          <label
                            htmlFor="tipo_plato"
                          >
                            Tipos de Platillo
                          </label>
                          <Select
                            id="tipo_plato"
                            onChange={(e) => {
                              setTipoPlato(e);
                            }}
                            closeMenuOnSelect={true}
                            defaultValue={
                              activeModal.tipo_receta
                                ? [
                                    {
                                      label: activeModal.tipo_receta,
                                      value: activeModal.tipo_receta,
                                    },
                                  ]
                                : [{ label: "Plato", value: "Plato" }]
                            }
                            options={dataTipoPlato}
                            placeholder="Seleccione el tipo de platillo"
                            className={style.selectTypePlate}
                          />
                          <div className={style.errorInputBox}>
                            {errorselet ? (
                              <p>{errorselet}</p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}


                      <div>
                        {valueImage && valueImage.imageUrl != '' ? (
                          <FileMosaic
                            {...valueImage}
                            onDelete={removeFile}
                            info
                            preview
                          />
                          ) : (
                            <div>
                              <FileInputButton
                                id="fileUpload"
                                onChange={updateFiles}
                                accept="image/*"
                                label={<><BiImageAdd className="icon-resipe-image"  /> Buscar Imagen </>}
                                color="#FFEA96"
                              />
                          </div>
                        )}
                      </div>

                      <div className={style.boxBtnSave}>
                        <button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <CircularProgress color="inherit" />
                          ) : (
                            "Enviar"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {/* tabla de la informacion general de la receta */}
            <div className={style.infoDataValues}>
              <div className={style.boxCloseModal}>
                <button
                  type="button"
                  title="Cerrar modal"
                  onClick={() => {
                    setModal(null);
                    setInSelect([]);
                    setImage(undefined);
                  }}
                >
                   <AiOutlineCloseCircle />
                </button>
              </div>

              <table className={style.tableInfoValues}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientSelect.length > 0 ? (
                    <>
                      <tr>
                        <td className={style.tdName}>Subtotal</td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>${infoReceta.subTotal}</p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={style.tdName}>Margen de error</td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>
                              {parseFloat(
                                infoReceta.margen_error * 100
                              ).toFixed(0)}
                              %
                            </p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={style.tdName}>
                          SubTotal + margen de error
                        </td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>${infoReceta.sub_total_M_E}</p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={style.tdName}>Margen contribucion</td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>
                              {parseFloat(
                                infoReceta.margenContribucion * 100
                              ).toFixed(0)}
                              %
                            </p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={style.tdName}>
                          subTotal margen contribucion
                        </td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>${infoReceta.subTotal_margen_contribucion}</p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={style.tdName}>
                          Costo potencial venta
                        </td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>
                              $
                              {(
                                parseFloat(infoReceta.costo_potencial_venta) /
                                divide
                              ).toFixed(2)}
                            </p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={style.tdName}>Iva</td>
                      </tr>
                      <tr>
                        <td className={style.valueTd}>
                          {JSON.stringify(infoReceta) != "{}" ? (
                            <p>{(infoReceta.iva * 100).toFixed(0)}%</p>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    </>
                  ) : null}
                  <tr>
                    <td className={style.tdName}>
                      Precio venta{" "}
                      {dataRespiSel.length > 0 ? "+ sub-recetas" : null}
                    </td>
                  </tr>
                  <tr>
                    <td className={style.valueTd}>
                      {infoReceta["subs"] != undefined ? (
                        <p>
                          ${validateCostVent(true, activeModal.sub_recetas)}
                        </p>
                      ) : (
                        <p>
                          ${validateCostVent(true, activeModal.sub_recetas)}
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}

export default ShowRespie;
