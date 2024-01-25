import React, { useState, useEffect } from "react";
import style from "../public/css/comandasStyle.module.css";
import { getIngredients } from "../api/ingredients";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { entradasPeps, entradasPromPonderado, salidasPeps, validacionInventario } from "../api/kardex";
import { toast } from "react-toastify";
import {AiOutlineCloseCircle} from 'react-icons/ai';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Load from "./reuseComponents/loadRender";


const unitArr = ['kg','lb','oz','gr','mg','und'];

export default function Comandas({ closeModal, id_restaurant }) {
 
  document.title = "ButterStock | Compras";

  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [entradasData, setEntradasData] = useState([]);
  const [isLoad, setLoading] = useState(true);
  const [dataCost, setCost] = useState({});
  const [total, setTotal] = useState(0);
  const [isSubmiting, setSubmiting] = useState(false);
 
  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await getIngredients(id_restaurant);
      setIngredients(response.ingredientes);
      setLoading(false);
    }
    fetchIngredients();
  }, [])


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

  const handleSubmitEntradas = async (e) => {
    e.preventDefault();

    let entradaRegistrada = false

    for (let i = 0; i < filterIngredients.length; i++) {
      const cantidad = parseFloat(filterIngredients[i].cantidad);
      const costo_unitario = parseFloat(filterIngredients[i].costo_unitario);

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

  const options = [];
  const animatedComponents = makeAnimated();

  ingredients?.map((ingredient) => {
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

  const valueBuys = (e, row, type) => {
    e.preventDefault();
    const value = e.target.value;
    const id_ingrediente = row.value;
    const data = dataCost;

    if (data[id_ingrediente] == undefined){
      data[id_ingrediente] = {};
    }

    if (type == 'input-1'){
      data[id_ingrediente]['cantidad'] = value == '' ? 0 : parseFloat(value);
    }else{
      data[id_ingrediente]['costUnit'] = value == '' ? 0 : parseFloat(value);
    }
    
    data[id_ingrediente]['exits'] = true;

    //function sumatoria
    sumTotal(data);
    //stado costos
    setCost(data);
  }

  const refreshTotalBuys = (ingredient) => {
    const data = dataCost;
    const ingredientsSelected  = ingredient;

    for (const i in data){
      data[i]['exits'] = false;
    }

    for (const i in ingredientsSelected){
      const id = ingredientsSelected[i].value;

      if (data[id] != undefined){
        data[id]['exits'] = true;
      }
    }

    sumTotal(data);
  }

  const sumTotal = (data) => {
    let sumatoria = 0
    for (const i in data){
      if (data[i]['cantidad'] != undefined && data[i]['costUnit'] && data[i]['exits']){
        const cant = data[i]['cantidad'];
        const cost = data[i]['costUnit'];
        const total = cant * cost;
        sumatoria = sumatoria + total;
      }
    }
    setTotal(sumatoria);
  }
  
  return (
    <>
    <div className="modal_container">
      <div className="modal_content">
      {!isLoad ? (
        <>
        <button className="btn-close-modal-comandas" onClick={closeModal}><AiOutlineCloseCircle/> Cerrar</button>
        <div className="comandas_container">
          <h3><ShoppingCartIcon/>Ingresar Compras</h3>
          <div className="select-container">
            <label htmlFor="select-entradas">Seleccionar las compras </label>
            <Select 
              closeMenuOnSelect = {false} 
              components={animatedComponents} 
              options={options} 
              isMulti
              className="select-ingredients"
              id="select-entradas"
              onChange={(e) => {handleSelect(e); refreshTotalBuys(e)}}
              value={selectedIngredients}
            />
          </div>
          <div className="table_container">
            {
              selectedIngredients.length > 0 ?
                <form onSubmit={(e) => handleSubmitEntradas(e)} className="table-entradas-form">
                  <div className="list-entradas"><p><ReceiptLongIcon/>Lista de compras</p></div>
                  <table>
                    <thead>
                      <tr>
                        <th>Ingrediente</th>
                        <th>Cantidad</th>
                        <th>Unidad de medida</th>
                        <th>Costo Unitario</th>
                        <th>Valor compra</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      selectedIngredients.map((ingredient, index) => {
                        return (
                          <tr key={index}>
                            <td>{ingredient.label}</td>
                            <td>
                              <input type="number" min= "1" step={'any'} className="input-entrada" placeholder="Ingrese la cantidad" required
                                onChange={(e) => {
                                  handleEntradas(ingredient.value, "cantidad", e.target.value, ingredient.kardex);
                                  valueBuys(e, ingredient, 'input-1')
                                }}
                              />
                            </td>
                            <td>
                              <select defaultValue={ingredient.unidad_medida} onChange={(e) => handleEntradas(ingredient.value, "unidad_medida", e.target.value, ingredient.kardex)} required>
                                <option value="">Ninguno</option>
                                {unitArr.includes(ingredient.unidad_medida) ? (
                                  <>
                                    <option value="und">und</option>
                                    <option value="kg">kg</option>
                                    <option value="lb">lb</option>
                                    <option value="gr">gr</option>
                                    <option value="oz">oz</option>
                                  </>
                                ): (
                                  <>
                                    <option value="lt">lt</option>
                                    <option value="cm3">cm3</option>
                                    <option value="ml">ml</option>
                                </>
                                )}
                              </select>
                            </td>
                            <td> 
                              <input type="number" min="1" className="input-entrada" placeholder="Ingrese el costo unitario" required
                                onChange={(e) => {
                                  handleEntradas(ingredient.value, "costo_unitario", e.target.value, ingredient.kardex);
                                  valueBuys(e, ingredient, 'input-2')
                                }}
                              />
                            </td>
                            <td>
                                {dataCost[ingredient.value] != undefined 
                                 && dataCost[ingredient.value]['cantidad'] != undefined && 
                                 dataCost[ingredient.value]['costUnit'] != undefined ? 
                                  (`$${dataCost[ingredient.value]['cantidad'] * dataCost[ingredient.value]['costUnit']}`) : null
                                }
                            </td>
                          </tr>
                        )
                      })
                    }
                    {JSON.stringify(dataCost) != '{}' ? (
                      <tr>
                        <td className="td-total"></td>
                        <td className="td-total"></td>
                        <td className="td-total"></td>
                        <td className="td-total"></td>
                        <td>
                          <div className="div-total">total </div> 
                          <div className="div-txt-total">{`$ ${total}`}</div>
                       </td>
                      </tr>
                    ): null}
                    </tbody>
                  </table>
                  <button type="submit"  className="btn-ingresar-entrada">Ingresar Compra</button>
                </form>
                :
                null
                }
              </div>
            </div>
            </>
           ) : ( <Load/>) }
      </div>
    </div>
    </>
  )
}
