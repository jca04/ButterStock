import React, { useEffect, useState } from "react";

//componentes
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "react-select";
import { toast } from "react-toastify";

//apis
import { getDataSelectsSalida } from "../../api/salidas";
import { saveSales } from "../../api/sales";
import {
  salidasPeps,
  salidasPromPonderado,
  validacionInventario,
} from "../../api/kardex";

//icons
import { TbNotesOff } from "react-icons/tb";

//styles
import style from "../../public/css/salidaStyle.module.css";

const unitArr = ["kg", "lb", "oz", "gr", "mg", "und"];

function Salidas({ id_restaurant }) {
  const [dataSelect, setDataSelect] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [dataSend, setDataSend] = useState({});
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [errosTable, setErrorsTable] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "ButterStock | ventas";

    const getData = async () => {
      setLoading(true);
      try {
        const response = await getDataSelectsSalida(id_restaurant);
        if (Array.isArray(response.message)) {
          setDataSelect(response.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const showToastMessage = () => {
    toast.success("Datos guardados con exito", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastMessageErr = () => {
    toast.error("Ha ocurrido un error", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleSelect = (values) => {
    setSelectedData(values);
  };

  const handleSend = (id, e, key) => {
    const value = e.target.value;
    let data = dataSend;
    if (data[id] == undefined) {
      data[id] = {};
    }

    data[id][key] = value;

    setDataSend(data);
  };

  const handleSubmit = () => {
    const erros = {};
    let data = dataSend;

    for (const i in selectedData) {
      const id =
        selectedData[i].id_receta != undefined
          ? selectedData[i].id_receta
          : selectedData[i].id_ingrediente;
      const type =
        selectedData[i].id_receta != undefined ? "receta" : "ingrediente";

      if (data[id] != undefined) {
        if (type == "receta") {
          if (data[id]["cantidad"] == undefined) {
            erros[id] = "*Este campo es requerido";
          } else {
            if (data[id]["cantidad"] == "") {
              erros[id] = "*Este campo es requerido";
            }
          }
        } else {
          erros[id] = {};

          if (data[id]["cantidad"] == undefined) {
            erros[id]["cantidad"] = "*Este campo es requerido";
          } else {
            if (data[id]["cantidad"] == "") {
              erros[id]["cantidad"] = "*Este campo es requerido";
            }
          }

          if (data[id]["costo_unitario"] == undefined) {
            erros[id]["costo_unitario"] = "*Este campo es requerido";
          } else {
            if (data[id]["costo_unitario"] == "") {
              erros[id]["costo_unitario"] = "*Este campo es requerido";
            }
          }

          if (data[id]["unidad"] == undefined) {
            erros[id]["unidad"] = "*Este campo es requerido";
          } else {
            if (data[id]["unidad"] == "") {
              erros[id]["unidad"] = "*Este campo es requerido";
            }
          }
        }
      }
    }

    setErrorsTable(erros);
  };

  const handleSendDataServer = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleLoadSend = async () => {
    setSending(true);

    try {
      const response = await saveSales(dataSend, id_restaurant);

      if (Array.isArray(response)) {
        //Aqui estan los ingredientes listo,
        //cabe recalcar que la unidad de medida puede ser la que tiene en la receta
        //por lo tanto toca hacer la conversion de unidades para guradarlo en peps

        // Verifico si hay ingredientes que no tienen inventario
        let sinInventario = []; // Array de ingredientes que no tienen inventario

        for (const i in response) {
          const cantidadReceta = response[i].cantidad_receta
            ? response[i].cantidad_receta
            : 1;
          const cantidad = parseFloat(response[i].cantidad) * cantidadReceta;
          const res = await validacionInventario(
            id_restaurant,
            cantidad,
            response[i].unidad_medida,
            response[i].kardex,
            response[i].id_ingrediente
          );

          if (res.data.message == "No hay suficiente inventario") {
            sinInventario.push(res.data.nombre_ingrediente);
          }
        }

        if (sinInventario.length > 0) {
          let mensaje = (
            <div>
              No hay suficiente inventario para los siguientes ingredientes:
              <br />
              {sinInventario.map((ingrediente, index) => {
                return (
                  <p key={index}>
                    <strong> - {ingrediente}</strong>
                  </p>
                );
              })}
            </div>
          );

          toast.error(mensaje, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            theme: "light",
          });

          setTimeout(() => {
            setSending(false);
            setOpen(false);
          }, 1000);
        } else {
          let enviado = false;
          for (const i in response) {
            if (response[i].kardex == "PEPS") {
              const cantidadReceta = response[i].cantidad_receta
                ? response[i].cantidad_receta
                : 1;
              const cantidad =
                parseFloat(response[i].cantidad) * cantidadReceta;
              const res = await salidasPeps(
                response[i].id_ingrediente,
                cantidad,
                response[i].unidad_medida,
                id_restaurant
              );

              if (res.data.message == "Salida registrada") {
                enviado = true;
              }
            } else {
              const cantidadReceta = response[i].cantidad_receta
                ? response[i].cantidad_receta
                : 1;
              const cantidad =
                parseFloat(response[i].cantidad) * cantidadReceta;
              const resProm = await salidasPromPonderado(
                response[i].id_ingrediente,
                cantidad,
                response[i].unidad_medida,
                id_restaurant
              );
              if (resProm.data.message == "Salida registrada") {
                enviado = true;
              }
            }
          }

          if (enviado) {
            showToastMessage();
          } else {
            toast.error("Ha ocurrido un error", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              progress: undefined,
              theme: "light",
            });
          }
        }
      } else {
        showToastMessageErr();
      }

      setTimeout(() => {
        setSending(false);
        setOpen(false);
      }, 100);
    } catch (error) {
      console.error(error);
      showToastMessageErr();
    }
  };

  return (
    <>
      <div className={style.containerSalidas}>
        {!isLoading ? (
          <div>
            <h3 className={style.titleSales}>Ingresar Ventas</h3>
            <div>
              <label htmlFor="select-data">
                Lista de ingredientes, recetas y adiciones
              </label>
              <div className={style.selectSales}>
                <Select
                  id="select-data"
                  closeMenuOnSelect={false}
                  options={dataSelect}
                  isMulti
                  onChange={handleSelect}
                />
              </div>
              <div className={style.boxTableSales}>
                {selectedData.length > 0 ? (
                  <form onSubmit={(e) => handleSendDataServer(e)}>
                    <table>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Tipo</th>
                          <th>Cantidad</th>
                          <th>Unidad de medida</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedData.map((row, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {row.id_receta != undefined
                                  ? row.nombre_receta
                                  : row.nombre_ingrediente}
                              </td>
                              {row.id_receta != undefined &&
                              row.sub_receta == 0 ? (
                                <td>Receta</td>
                              ) : null}
                              {row.id_receta != undefined &&
                              row.sub_receta == 1 ? (
                                <td>Adicion</td>
                              ) : null}
                              {row.id_ingrediente != undefined ? (
                                <td>Ingrediente</td>
                              ) : null}

                              {row.id_receta != undefined ? (
                                <td>
                                  <input
                                    className={style.inputSale}
                                    onChange={(e) =>
                                      handleSend(row.id_receta, e, "cantidad")
                                    }
                                    placeholder="Cantidad"
                                    type="number"
                                    step={"any"}
                                    min={1}
                                    required
                                  />
                                </td>
                              ) : (
                                <td>
                                  <input
                                    className={style.inputSale}
                                    onChange={(e) =>
                                      handleSend(
                                        row.id_ingrediente,
                                        e,
                                        "cantidad"
                                      )
                                    }
                                    placeholder={`Cantidad total: ${row.cantidad_max}`}
                                    type="number"
                                    step={"any"}
                                    min={1}
                                    max={row.cantidad_max}
                                    required
                                  />
                                </td>
                              )}

                              {row.id_receta != undefined ? (
                                <td></td>
                              ) : (
                                <td>
                                  <select
                                    onChange={(e) =>
                                      handleSend(
                                        row.id_ingrediente,
                                        e,
                                        "unidad"
                                      )
                                    }
                                    className={style.selectSale}
                                    required
                                  >
                                    <option value="">Ninguno</option>
                                    {unitArr.includes(row.unidad_medida) ? (
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
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <button
                      className={style.btnSubmitSale}
                      onClick={handleSubmit}
                      type="submit"
                    >
                      Ingresar Venta
                    </button>
                  </form>
                ) : (<div className={style.selectAnyIngredient}><div><TbNotesOff/></div>Seleccione un ingrediente, platillo, o preparacion</div>)}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estas seguro de guardar estos datos?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Estos datos ingresara como venta al sistema, de acuerdo al metodo
            que este tenga
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className={style.btnSaveSale}
            id="btn-salida-id"
            onClick={handleLoadSend}
            disabled={sending}
          >
            {sending ? <CircularProgress color="inherit" /> : "Aceptar"}
          </Button>
          <Button className={style.btnCancelSave} disabled={sending} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Salidas;
