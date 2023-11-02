import React, { useState, useEffect } from "react";
import "../public/css/comandasStyle.css";
import { getIngredients } from "../api/ingredients";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { entradasPeps, entradasPromPonderado, salidasPeps } from "../api/kardex";
import { toast } from "react-toastify";
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {RxEnter} from 'react-icons/rx';
import Salidas from "./component/salidas"; 

export default function Comandas({ closeModal, id_restaurant }) {
 
  document.title = "ButterStock | Comandas";

  const [ingredients, setIngredients] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [entradasData, setEntradasData] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await getIngredients(id_restaurant);
      setIngredients(response.ingredientes)
    }
    fetchIngredients();
  }, [])


  const handleKardex = (e) => {
    e.preventDefault();
    setSelectedOption(e.target.value);
  }

  const handleSelect = (selectedValues) => {
    setSelectedIngredients(selectedValues);
  }

  const toastEntradaIngresada = () => {
    toast.success("Entrada registrada",{ 
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light"
    }) 
  }

  const toastSalidaIngresada = () => {
    toast.success("Salida registrada", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light"
    })
  }

  // Entradas

  const handleEntradas = (ingredientId, fieldName, value, kardex) => {
    const updateEntradasData = [...entradasData];

    const existingEntry = updateEntradasData.find((entry) => entry.id_ingrediente === ingredientId);

    if (existingEntry) {
      existingEntry[fieldName] = value;
      existingEntry.kardex = kardex;
    } else {
      const newEntry = {
        id_ingrediente: ingredientId,
        [fieldName]: value,
        kardex: kardex
      };
      updateEntradasData.push(newEntry);
    }

    setEntradasData(updateEntradasData);
  }

  // Filtro del estado de entradasData los ingredientes que se saquen del select 
  const filterIngredients = entradasData.filter((entrada) => {
    return selectedIngredients.some((selectedIngredient) => entrada.id_ingrediente === selectedIngredient.value)
  })

  const handleSubmitEntradas = async () => {

    let entradaRegistrada = false

    for (let i = 0; i < filterIngredients.length; i++) {
      const cantidad = parseFloat(filterIngredients[i].cantidad);
      const costo_unitario = parseFloat(filterIngredients[i].costo_unitario);
      console.log(filterIngredients[i].unidad_medida);

      if (!isNaN(cantidad) && !isNaN(costo_unitario)) {
        if (filterIngredients[i].kardex === "PEPS") {
          const response = await entradasPeps(
            filterIngredients[i].id_ingrediente, 
            filterIngredients[i].cantidad, 
            filterIngredients[i].costo_unitario, 
            filterIngredients[i].unidad_medida, 
            id_restaurant
          );
          if (response.data.message === "Entrada registrada") {
            entradaRegistrada = true
          }
        } else if(filterIngredients[i].kardex === "Promedio ponderado") {
          const response = await entradasPromPonderado(
            filterIngredients[i].id_ingrediente,
            filterIngredients[i].cantidad,
            filterIngredients[i].costo_unitario,
            filterIngredients[i].unidad_medida,
            id_restaurant
          );
          console.log(response);
          if (response.data.message === "Entrada registrada") {
            entradaRegistrada = true
          }
        }
      }
    }

    if (entradaRegistrada) {
      toastEntradaIngresada();
      setSelectedIngredients([]);
    }
  }


  /////////////////////////////// ----------------------------------------- ///////////////////////////////

  //Salidas

  const handleSubmitSalidas = async () => {
    let salidaRegistrada = false

    for (let i = 0; i < filterIngredients.length; i++) {
      const cantidad = parseFloat(filterIngredients[i].cantidad);

      if (!isNaN(cantidad)) {
        if (filterIngredients[i].kardex === "PEPS") {
          const response = await salidasPeps(
            filterIngredients[i].id_ingrediente,
            filterIngredients[i].cantidad,
            filterIngredients[i].unidad_medida,
            id_restaurant
          );
          if (response.data.message === "Salida registrada") {
            salidaRegistrada = true
          }
        }
      }
    }

    if (salidaRegistrada) {
      toastSalidaIngresada();
      setSelectedIngredients([]);
    }
  }


  const options = [];

  const animatedComponents = makeAnimated();

  ingredients.map((ingredient) => {
    options.push({
      value: ingredient.id_ingrediente,
      label: ingredient.nombre_ingrediente,
      nombre: ingredient.nombre_ingrediente,
      unidad_medida: ingredient.unidad_medida,
      cantidad_total: ingredient.cantidad_total_ingrediente,
      costo_unitario: ingredient.costo_unitario,
      costo_total: ingredient.costo_total,
      kardex: ingredient.kardex
    })
  })

  
  return (
    <div className="modal_container">
      <div className="modal_content">
        <button className="btn-close-modal-comandas" onClick={closeModal}><AiOutlineCloseCircle/> Cerrar</button>
        <div className="btns-entradas-salidas">
          <button value="entradas" onClick={handleKardex}>Entradas</button>
          <button value="salidas" onClick={handleKardex}>Salidas</button>
        </div>
        {
          selectedOption === "entradas" ?
            <div className="comandas_container">
              <h3>Ingresar Entradas</h3>
              <div className="select-container">
                <Select 
                  closeMenuOnSelect = {false} 
                  components={animatedComponents} 
                  options={options} 
                  isMulti
                  className="select-ingredients"
                  onChange={handleSelect}
                  value={selectedIngredients}
                />
              </div>
              <div className="table_container">
                {
                  selectedIngredients.length > 0 ?
                  <table>
                  <thead>
                    <tr>
                      <th>Ingrediente</th>
                      <th>Cantidad</th>
                      <th>Costo Unitario</th>
                      <th>Unidad de medida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      selectedIngredients.map((ingredient, index) => {
                        return (
                          <tr key={index}>
                            <td>{ingredient.label}</td>
                            <td>
                              <input type="number" min= "1" 
                                onChange={(e) => {
                                  handleEntradas(ingredient.value, "cantidad", e.target.value, ingredient.kardex)
                                }}
                              />
                            </td>
                            <td>
                              <input type="number" min="1" 
                                onChange={(e) => {
                                  handleEntradas(ingredient.value, "costo_unitario", e.target.value, ingredient.kardex)
                                }}
                              />
                            </td>
                            <td>
                              <select onChange={(e) => handleEntradas(ingredient.value, "unidad_medida", e.target.value, ingredient.kardex)}>
                                <option value="" disabled>Unidad</option>
                                <option value="und">und</option>
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                                <option value="gr">gr</option>
                                <option value="oz">oz</option>
                              </select>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                :
                null
                }
              </div>

              {
                selectedIngredients.length > 0 ?
                <button className="btn-ingresar-entrada" onClick={handleSubmitEntradas}>Ingresar Entrada</button>
                : null
              }
            </div>
            :
            selectedOption === "salidas" ?
              <div className="comandas_container">
                <h3>Salidas</h3>
                  <Salidas id_restaurant={id_restaurant} />
              </div>
            : null
          }
      </div>
    </div>
  )
}
