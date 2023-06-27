import React, { useEffect, useState } from "react";
import Navbar from "../reuseComponents/navbar";
import "../../public/css/allRestaurantStyle.css";
import {getAllRestaurants} from "../../api/restaurant.js";
import DataTable from 'react-data-table-component';


function AllRestaurant(){

  const [stataRestaurant, setRestaurants] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [currentRow, setCurrentRow] = useState(null);
  document.title = "Restaurantes";


  useEffect(() => {
      const fecthData = async () => {
        try {
          const res = await getAllRestaurants();
          let dataRes = res.data.result;
          setRestaurants(dataRes);
          setPending(false);
          console.log(dataRes)
        } catch (error) {
          console.log(error)
        }
        
      }

      fecthData();
  }, []);

  const data = stataRestaurant;
  const columns = [
    {
      name: "id_restaurante",
      selector: row => row.id_restaurant,
      width: "100px"
    },
    {
        name: 'Nombre',
        selector: row => row.nombre,
        width: "250px"
    },
    {
        name: 'Ciudad',
        selector: row => row.ciudad,
        width: "200px"
    },
    {
      name: "Direccion",
      selector: row => row.direccion,
      width: "200px"
    },
    {
      name: "Creacion",
      selector: row => row.time_stamp
    },
    {
      name: "activo",
      selector: row =>  row.activo == 1 ? "si" : "no",
      width: "70px"
    },
    {
      name: "sucursales",
      selector: row => row.sucursal == null ? "no" : "si",
      width: "100px"
    },
    {
      //para desactivar un restaurante
      name: "Desactivar",
      cell:(row) => <button id={row.ID}>Off</button>,
      width: "100px"
    },
    {
      //para activar algun restaurante
      name: "Activar",
      cell:(row) => <button onClick={() => {console.log(row)}} id={row.ID}>On</button>,
      width: "100px"
    }
  ];
  
  
  //cuando se hace click encima de una fila en la tabla
  //se despliega para consultar datos como por ejemplo si tiene sucursales
  const onRowClicked = (row, event) => { 
    console.log(row)
  };

  return(
    <>
    <Navbar/>
    <section className="section-faher-allrestaurants">
    <DataTable
            title="Restaurantes"
            columns={columns}
            data={data}
            pagination
            responsive
            expandOnRowClicked
            expandableRows
            highlightOnHover
            pointerOnHover  
            progressPending={pending}
            expandableRowExpanded={(row) => (row === currentRow)}
            onRowClicked={onRowClicked}
        />
    </section>
    </>
  )

}

export default AllRestaurant;