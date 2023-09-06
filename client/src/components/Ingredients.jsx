import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  banIngredient,
  getIngredients,
  unbanIngredient,
} from "../api/ingredients";
import Navbar from "./reuseComponents/navbar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DataTable from "react-data-table-component";
import "../public/css/ingredientsStyle.css";
import { toast } from "react-toastify";

export default function Ingredients() {
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    document.title = "Ingredientes";
    const res = async () => {
      const response = await getIngredients(id).then(setLoading(false));
      setIngredients(response.ingredientes);
    };
    res();
  }, []);

  const toastDangerDelete = () => {
    toast.error("Ingrediente eliminado", {
      position: "top-right",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
    });
  };

  const columns = [
    {
      name: "Ingrediente",
      selector: (row) => row.nombre_ingrediente,
    },
    {
      name: "Unidad de medida",
      selector: (row) => row.unidad_medida,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad_total_ingrediente,
    },
    {
      name: "Costo unitario",
      selector: (row) => row.costo_unitario,
    },
    {
      name: "Cantidad porción a elaborar",
      selector: (row) => row.cantidad_porcion_elaborar,
    },
    {
      name: "Costo total",
      selector: (row) => row.costo_total,
    },
    {
      name: "Porcentaje de participación",
      selector: (row) => row.porcentaje_participacion,
    },
    {
      name: "Acciones",
      cell: (row) =>
        row.ingrediente_activo == 1 ? (
          <div>
            <button
              className="btn btn-danger"
              onClick={async () => {
                const res = await banIngredient(row.id_ingrediente);
                if (res.message == "Ingrediente eliminado") {
                  window.location.reload();
                } else {
                  toastDangerDelete();
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ) : (
          <div>
            <button
              className="btn btn-success"
              onClick={async () => {
                const res = await unbanIngredient(row.id_ingrediente);
                if (res.message == "Ingrediente activado") {
                  window.location.reload();
                } else {
                  toastDangerDelete();
                }
              }}
            >
              Activar
            </button>
          </div>
        ),
    },
  ];

  const expandableRowsRecipe = (row) => {
    const columns = [
      {
        name: "Imagen",
        selector: (row) => (
          <>
            <img src={row.imagen} alt="receta" className="img_receta" />
          </>
        ),
        style: {
          background: "#ffea96",
          marginTop: "10px",
        },
      },
      {
        name: "Receta",
        selector: (row) => row.nombre_receta,
        style: {
          background: "#ffea96",
          marginTop: "10px",
        },
      },
      {
        name: "Cantidad por plato",
        selector: (row) => row.cantidad_plato,
        style: {
          background: "#ffea96",
          marginTop: "10px",
        },
      },
      {
        name: "Uso de ingrediente",
        selector: (row) => row.cantidad_por_receta,
        style: {
          background: "#ffea96",
          marginTop: "10px",
        },
      },
      {
        name: "Costo total",
        selector: (row) => row.cantidad_plato * row.cantidad_por_receta,
        style: {
          background: "#ffea96",
          marginTop: "10px",
        },
      },
      {
        name: "Sub receta",
        selector: (row) => (row.sub_receta == 1 ? "Si" : "No"),
        style: {
          background: "#ffea96",
          marginTop: "10px",
        },
      },
    ];
    return (
      <>
        <section className="expandable_data">
          <DataTable
            columns={columns}
            data={row.data.recetas}
            responsive={true}
            pagination
          />
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="loding-resipe-homepage">
          <AiOutlineLoading3Quarters />
        </div>
      ) : (
        <section className="father_all_ingredients">
          <DataTable
            columns={columns}
            responsive={true}
            data={ingredients}
            pointerOnHover
            pagination
            expandOnRowClicked
            expandableRows
            highlightOnHover
            subHeader
            expandableRowExpanded={(row) => row.expandableRowExpanded}
            expandableRowsComponent={(row) => expandableRowsRecipe(row)}
          />
        </section>
      )}
    </>
  );
}
