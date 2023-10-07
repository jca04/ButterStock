import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getKardex } from "../api/kardex";
import Navbar from "./reuseComponents/navbar";
import "../public/css/kardexStyle.css";

export default function Kardex() {
  const { id_ingrediente } = useParams();
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

  const fechaLocal = (fecha) => {
    const fechaLocal = new Date(fecha);
    return fechaLocal.toLocaleString();
  };

  const rows = kardex.map((item, index) => (
    <tr key={index}>
      <td>{fechaLocal(item.time_stamp)}</td>
      <td>{item.entrada_cantidad}</td>
      <td>{item.entrada_valorUnitario}</td>
      <td>{item.entrada_valorTotal}</td>
      <td>{item.salida_cantidad}</td>
      <td>{item.salida_valorUnitario}</td>
      <td>{item.salida_valorTotal}</td>
      <td>{item.saldo_cantidad}</td>
      <td>{item.saldo_valorUnitario}</td>
      <td>{item.saldo_valorTotal}</td>
    </tr>
  ));

  return (
    <>
      <Navbar />
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
      </section>
    </>
  );
}
