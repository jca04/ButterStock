import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getIngredients } from "../api/ingredients";
import Navbar from "./reuseComponents/navbar";
import DataTable from "react-data-table-component";
import { MdOutlineInventory } from "react-icons/md";
import {AiOutlineSearch} from 'react-icons/ai';
import "../public/css/inventoryStyle.css";
import Load from "./reuseComponents/loadRender";

export default function Inventory() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'ButterStock | inventario';
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
        <button className="btn-send-kardex">
           <Link to={`/kardex/${row.id_ingrediente}/${id}`} target="_blank" className="btn-kardex">
            Ver kardex
          </Link>
        </button>
      ),
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const searchKardex = (value) => {
      console.log(data)
      const resulData = [];
      for (const i in data){
        const nameIngredient = data[i].nombre_ingrediente;
        const kardex = data[i].kardex;
      }
  }

  return (
    <>
      <Navbar restaurant = {id} />
      {isLoading ? (
        <Load/>
      ): (
      <section className="body-inventory-father">
        <section className="father_inventario">
          <div className="header-inventory">
            <MdOutlineInventory className="icon-inventory" />
            <h3>Inventario</h3>
          </div>
          <div className="body-inventory">
            <div className="search-inventory">
              <div className="div-input-search">
                <div>
                <AiOutlineSearch  className="icon-search-recipe"/>
                    <input type="text" onChange={(e) => searchKardex(e.target.value)} className="input-search-inventory" placeholder="Buscar"/>
                </div>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={data}
              pagination
              paginationPerPage={10}
              responsive
              striped
              paginationComponentOptions={paginationComponentOptions}
            />
          </div>
        </section>
      </section>
      )}
    </>
  );
}
