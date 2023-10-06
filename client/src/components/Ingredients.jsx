import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  banIngredient,
  getIngredients,
  unbanIngredient,
  createIngredient,
  updateIngredients
} from "../api/ingredients";
import Navbar from "./reuseComponents/navbar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DataTable from "react-data-table-component";
import "../public/css/ingredientsStyle.css";
import { toast } from "react-toastify";
import {CiCircleAlert} from 'react-icons/ci';
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { Field, Form, Formik } from "formik";
import Select from "react-select";

let valueCostoTotal = 0;

export default function Ingredients() {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [isForm, setForm] = useState(false);
  const [isEditing, setEditing] = useState({});
  const [gramage, setGramage] = useState({ label: "gr", value: "gr" });
  const [kardex, setKardex] = useState({ label: "PEPS", value: "PEPS" });
  const [costTotal, setCostTotal] = useState(0);
  const [alertDelete, setAlertDelete]  = useState(false);
  const [idDelete, setIdDelete] = useState({});
  const { id } = useParams();

  useEffect(() => {
    document.title = "Ingredientes";
    const res = async () => {
      const response = await getIngredients(id).then(setLoading(false));
      setIngredients(response.ingredientes);
    };
    res();
  }, []);

  const toastDangerDelete = (text) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
    });
  };

  const toastSucces = (text) => {
    toast.success(text, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
    });
  };
  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const subHeaderComponent = useMemo(() => {
    return <input type="text" onInput={(e) => search(e.target.value)} />;
  });

  const columns = [
    {
      name: "Ingrediente",
      selector: (row) =>  row.nombre_ingrediente,
    },
    {
      name: "Unidad de medida",
      selector: (row) => row.unidad_medida,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad_total_ingrediente,
    },
    {
      name: "Costo unitario",
      selector: (row) => '$'+row.costo_unitario,
    },
    {
      name: "Costo total",
      selector: (row) => '$'+row.costo_total,
    },
    {
      name: 'Kardex',
      selector: (row) => row.kardex
    },
    {
      name: "Acciones",
      cell: (row) =>
      <>
        <div className="div-actions-ingredients">
          <button className="btn btn-edit" onClick={async () => {
            console.log(row)

            setCostTotal(row.costo_total)
            setEditing(row); 
            setGramage({'label': row.unidad_medida, 'value': row.unidad_medida});
            setKardex({'label': row.kardex, 'value':row.kardex});
            
            setForm(true);
            }}>
            Editar
          </button>
        </div>
        <div className="div-actions-ingredients">
          <button className="btn btn-danger" onClick={async () => {
                setIdDelete(row);
                setAlertDelete(true);
              }}
            >
            Eliminar
          </button>
        </div>
      </>
    },
  ];

  const expandableRowsRecipe = (row) => {
    const columns = [
      {
        name: "Imagen",
        selector: (row) => (
          <>
          {console.log(row)}
            <img src={row.imagen} alt="receta" className="img_receta" />
          </>
        ),
        style: {
          marginTop: "10px",
        },
      },
      {
        name: "Nombre receta",
        selector: (row) => row.nombre_receta,
        style: {
          marginTop: "10px",
        },
      },
      {
        name: "Uso de ingrediente",
        selector: (row) => row.cantidad_por_receta,
        style: {
          marginTop: "10px",
        },
      },
    ];
    return (
      <>
        <section className="expandable_data">
          <DataTable
            columns={columns}
            data={row.data.recetas}
            responsive={true}
            pagination
          />
        </section>
      </>
    );
  };


  const deleteIngredient = async () => {
    console.log(idDelete.id_ingrediente)
    // const response = await banIngredient(idDelete.id_ingrediente);
    // if (res.message == "Ingrediente eliminado") {

    // } else {
    //     toastDangerDelete();
    // }

  }


  const validateText = (value) => {
    let error = "";
    if (value.length == 0) {
      error = "*Este campo es requerido";
    } else if (value.length > 99) {
      error = "*Este campo no puede contener mas de 100 caracteres";
    }
    return error;
  };

  const validateNumber = (value) => {
    let error = "";

    if (value == 0) {
      error = "*El valor debe ser mayor que 0";
    } else if (typeof value == "string") {
      error = "*Este campo es requerido";
    }

    return error;
  };

  const costoTotal = () => {
    let costoUnitario = document.getElementById("costoUnitario");
    let cantidad = document.getElementById("cant");

    if (costoUnitario != null && cantidad != null) {
      costoUnitario = costoUnitario.value;
      cantidad = cantidad.value;

      if (costoUnitario != "" && cantidad != "") {
        let valor = parseFloat(costoUnitario) * parseFloat(cantidad);
        valueCostoTotal = valor;
      } else {
        valueCostoTotal = 0;
      }
    } else {
      valueCostoTotal = 0;
    }
  };

  return (
    <>
      <Navbar />
      {isForm ? (
        <div className="form-all-ingredients">
          <div className="body-form-all-ingredients">
            <div className="close-modal-all-ingredients">
              <button type="button" onClick={() => {setForm(false); setEditing({})}}>
                Cerrar
              </button>
            </div>
            <div className="title-form-ingredients">
              {JSON.stringify(isEditing) != '{}' ? ('Editar') : ('Crear')} ingrediente
            </div>
            <div className="form-ingredients">
              <Formik
                initialValues={{
                  nombre_ingrediente: JSON.stringify(isEditing) != '{}' ?  (isEditing.nombre_ingrediente) : (""),
                  unidad_medida: "",
                  costo_unitario: JSON.stringify(isEditing) != '{}' ?  (isEditing.costo_unitario) : (0),
                  cantidad_total_ingrediente: JSON.stringify(isEditing) != '{}' ?  (isEditing.cantidad_total_ingrediente) : (0),
                  costo_total: valueCostoTotal,
                  kardex: "",
                }}
                onSubmit={async (values) => {
                  try {
                    values.unidad_medida = gramage.value;
                    values.kardex = kardex.value;
                    values.costo_total = valueCostoTotal;


                    if (JSON.stringify(isEditing) == '{}'){
                      //creacion de un nuevo ingrediente
                      const response = await createIngredient(values, id);
                      if (response.message == "Ingrediente creado") {
                        if (response.id_ingrediente != "" && response.id_ingrediente != undefined) {
                          let jsonAdd = {
                            cantidad_total_ingrediente:values.cantidad_total_ingrediente,
                            costo_total: values.costo_total,
                            costo_unitario: values.costo_unitario,
                            id_ingrediente: response.id_ingrediente,
                            ingrediente_activo: 1,
                            nombre_ingrediente: values.nombre_ingrediente,
                            recetas: [],
                            unidad_medida: values.unidad_medida,
                            kardex: values.kardex,
                          };

                          let arr = ingredients
                          arr.unshift(jsonAdd);
                          setIngredients(arr);

                          toastSucces(response.message);

                        }else{
                          window.location.reload();
                        }
                      } else {
                        toastDangerDelete(response.message);
                      }
                   }else{
                    //edicion de un ingrediente
                    const response = await updateIngredients(values, isEditing.id_ingrediente);
                    
                    if (response == 'Se ha actualizado correctamente'){
                      let arrEdit = ingredients;

                      arrEdit.forEach((row) => {
                        if (row.id_ingrediente == isEditing.id_ingrediente){
                          row.kardex = values.kardex,
                          row.nombre_ingrediente = values.nombre_ingrediente
                          
                        }
                      });

                      toastSucces(response);

                    }else{
                      toastDangerDelete(response)
                    }
                   }

                    setForm(false);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                {({ handleSubmit, touched, isSubmitting, errors }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="input-all-ingredients">
                      <label
                        className="label-input-form"
                        htmlFor="nombre_ingrediente"
                      >
                        Nombre Ingrediente
                      </label>
                      <Field
                        type="text"
                        name="nombre_ingrediente"
                        placeholder="nombre del Ingrediente"
                        autoComplete={"off"}
                        validate={validateText}
                        id="nombre_ingrediente"
                        style={
                          errors.nombre_ingrediente &&
                          touched.nombre_ingrediente && {
                            border: "1px solid red",
                          }
                        }
                      />
                      <div className="error-respi">
                        {errors.nombre_ingrediente &&
                          touched.nombre_ingrediente && (
                            <p className="error">{errors.nombre_ingrediente}</p>
                          )}
                      </div>
                      <label
                        className="label-input-form"
                        htmlFor="unidad_medida"
                      >
                        Unidad de medida
                      </label>
                      <Select
                        onChange={(e) => setGramage(e)}
                        className="select-gramace-ingredients"
                        closeMenuOnSelect={true}
                        defaultValue={gramage}
                        options={[
                          { label: "und", value: "und" },
                          { label: "gr", value: "gr" },
                          { label: "lb", value: "lb" },
                          { label: "kg", value: "kg" },
                          { label: "oz", value: "oz" },
                          { label: "lt", value: "lt" },
                          { label: "cm3", value: "cm3" },
                          { label: "ml", value: "ml" },
                        ]}
                        placeholder="Unidad medida"
                        isMulti={false}
                      />
                      <label
                        className="label-input-form"
                        htmlFor="costoUnitario"
                      >
                        Costo Unitario
                      </label>
                      <Field
                        type="number"
                        step="any"
                        min="1"
                        autoComplete={"off"}
                        placeholder="Costo unitario"
                        onInput={costoTotal()}
                        id="costoUnitario"
                        name="costo_unitario"
                        validate={validateNumber}
                        style={
                          errors.costo_unitario &&
                          touched.costo_unitario && { border: "1px solid red" }
                        }
                      />
                      <div className="error-respi">
                        {errors.costo_unitario && touched.costo_unitario && (
                          <p className="error">{errors.costo_unitario}</p>
                        )}
                      </div>
                      <label className="label-input-form" htmlFor="cant">
                        Cantidad en {gramage.label}
                      </label>
                      <Field
                        type="number"
                        step="any"
                        min="1"
                        id="cant"
                        validate={validateNumber}
                        onInput={costoTotal()}
                        autoComplete={"off"}
                        style={
                          errors.cantidad_total_ingrediente &&
                          touched.cantidad_total_ingrediente && {
                            border: "1px solid red",
                          }
                        }
                        placeholder="Cantidad total"
                        name="cantidad_total_ingrediente"
                      />
                      <div className="error-respi">
                        {errors.cantidad_total_ingrediente &&
                          touched.cantidad_total_ingrediente && (
                            <p className="error">
                              {errors.cantidad_total_ingrediente}
                            </p>
                          )}
                      </div>
                      <label className="label-input-form" htmlFor="cost">
                        Costo Total
                      </label>
                      <Field
                        type="number"
                        step="any"
                        min="1"
                        autoComplete={"off"}
                        id="cost"
                        value={costTotal !== 0  && valueCostoTotal == 0 ? costTotal : valueCostoTotal}
                        placeholder="Costo total"
                        disabled={true}
                        name="costo_total"
                      />
                      <div className="error-respi"></div>
                      <label
                        className="label-input-form"
                        htmlFor="unidad_medida"
                      >
                        Kardex
                      </label>
                      <Select
                        onChange={(e) => setKardex(e)}
                        className="select-gramace-ingredients"
                        closeMenuOnSelect={true}
                        defaultValue={kardex}
                        options={[
                          { label: "PEPS", value: "PEPS" },
                          {
                            label: "Promedio ponderado",
                            value: "Promedio ponderado",
                          },
                        ]}
                        placeholder="Unidad medida"
                        isMulti={false}
                      />
                    </div>
                    <div className="btn-send-ingredients">
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
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
        </div>
      ) : null}
      {loading ? (
        <div className="loding-resipe-homepage">
          <AiOutlineLoading3Quarters />
        </div>
      ) : (
        <section className="body-all-ingredients">
          <section className="header-all-ingredients">
            <BiFoodMenu /> Ingredientes
          </section>
          <section className="father_all_ingredients">
            <div className="add-new-ingredient">
              <button type="button" onClick={() => setForm(true)}>
                <AiOutlineAppstoreAdd />
                Agregar un nuevo ingrediente
              </button>
            </div>
            <DataTable
              className="datatable-ingredients"
              columns={columns}
              responsive={true}
              data={ingredients}
              pointerOnHover
              pagination
              expandOnRowClicked
              expandableRows
              highlightOnHover
              subHeader
              subHeaderComponent={subHeaderComponent}
              expandableRowExpanded={(row) => row.expandableRowExpanded}
              expandableRowsComponent={(row) => expandableRowsRecipe(row)}
              paginationComponentOptions={paginationComponentOptions}
            />
          </section>
        </section>
      )}
      {/* Alert para cuando se elimine un ingrediente */}
      {alertDelete ? (
        <div className="alert-delete-ingredient">
          <div className="body-alert-ingredient">
            <div className="header-alert-ingredient">
              <CiCircleAlert className="icon-alert-ingredient"/>
            </div>
            <div className="info-alert-ingredient">
              <p>¿Estas seguro de eliminar este ingrediente?</p>
            </div>
            {JSON.stringify(idDelete) != '{}' && idDelete.recetas.length > 0  ? (
              <div className="data-alert-ingredients">
                <p>Este ingrediente hace parte de <strong>{idDelete.recetas.length}</strong>recetas</p>
                <p>Si lo eliminas los valores de dichas recetas se veran afectados</p>
              </div>
            ) : (null)}
            <div className="btn-alert-ingredient">
               {console.log(idDelete)}
              <button type="button" className="btn-delete-ingredient" onClick={() => deleteIngredient()}>Aceptar</button>
              <button type="button" className="btn-cancel-ingredient" onClick={() => {setAlertDelete(false); setIdDelete({})}}>Cancelar</button>
            </div>
          </div>
        </div>
      ) : (null)}
    </>
  );
}
