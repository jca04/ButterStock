import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

//js
import {
  banIngredient,
  getIngredients,
  unbanIngredient,
  createIngredient,
  updateIngredients,
} from "../api/ingredients";
import { verifyUrl } from "../auth/verifyUrl";

//components
import Navbar from "./reuseComponents/navbar";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

//icons
import { AiOutlineAppstoreAdd, AiOutlineSearch } from "react-icons/ai";
import { MdImageNotSupported } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { AiOutlineCloseCircle } from 'react-icons/ai';

//style
import style from "../public/css/ingredientsStyle.module.css";

let valueCostoTotal = 0;

export default function Ingredients() {
  let { id } = useParams();
  id = verifyUrl(id);
  
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [isForm, setForm] = useState(false);
  const [isEditing, setEditing] = useState({});
  const [gramage, setGramage] = useState({ label: "gr", value: "gr" });
  const [kardex, setKardex] = useState({ label: "PEPS", value: "PEPS" });
  const [costTotal, setCostTotal] = useState(0);
  const [alertDelete, setAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState({});
  const [searchTable, setSearchTable] = useState({});
  const [isDeleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "ButterStock | Ingredientes";
    res();
  }, []);

  const res = async () => {
    const response = await getIngredients(id);
    setLoading(false);
    setIngredients(response.ingredientes);
  };

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

  const toatInfo = () => {
    toast.info(
      <div>
        los valores como: <div>- el costo unitario </div>{" "}
        <div>- la unidad de medida</div>
        <div>- cantidad</div> no se podran editar posteriormente
      </div>,
      {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      }
    );
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const subHeaderComponent = useMemo(() => {
    return (
      <div className={style.searchDiv}>
        <AiOutlineSearch />
        <input
          placeholder="Buscar"
          type="text"
          onInput={(e) => search(e.target.value)}
        />
      </div>
    );
  });

  const columns = [
    {
      name: "Ingrediente",
      selector: (row) => row.nombre_ingrediente,
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
      selector: (row) => "$" + row.costo_unitario,
    },
    {
      name: "Costo total",
      selector: (row) => "$" + row.costo_total,
    },
    {
      name: "Kardex",
      selector: (row) => row.kardex,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <div className={style.actionButton}>
            <button
              title="Editar ingrediente"
              className={style.btnInfo}
              onClick={async () => {
                setCostTotal(row.costo_total);
                setEditing(row);
                setGramage({
                  label: row.unidad_medida,
                  value: row.unidad_medida,
                });
                setKardex({ label: row.kardex, value: row.kardex });
                setForm(true);
              }}
            >
              <CiEdit />
            </button>
          </div>
          <div className={style.actionButton}>
            <button
              title="Eliminar ingrediente"
              className={style.btnDanger}
              onClick={async () => {
                setIdDelete(row);
                setAlertDelete(true);
              }}
            >
              <MdDeleteOutline />
            </button>
          </div>
        </>
      ),
    },
  ];

  const expandableRowsRecipe = (row) => {
    const columns = [
      {
        name: "Imagen",
        selector: (row) => (
          <>
            {row.imagen == "" ? (
              <MdImageNotSupported />
            ) : (
              <img src={row.imagen} alt="receta" className={style.imgRecipe} />
            )}
          </>
        ),
      },
      {
        name: "Nombre receta",
        selector: (row) => row.nombre_receta,
      },
      {
        name: "Uso de ingrediente",
        selector: (row) => row.cantidad_por_receta,
      },
    ];
    return (
      <>
        <section className={style.expandDataTable}>
          <DataTable
            columns={columns}
            data={row.data.recetas}
            responsive={true}
            pagination
            paginationComponentOptions={paginationComponentOptions}
          />
        </section>
      </>
    );
  };

  const deleteIngredient = async () => {
    const response = await banIngredient(idDelete.id_ingrediente);
    if (response.message == "Ingrediente eliminado") {
      toastDangerDelete(response.message);
      setTimeout(() => {
        setDeleting(false);
        setAlertDelete(false)
      }, 800);

      res();
      localStorage.setItem("refreshIngredients", true);
    }else{
      setAlertDelete(false);
      setDeleting(false);
    }
  };

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

  //filtro tabla ingredientes
  const search = (value) => {
    let arrSearch = [];

    if (value != "" && value != " ") {
      for (let i in ingredients) {
        for (let val in ingredients[i]) {
          if (val != "id_ingrediente" && val != "ingrediente_activo") {
            if (!Array.isArray(ingredients[i][val])) {
              let valueS = "";
              if (typeof ingredients[i][val] == "number") {
                valueS = JSON.stringify(ingredients[i][val]);
              } else {
                valueS = ingredients[i][val];
              }

              if (valueS.includes(value)) {
                console.log(valueS, value);
                arrSearch.push(ingredients[i]);
              }
            }
          }
        }
      }
    }

    const dataEmpty = new Set(arrSearch);
    let resultNoRepe = [...dataEmpty];
    setSearchTable(resultNoRepe);
  };


  return (
    <div className={style.globalIngredients}>
      <Navbar restaurant={id} />
      <Dialog open={isForm} className={style.fatherDialog} onClose={() => setForm(false)}>
        <DialogTitle className={style.headerIngredient}>Ingredientes </DialogTitle>
        <button className={style.btnClose} onClick={() => setForm(false)}><AiOutlineCloseCircle/></button>
        <DialogContent className={style.dialogIngredient}>
          <Formik
            initialValues={{
              nombre_ingrediente: JSON.stringify(isEditing) != "{}" ? isEditing.nombre_ingrediente : "",
              unidad_medida: "",
              costo_unitario: JSON.stringify(isEditing) != "{}" ? isEditing.costo_unitario : 0,
              cantidad_total_ingrediente: JSON.stringify(isEditing) != "{}" ? isEditing.cantidad_total_ingrediente : 0,
              costo_total: valueCostoTotal,
              kardex: "",
            }}
            onSubmit={async (values) => {
              try {
                values.unidad_medida = gramage.value;
                values.kardex = kardex.value;
                values.costo_total = valueCostoTotal;

                if (JSON.stringify(isEditing) == "{}") {
                  //creacion de un nuevo ingrediente
                  const response = await createIngredient(values, id);
                  if (response.message == "Ingrediente creado") {
                    if (
                      response.id_ingrediente != "" &&
                      response.id_ingrediente != undefined
                    ) {
                      let jsonAdd = {
                        cantidad_total_ingrediente:
                        values.cantidad_total_ingrediente,
                        costo_total: values.costo_total,
                        costo_unitario: values.costo_unitario,
                        id_ingrediente: response.id_ingrediente,
                        ingrediente_activo: 1,
                        nombre_ingrediente: values.nombre_ingrediente,
                        recetas: [],
                        unidad_medida: values.unidad_medida,
                        kardex: values.kardex,
                      };

                      res();
                      localStorage.setItem("refreshIngredients", true);
                      toastSucces(response.message);
                    } else {
                      window.location.reload();
                    }
                  } else {
                    toastDangerDelete(response.message);
                  }
                } else {
                  //edicion de un ingrediente
                  const response = await updateIngredients(
                    values,
                    isEditing.id_ingrediente
                  );

                  if (response == "Se ha actualizado correctamente") {
                    let arrEdit = ingredients;

                    arrEdit.forEach((row) => {
                      if (row.id_ingrediente == isEditing.id_ingrediente) {
                        (row.kardex = values.kardex),
                          (row.nombre_ingrediente = values.nombre_ingrediente);
                      }
                    });

                    toastSucces(response);
                    localStorage.setItem("refreshIngredients", true);
                  } else {
                    toastDangerDelete(response);
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
                <div >
                  <label
                    className={style.labelForm}
                    htmlFor="nombre_ingrediente"
                  >
                    Nombre Ingrediente:
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
                  <div className={style.messageError}>
                    {errors.nombre_ingrediente &&
                      touched.nombre_ingrediente && (
                        <p className="error">{errors.nombre_ingrediente}</p>
                      )}
                  </div>
                  {JSON.stringify(isEditing) == "{}" ? (
                    <>
                      <label
                        className={style.labelForm}
                        htmlFor="unidad_medida"
                      >
                        Unidad de medida
                      </label>
                      <Select
                        onChange={(e) => setGramage(e)}
                        className={style.selectForm}
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
                        className={style.labelForm}
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
                          touched.costo_unitario && {
                            border: "1px solid red",
                          }
                        }
                      />
                      <div className={style.messageError}>
                        {errors.costo_unitario && touched.costo_unitario && (
                          <p className="error">{errors.costo_unitario}</p>
                        )}
                      </div>

                      <label className={style.labelForm} htmlFor="cant">
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
                      <div className={style.messageError}>
                        {errors.cantidad_total_ingrediente &&
                          touched.cantidad_total_ingrediente && (
                            <p className="error">
                              {errors.cantidad_total_ingrediente}
                            </p>
                          )}
                      </div>
                      <label  className={style.labelForm} htmlFor="cost">
                        Costo Total
                      </label>
                      <Field
                        type="number"
                        step="any"
                        min="1"
                        autoComplete={"off"}
                        id="cost"
                        value={
                          costTotal !== 0 && valueCostoTotal == 0
                            ? costTotal
                            : valueCostoTotal
                        }
                        placeholder="Costo total"
                        disabled={true}
                        name="costo_total"
                      />
                      <div className={style.messageError}></div>
                    </>
                  ) : null}
                  <label className={style.labelForm} htmlFor="unidad_medida">
                    Kardex
                  </label>
                  <Select
                    onChange={(e) => setKardex(e)}
                    className={style.selectForm}
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
                <div className={style.btnSendIngredient}>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className={style.iconSubmit}><CircularProgress color="inherit" /> </div> 
                    ) : (
                      "Enviar"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* datatable  */}

      <section className={style.bodyIngredients}>
        <header className={style.header}>Ingredientes</header>
        <section className={style.bodyBox}>
          <div className={style.addNewIngredient}>
            <button
              type="button"
              onClick={() => {
                setForm(true);
                setCostTotal(0);
                toatInfo();
                setEditing({});
              }}
            >
              <AiOutlineAppstoreAdd />
              Agregar un nuevo ingrediente
            </button>
          </div>
          {console.log(ingredients)}
          {!loading  ? (
            <DataTable
              columns={columns}
              responsive={true}
              data={searchTable.length > 0 ? searchTable : ingredients}
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
              striped
            />
          ) : (
            <div className={style.loadDataTable}>
              <CircularProgress color="inherit" />
            </div>
          )}
        </section>
      </section>

      {/* Alert para cuando se elimine un ingrediente */}
      <Dialog
        open={alertDelete}
        onClose={() => setAlertDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={style.deleteIngredientD}>
          <p className={style.deleteTitle}>Eliminar ingrediente</p>
        </DialogTitle>
        <DialogContent className={style.deleteIngredientD}>
          <DialogContentText id="alert-dialog-description">
          {JSON.stringify(idDelete) != "{}" && idDelete.recetas.length > 0 ? (
              <div className={style.messageDelete}>
                <p>
                  Este ingrediente hace parte de 
                  <strong> {idDelete.recetas.length}</strong> recetas
                </p>
                <p>
                  Si lo eliminas los valores de dichas recetas se veran afectados
                </p>
              </div>
            ) : (
              <p className={style.infoDelete}>¿Estas seguro de eliminar este ingrediente?</p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={style.deleteIngredientD}>
          <Button disabled={isDeleting} className={style.btnAcept} onClick={() => { 
            deleteIngredient();
            setDeleting(true);
          }}>
          {isDeleting ? ( <CircularProgress color="inherit" />) : ("Aceptar")}</Button>
          <Button className={style.btnCancelDelete} onClick={() => setAlertDelete(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
