import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Select from "react-select";
import { toast } from "react-toastify";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { getDataSelectsSalida } from "../../api/salidas";
import { saveSales } from "../../api/sales";
import { salidasPeps, salidasPromPonderado, validacionInventario } from "../../api/kardex";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Load from "../reuseComponents/loadRender";
import '../../public/css/salidaStyle.css';

function Salidas({closeModal, id_restaurant }) {
  const [dataSelect, setDataSelect] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [dataSend, setDataSend] = useState({});
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [errosTable, setErrorsTable] = useState({});
  const unitArr = ["kg", "lb", "oz", "gr", "mg", "und"];
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    document.title = 'ButterStock | ventas';

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadSend = async () => {
    setSending(true);

    try {
      const response = await saveSales(dataSend);

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
                return <p key={index}><strong> - {ingrediente}</strong></p>;
              })}
            </div>
          )

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
      }, 1000);
    } catch (error) {
      console.error(error);
      showToastMessageErr();
    }
  };

  return (
    <>
          
        <div className="modal_container">
          {!isLoading ? (
            <div className="modal_content">
              <h3 className="title-salida"><ExitToAppIcon />Ingresar Ventas</h3>
              <button className="btn-close-modal-comandas" onClick={closeModal}><AiOutlineCloseCircle/> Cerrar</button>
              <div className="selects-salidas">
                <label htmlFor="select-data" className="label-select">
                  Lista de ingredientes, recetas y adiciones
                </label>
                <div className="select_recipes">
                  <Select
                    id="select-data"
                    className="select-salidas"
                    closeMenuOnSelect={false}
                    options={dataSelect}
                    isMulti
                    onChange={handleSelect}
                  />
                </div>
                <div className="select_ingredient_adition">
                  {selectedData.length > 0 ? (
                    <div className="table-salida">
                      <form onSubmit={(e) => handleSendDataServer(e)}>
                      <div className="list-salidas"><p><ReceiptLongIcon/>Lista de ventas</p></div>
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
                                    {row.id_receta != undefined ? row.nombre_receta: row.nombre_ingrediente}
                                  </td>
                                  {row.id_receta != undefined && row.sub_receta == 0 ? ( <td>Receta</td>) : null}
                                  {row.id_receta != undefined && row.sub_receta == 1 ? ( <td>Adicion</td>) : null}
                                  {row.id_ingrediente != undefined ? (<td>Ingrediente</td> ) : null}

                                  {row.id_receta != undefined ? (
                                    <td>
                                      <input
                                        className="input-salida"
                                        onChange={(e) =>
                                          handleSend(
                                            row.id_receta,
                                            e,
                                            "cantidad"
                                          )
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
                                        className="input-salida"
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
                                        className="input-salida"
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
                          className="salida-button"
                          onClick={handleSubmit}
                          type="submit"
                        >
                          Ingresar Venta
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (<Load/>)}
        </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estas seguro de guardar estos datos?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Estos datos ingresara como salidas al sistema, de acuerdo al metodo
            que este tenga
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="btn-cancel-salida btn-salida"
            onClick={handleClose}
            disabled={sending}
          >
            Cancelar
          </Button>
          <Button
            className="btn-acept-salida btn-salida"
            onClick={handleLoadSend}
            autoFocus
          >
            {sending ? (<CircularProgress />) : ("Aceptar")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Salidas;
