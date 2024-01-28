import React, { useRef, useEffect, useState, useMemo } from "react";
import Navbar from "../reuseComponents/navbar";
import style from "../../public/css/allRestaurantStyle.module.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAllRestaurants, toggleRestaurante } from "../../api/restaurant.js";
import DataTable from "react-data-table-component";

function AllRestaurant() {
  const [stataRestaurant, setRestaurants] = useState([]);
  const [pending, setPending] = useState(true);
  const [currentRow, setCurrentRow] = useState(null);
  const [stateResSearch, setStateSearch] = useState([]);
  document.title = "Restaurantes";

  useEffect(() => {
    const fecthData = async () => {
      try {
        const res = await getAllRestaurants();
        let dataRes = res.data.result;
        setRestaurants(dataRes);
        setPending(false);
        console.log(dataRes);
      } catch (error) {
        console.log(error);
      }
    };

    fecthData();
  }, []);

  //desactivar o activar un restaurante
  const toggleDeAc = async (id, e, value) => {
    e.target.setAttribute("disabled", "true");
    e.target.classList.add("disable-btn");

    const response = await toggleRestaurante(id, value);
    try {
      if (response) {
        let newData = stataRestaurant.map((row) => {
          if (row.id_restaurant === id) {
            row.activo = value;
            return row;
          } else {
            return row;
          }
        });

        e.target.removeAttribute("disabled");
        e.target.classList.remove("disable-btn");
        setRestaurants(newData);
      } else {
      }
    } catch (error) {}
  };

  const columns = [
    {
      name: "id_restaurante",
      selector: (row) => row.id_restaurant,
      width: "100px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      width: "250px",
    },
    {
      name: "Ciudad",
      selector: (row) => row.ciudad,
      width: "200px",
    },
    {
      name: "Direccion",
      selector: (row) => row.direccion,
      width: "200px",
    },
    {
      name: "Creacion",
      selector: (row) => row.time_stamp,
    },
    {
      name: "Estado",
      selector: (row) => (row.activo == 1 ? "si" : "no"),
      width: "70px",
    },
    {
      name: "sucursales",
      selector: (row) => (row.sucursal == null ? "no" : "si"),
      width: "100px",
    },
    {
      name: "Accion",
      cell: (row) =>
        row.activo == 1 ? (
          <button
            className="btn-allrestaurant-desactive"
            id={row.id_restaurant}
            onClick={(e) => toggleDeAc(row.id_restaurant, e, 0)}
          >
            Desactivar
          </button>
        ) : (
          <button
            className="btn-allrestaurant-active"
            onClick={(e) => toggleDeAc(row.id_restaurant, e, 1)}
            id={row.id_restaurant}
          >
            Activar
          </button>
        ),
    },
  ];

  //cuando se hace click encima de una fila en la tabla
  //se despliega para consultar datos como por ejemplo si tiene sucursales
  const onRowClicked = (row, event) => {
    console.log(row);
  };

  const subHeaderComponent = useMemo(() => {
    return <input type="text" onInput={(e) => search(e.target.value)} />;
  });

  const expandableComponent = (row) => {
    return (
      <pre>{JSON.stringify(row, null, 2)}</pre>
    )
  }

  //buscar en la tabla
  const search = (value) => {
    if (value.length > 0) {
      let valueSearch = [];
      let dataLocal = stataRestaurant;

      for (var i in dataLocal) {
        let jsonLocal = dataLocal[i];
        for (var f in jsonLocal) {
          if (jsonLocal[f] !== "" && jsonLocal[f] !== null) {
            let merching = jsonLocal[f];
            if (typeof jsonLocal[f] == "number") {
              merching = JSON.stringify(jsonLocal[f]);
            }

            if (merching.toLowerCase().includes(value.toLowerCase())) {
              valueSearch.push(jsonLocal);
              break;
            }
          }
        }
      }

      setStateSearch(valueSearch);
    } else {
      setStateSearch([]);
    }
  };

  return (
    <>
      <Navbar />
      <section className="section-faher-allrestaurants">
        <DataTable
          title="Restaurantes"
          columns={columns}
          data={stateResSearch.length == 0 ? stataRestaurant : stateResSearch}
          pagination
          responsive
          expandOnRowClicked
          expandableRows
          highlightOnHover
          pointerOnHover
          subHeader
          subHeaderComponent={subHeaderComponent}
          progressPending={pending}
          expandableRowExpanded={(row) => row === currentRow}
          expandableRowsComponent={(row) => expandableComponent(row)}
          onRowClicked={onRowClicked}
        />
      </section>
    </>
  );
}

export default AllRestaurant;
