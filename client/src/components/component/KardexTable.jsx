import React from "react";
import style from "../../public/css/kardexStyle.module.css";

export default function KardexTable({ kardex, ingredient }) {
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
