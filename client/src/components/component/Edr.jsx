import React, { useEffect, useState } from "react";
import style from "../../public/css/edrStyle.module.css";
import { createEdr, getDataEdr } from "../../api/edr";
import { FaCirclePlus } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { Button, TextField, IconButton } from "@mui/material"
import { Close, AddCircleOutline } from "@mui/icons-material"

export default function Edr({ id_restaurant, tipoEdr, closeModal }) {
  // const [edrData, setEdrData] = useState({});
  // const [otrosGastos, setOtrosGastos] = useState({});
  // const [inputCount, setInputCount] = useState(0);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await getDataEdr(tipoEdr, id_restaurant);
  //     if (res.data.message == "ok") {
  //       setEdrData(res.data.getData);
  //     }
  //   };
  //   fetchData();
  // }, [tipoEdr, id_restaurant]);

  // const handleAddInput = () => {
  //   const newInputCount = inputCount + 1;
  //   setInputCount(newInputCount);
  //   setOtrosGastos({
  //     ...otrosGastos,
  //     [`gasto${newInputCount}`]: {tipo: '', valor: ''},
  //   });
  // };

  // const handleRemoveInput = (inputKey) => {
  //   const { [inputKey]: removedInput, ...rest } = otrosGastos;
  //   setOtrosGastos(rest);
  //   setInputCount(inputCount - 1);
  // };

  // const handleInputChange = (e, inputKey, field) => {
  //   const { value } = e.target;
  //   setOtrosGastos({
  //     ...otrosGastos,
  //     [inputKey]: {
  //       ...otrosGastos[inputKey],
  //       [field]: value,
  //     },
  //   });
  // };

  // const renderInputs = () => {
  //   const inputs = [];
  //   for (let i = 1; i <= inputCount; i++) {
  //     const inputKey = `gasto${i}`;
  //     inputs.push(
  //       <div key={inputKey} className="inputs-otros-gastos">
  //         <input
  //           type="text"
  //           placeholder="Tipo de gasto"
  //           value={otrosGastos[inputKey]?.tipo || ""}
  //           onChange={(e) => handleInputChange(e, inputKey, 'tipo')}
  //           className="otros-gastos-field"
  //         />
  //         <input
  //           type="text"
  //           placeholder="Valor del gasto"
  //           value={otrosGastos[inputKey]?.valor || ""}
  //           onChange={(e) => handleInputChange(e, inputKey, 'valor')}
  //           className="otros-gastos-field"
  //         />
  //         <button onClick={() => handleRemoveInput(inputKey)} className="close-inputs">
  //           <FaTimes /> {/* Ícono para quitar el input */}
  //         </button>
  //       </div>
  //     );
  //   }
  //   return inputs;
  // };

  // const getJSONOtrosGastos = () => {
  //   const otrosGastoJSON = {};
  //   for (const key in otrosGastos) {
  //       if (otrosGastos[key].tipo && otrosGastos[key].valor) {
  //           otrosGastoJSON[otrosGastos[key].tipo] = Number(otrosGastos[key].valor);
  //       }
  //   }

  //   return otrosGastoJSON;
  // }

  // const otrosGastosJSON = getJSONOtrosGastos();
  // const sumOtrosGastos = Object.values(otrosGastosJSON).reduce((a, b) => a + b, 0)
  // const utilidad = edrData.totalVentas - edrData.totalCostos - sumOtrosGastos;


  // const handleSubmit = async () => {
  //   const res = await createEdr(otrosGastosJSON, id_restaurant, tipoEdr)
  //   if(res.data.message == "EDR creado") {
  //       toast.success("Estado de resultado creado", {
  //           position: "top-right",
  //           autoClose: 1000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           progress: undefined,
  //           theme: "light" 
  //       })
  //       setTimeout(() => {
  //           closeModal()
  //       }, 1500)
  //   } else if (res.data.message == "Ya el estado de resultado fue creado") {
  //       toast.warning("Ya el estado de resultado del dia fue creado", {
  //           position: "top-right",
  //           autoClose: 1500,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           progress: undefined,
  //           theme: "light" 
  //       })
  //       setTimeout(() => {
  //           closeModal()
  //       }, 2000)
  //   }
  // }

  

  // return (
  //   <div className="edr-modal">
  //     <div className="edr-modal-content">
  //       <h4 className="cerrar" onClick={closeModal}>
  //         X
  //       </h4>
  //       <div className="edr-modal-body">
  //         <h4>Total ventas del {tipoEdr == "diario" ? "dia" : "mes"}:</h4>
  //         <div>${edrData.totalVentas ? Number(edrData.totalVentas).toLocaleString() : "$0"}</div>
  //       </div>
  //       <div className="edr-modal-body">
  //         <h4>Total costos del {tipoEdr == "diario" ? "dia" : "mes"}:</h4>
  //         <div>${edrData.totalCostos ? Number(edrData.totalCostos).toLocaleString() : "$0"}</div>
  //       </div>
  //       <div className="add-otros-gastos">
  //         <h4>Añadir otros gastos</h4>
  //         <button className="add-btn" onClick={handleAddInput}>
  //           <FaCirclePlus  />
  //         </button>
  //       </div>
  //       <div className="otros-gastos-inputs">
  //           {renderInputs()}
  //       </div>
  //       <div className="edr-modal-utilidad">
  //           <h4>Utilidad:</h4>
  //           <div>${utilidad.toLocaleString()}</div>
  //       </div>
  //       <div className="edr-modal-btn">
  //           <button onClick={handleSubmit}>Guardar</button>
  //       </div>
  //     </div>
  //   </div>
  // );
  const [edrData, setEdrData] = useState({});
  const [otrosGastos, setOtrosGastos] = useState({});
  const [inputCount, setInputCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDataEdr(tipoEdr, id_restaurant);
      if (res.data.message === "ok") {
        setEdrData(res.data.getData);
      }
    };
    fetchData();
  }, [tipoEdr, id_restaurant]);

  const handleAddInput = () => {
    const newInputCount = inputCount + 1;
    setInputCount(newInputCount);
    setOtrosGastos({
      ...otrosGastos,
      [`gasto${newInputCount}`]: { tipo: "", valor: "" },
    });
  };

  const handleRemoveInput = (inputKey) => {
    const { [inputKey]: removedInput, ...rest } = otrosGastos;
    setOtrosGastos(rest);
    setInputCount(inputCount - 1);
  };

  const handleInputChange = (e, inputKey, field) => {
    const { value } = e.target;
    setOtrosGastos({
      ...otrosGastos,
      [inputKey]: {
        ...otrosGastos[inputKey],
        [field]: value,
      },
    });
  };

  const renderInputs = () => {
    const inputs = [];
    for (let i = 1; i <= inputCount; i++) {
      const inputKey = `gasto${i}`;
      inputs.push(
        <div key={inputKey} className={style.inputs_otros_gastos}>
          <TextField
            type="text"
            placeholder="Tipo de gasto"
            value={otrosGastos[inputKey]?.tipo || ""}
            onChange={(e) => handleInputChange(e, inputKey, "tipo")}
            className={style.otros_gastos_field}
          />
          <TextField
            type="text"
            placeholder="Valor del gasto"
            value={otrosGastos[inputKey]?.valor || ""}
            onChange={(e) => handleInputChange(e, inputKey, "valor")}
            className={style.otros_gastos_field}
          />
          <IconButton onClick={() => handleRemoveInput(inputKey)} className={style.close_inputs}>
            <Close />
          </IconButton>
        </div>
      );
    }
    return inputs;
  };

  const getJSONOtrosGastos = () => {
    const otrosGastoJSON = {};
    for (const key in otrosGastos) {
      if (otrosGastos[key].tipo && otrosGastos[key].valor) {
        otrosGastoJSON[otrosGastos[key].tipo] = Number(otrosGastos[key].valor);
      }
    }

    return otrosGastoJSON;
  };

  const otrosGastosJSON = getJSONOtrosGastos();
  const sumOtrosGastos = Object.values(otrosGastosJSON).reduce((a, b) => a + b, 0);
  const utilidad = edrData.totalVentas - edrData.totalCostos - sumOtrosGastos;

  const handleSubmit = async () => {
    const res = await createEdr(otrosGastosJSON, id_restaurant, tipoEdr);
    if (res.data.message === "EDR creado") {
      toast.success("Estado de resultado creado", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } else if (res.data.message === "Ya el estado de resultado fue creado") {
      toast.warning("Ya el estado de resultado del dia fue creado", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
  };

  return (
    <div className={style.edr_modal}>
      <div className={style.edr_modal_content}>
        <h4 className={style.cerrar}>
          <IconButton className={style.close_button} onClick={closeModal}>
            <Close />
          </IconButton>
        </h4>
        <div className={style.edr_modal_body}>
          <h4>Total ventas del {tipoEdr === "diario" ? "dia" : "mes"}:</h4>
          <div>${edrData.totalVentas ? Number(edrData.totalVentas).toLocaleString() : "$0"}</div>
        </div>
        <div className={style.edr_modal_body}>
          <h4>Total costos del {tipoEdr === "diario" ? "dia" : "mes"}:</h4>
          <div>${edrData.totalCostos ? Number(edrData.totalCostos).toLocaleString() : "$0"}</div>
        </div>
        <div className={style.add_otros_gastos}>
          <h4>Añadir otros gastos</h4>
          <Button className={style["add-btn"]} onClick={handleAddInput}>
            <AddCircleOutline />
          </Button>
        </div>
        <div className={style.otros_gastos_inputs}>{renderInputs()}</div>
        <div className={style.edr_modal_utilidad}>
          <h4>Utilidad:</h4>
          <div>${utilidad.toLocaleString()}</div>
        </div>
        <div className={style.edr_modal_btn}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
