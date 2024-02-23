import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIngredients } from "../api/ingredients";
import style from "../public/css/inventoryStyle.module.css";

import { verifyUrl } from "../auth/verifyUrl";

//import components
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DataTable from "react-data-table-component";
import Navbar from "./reuseComponents/navbar";
import Kardex from "./Kardex";
import CircularProgress from "@mui/material/CircularProgress";

//icons
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineSearch } from "react-icons/ai";



export default function Inventory() {
  let { id } = useParams();
  id = verifyUrl(id)

  const [data, setData] = useState([]);
  const [data_search, setDataSearch] = useState([]);
  const [loadKardexComponent, setKardex] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [modalTable, setModalTable] = useState(false);

  useEffect(() => {
    document.title = "ButterStock | inventario";

    const res = async () => {
      const response = await getIngredients(id);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setData(response.ingredientes);
    };
    res();
  }, []);

  const columns = [
    {
      name: "Ingrediente",
      selector: (row) => row.nombre_ingrediente,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad_total_ingrediente,
    },
    {
      name: "Unidad de medida",
      selector: (row) => row.unidad_medida,
    },
    {
      name: "Kardex",
      selector: (row) => (row.kardex == "" ? "Promedio ponderado" : row.kardex),
    },
    {
      name: "Ver kardex",
      cell: (row) => (
        <button className={style.btnShowKardex} onClick={() => loadKardex(row.id_ingrediente, id)}>
            Ver kardex
        </button>
      ),
    },
  ];

  const searchKardex = (value) => {

    let resulData = [];

    data.filter((row) => {
      const cantidad_total_ingrediente = JSON.stringify(row.cantidad_total_ingrediente).toLowerCase();
      const nombre_ingrediente = row.nombre_ingrediente.toLowerCase();
      const unidad_medida = row.unidad_medida.toLowerCase();
      const kardex = row.kardex.toLowerCase();
      const text_to_search = value.toLowerCase();

      if (
        cantidad_total_ingrediente.includes(text_to_search) ||
        nombre_ingrediente.includes(text_to_search) ||
        unidad_medida.includes(text_to_search) ||
        kardex.includes(text_to_search)
      ){
        resulData.push(row);
      }

      setDataSearch(resulData);

    });
  };


  const loadKardex = (id_ingrediente, id_restaurante) => {
    setKardex([id_ingrediente, id_restaurante]);
    setModalTable(true)
  }

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className={style.globalFather}>
      <Navbar restaurant={id} />
      <section className={style.bodyInventory}>
        <header className={style.headerInventory}>Inventario</header>
        <div className={style.bodyPartInventory}>
          <div className={style.searchInventory}>
            <div className={style.boxInput}>
              <AiOutlineSearch />
              <input
                type="text"
                onChange={(e) => searchKardex(e.target.value)}
                placeholder="Buscar"
              />
            </div>
          </div>
         {!isLoading ? (
          <DataTable
            columns={columns}
            data={data_search.length == 0  ? data : data_search}
            pagination
            paginationPerPage={10}
            responsive
            striped
            paginationComponentOptions={paginationComponentOptions}
          />
        ):  <div className={style.loadingInventory}><CircularProgress color="inherit" /></div>}
        </div>
      </section>
      {modalTable ? (
        <>
        <Dialog
        open={modalTable}
        className={style.modalKardex}
      >
        <button className={style.btnCloseKardex} onClick={() => {setKardex([]); setModalTable(false)}}><AiOutlineCloseCircle/></button>
        <DialogContent>
          <Kardex id_ingrediente = {loadKardexComponent[0]} />
        </DialogContent>
      </Dialog>
      </>
      ) : (null)}
    </div>
  );
}
