import React from 'react'
import Plot from 'react-plotly.js'

export default function PieChartEdr({ data }) {

    
    if (!data) return null

    const { ventas, costos, otrosGastos } = data

    const total = ventas + costos + otrosGastos

    const ventasPorcentaje = ((ventas / total) * 100).toFixed(2)
    const costosPorcentaje = ((costos / total) * 100).toFixed(2)
    const otrosGastosPorcentaje = ((otrosGastos / total) * 100).toFixed(2)

    const pieData = [
        {
            values: [ventasPorcentaje, costosPorcentaje, otrosGastosPorcentaje],
            labels: ['Ventas', 'Costos', 'Otros Gastos'],
            type: 'pie'
        }
    ]

    const layout = {
        width: 800,
        height: 400,
        title: 'Resumen del mes'
    }

  return (
    <Plot 
        data={pieData}
        layout={layout}
        config={{displayModeBar: false}}
        style={{width: "100%", height:"100%"}}
    />
  )
}
