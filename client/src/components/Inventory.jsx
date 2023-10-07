import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getIngredients } from '../api/ingredients'
import Navbar from './reuseComponents/navbar'
import DataTable from 'react-data-table-component'
import '../public/css/inventoryStyle.css'


export default function Inventory() {

  const { id } = useParams()
  const [data, setData] = useState([])
   useEffect(() => {
    const res = async () => {
      const response = await getIngredients(id)
      setData(response.ingredientes)
    }
    res()
   }, [])

   const columns = [
      {
        name: 'Ingrediente',
        selector: row => row.nombre_ingrediente
      },
      {
        name: 'Cantidad',
        selector: row => row.cantidad_total_ingrdiente
      },
      {
        name: 'Unidad de medida',
        selector: row => row.unidad_medida
      },
      {
        name: 'Kardex',
        selector: row => row.kardex == "" ? "Promedio ponderado" : row.kardex
      },
      {
        name: 'Ver kardex',
        cell: (row) => <Link to={`/kardex/${row.id_ingrediente}`} className="btn-kardex">Ver kardex</Link>
      }
   ]

  return (
    <>
      <Navbar />
      <section className="father_inventario">
        <DataTable 
          columns={columns}
          data={data}
          pagination
          paginationPerPage={5}
          responsive
          striped
        />
      </section>
    </>
  )
}
