import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getKardex } from "../api/kardex";
import Navbar from "./reuseComponents/navbar";
import KardexTable from "./component/KardexTable";

export default function Kardex() {
  const { id_ingrediente, id } = useParams();
  const [kardex, setKardex] = useState([]);
  const [ingredient, setIngredient] = useState("");

  useEffect(() => {
    document.title = "Kardex";
    const res = async () => {
      const response = await getKardex(id_ingrediente);
      setKardex(response.data.kardex);
      setIngredient(response.data.ingrediente);
    };
    res();
  }, []);

  return (
    <>

      <Navbar restaurant = {id}/>
      <KardexTable kardex={kardex} ingredient={ingredient} />

      {/* <Navbar restaurant = {id}/>
      <section className="kardex_table">
        <div className="name_ingredient">{ingredient}</div>
        <div className="container_table">
          <table className="peps_table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th colSpan="3">Entradas</th>
                <th colSpan="3">Salidas</th>
                <th colSpan="3">Saldo</th>
              </tr>
              <tr>
                <th></th>
                <th className="small_th">Cantidad</th>
                <th className="small_th">Costo</th>
                <th className="small_th">Total</th>
                <th className="small_th">Cantidad</th>
                <th className="small_th">Costo</th>
                <th className="small_th">Total</th>
                <th className="small_th">Cantidad</th>
                <th className="small_th">Costo</th>
                <th className="small_th">Total</th>
              </tr>
            </thead>
            <tbody className="peps_tbody">{rows}</tbody>
          </table>
        </div>
      </section> */}

    </>
  );
}
