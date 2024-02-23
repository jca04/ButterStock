import React, { useState, useEffect, useRef } from 'react'
import Chart from "chart.js/auto"

export default function EdrGraph({ data }) {

    const chartRef = useRef(null);

    function getMonthName(month) {
        switch (month) {
            case 1:
                return 'Enero';
            case 2:
                return 'Febrero';
            case 3:
                return 'Marzo';
            case 4:
                return 'Abril';
            case 5:
                return 'Mayo';
            case 6:
                return 'Junio';
            case 7:
                return 'Julio';
            case 8:
                return 'Agosto';
            case 9:
                return 'Septiembre';
            case 10:
                return 'Octubre';
            case 11:
                return 'Noviembre';
            case 12:
                return 'Diciembre';
            default:
                return 'Mes';
        }
    }

    useEffect(() => {
        const dataByMonth = {};
        data.forEach((estado) => {
            const month = new Date(estado.time_stamp).getMonth();
            const year = new Date(estado.time_stamp).getFullYear();
            const key = `${year}-${getMonthName(month + 1)}`;

            if (!dataByMonth[key]) {
                dataByMonth[key] = 0;
            }

            dataByMonth[key] += estado.ventas;
        });

        const labels = Object.keys(dataByMonth);
        const chartData = Object.values(dataByMonth);

        const ctx = document.getElementById("salesChart").getContext("2d");

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  label: 'Ventas por Mes',
                  data: chartData,
                  borderColor: '#ffb400',
                  borderWidth: 2,
                  fill: false,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  type: 'category',
                  labels,
                },
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
    }, [data])


  return (
    <div style={{ width: '100%', height: '100%' }}>
        <canvas id='salesChart' width="800" height="200"></canvas>
    </div>
  )
}
