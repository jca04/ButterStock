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
      <section className={style.KardexTable}>
        <header className={style.headerKardex}>{ingredient}</header>
        <div className="container_table">
          <table className={style.table}>
            <thead>
              <tr>
                <th  className={style.thFa}>Fecha</th>
                <th colSpan="3" className={style.thFa}>Entradas</th>
                <th colSpan="3" className={style.thFa}>Salidas</th>
                <th colSpan="3" className={style.thFa}>Saldo</th>
              </tr>
              <tr>
                <th></th>
                <th className={style.samllTh}>Cantidad</th>
                <th className={style.samllTh}>Costo</th>
                <th className={style.samllTh}>Total</th>
                <th className={style.samllTh}>Cantidad</th>
                <th className={style.samllTh}>Costo</th>
                <th className={style.samllTh}>Total</th>
                <th className={style.samllTh}>Cantidad</th>
                <th className={style.samllTh}>Costo</th>
                <th className={style.samllTh}>Total</th>
              </tr>
            </thead>
            <tbody className="peps_tbody">{rows}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
