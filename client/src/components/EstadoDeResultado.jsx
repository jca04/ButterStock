import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//apis
import { verifyUrl } from "../auth/verifyUrl";
//components
import Navbar from "./reuseComponents/navbar";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from 'dayjs'
import { getAllEdr, getEdr, getPieChartEdr } from "../api/edr";
import Edr from "./component/Edr";
// import PieChartEdr from './reuseComponents/PieChartEdr'
import EdrHistoricalTable from "./component/EdrHistoricalTable";
// import EdrGraph from './reuseComponents/EdrGraph'

import Plot from "react-plotly.js";
//style
import style from "../public/css/estadoDeResultadoStyle.module.css";
import Chart from "chart.js/auto"
import EdrGraph from "./reuseComponents/EdrGraph";

export default function EstadoDeResultado() {
  document.title = "ButterStock | Estado de Resultado";

  let { id_restaurant } = useParams();
  id_restaurant = verifyUrl(id_restaurant);

  // const [selectedDate, setSelectedDate] = useState(null);
  // const [selectedMonth, setSelectedMonth] = useState(null);
  // const [edr, setEdr] = useState([]);
  // const [edrLoading, setEdrLoading] = useState(false);
  const [edrModalOpen, setEdrModalOpen] = useState(false);
  const [edrTipo, setEdrTipo] = useState("");
  // const [data, setData] = useState({})
  const [edrsData, setEdrsData] = useState([]);

  useEffect(() => {
    const res = async () => {
      const response = await getAllEdr(id_restaurant);
      setEdrsData(response.data.edrs);
    };
    res();
  }, []);

  // const handleDateChange = (date) => {
  //     setSelectedDate(date);
  // }

  // const handleMonthChange = (month) => {
  //     setSelectedMonth(month);
  // }

  const handleEdrModalOpen = (e) => {
    setEdrModalOpen(true);
    setEdrTipo(e.target.value);
  };

  const handleEdrModalClose = () => {
    setEdrModalOpen(false);
  };

  // useEffect(() => {
  //     if (selectedDate && selectedMonth) {
  //         setSelectedMonth(null);
  //     }

  // }, [selectedDate])

  // useEffect(() => {
  //     if (selectedMonth && selectedDate) {
  //         setSelectedDate(null);
  //     }
  // }, [selectedMonth])

  // useEffect(() => {
  //     const fetchData = async () => {

  //         setEdrLoading(true);

  //     let currentData;

  //     if (selectedDate) {
  //         currentData = dayjs(selectedDate).format('YYYY-MM-DD');
  //     } else if (selectedMonth) {
  //         const year = dayjs(selectedMonth).year();
  //         const month = dayjs(selectedMonth).month() + 1;
  //         currentData = `${year}-${month}`;
  //     } else {
  //         currentData = dayjs().format('YYYY-MM-DD');
  //     }
  //     const response = await getEdr(currentData, id_restaurant).then(setEdrLoading(false));
  //     setEdr(response.data.edr);
  // }
  //     fetchData();
  // }, [selectedDate, selectedMonth, id_restaurant])

  //GRAFICAS
  // useEffect(() => {
  //     const fetchData = async () => {
  //         const res = await getPieChartEdr(id_restaurant);
  //         if (res.data.message == "ok") {
  //             // setData(res.data.data)
  //         }
  //     }
  //     fetchData();
  // }, [id_restaurant])

  const [value, setValue] = useState(dayjs("2022-04-17"));

  return (
    <div className={style.stateOfContainer}>
      <Navbar restaurant={id_restaurant} />
      <div className={style.edrContainer}>
        <header>Estado de Resultado</header>
        <div className={style.parentState}>
          <div className={style.boxInfoFirst}>
            <div className={style.boxActionEdr}>
              <div className={style.titleBoxEdr}>Generar Estados</div>
              <div className={style.btnsBoxEdr}>
                <button
                  type="button"
                  value={"diario"}
                  className={style.btnDay}
                  onClick={handleEdrModalOpen}
                >
                  Diario
                </button>
                <button
                  type="button"
                  value={"mensual"}
                  className={style.btnMonth}
                  onClick={handleEdrModalOpen}
                >
                  Mensual
                </button>
              </div>
              <div className={style.spanEdrGenerate}>
                Generar un tipo de estado
              </div>
            </div>
            <div className={style.boxActionEdrHistory}>
              <div className={style.titleBoxEdr}>Estados de Resultado</div>
              <div className={style.datePickerHistory}>
                <label>Consultar</label>
                <input type="date" />
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>fecha</th>
                      <th>acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                    <tr>
                      <td>2002/20/19</td>
                      <td>ver</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={style.boxInfoFirstHistory}>
            <div className={style.rowSection}>
              <div className={style.boxInfoPie}>
                <div className={style.titleBoxEdr}>Gastos por default</div>
                <Plot
                  data={[
                    {
                      values: [55900, 23500],
                      labels: ["vencimineto del producto", "desperdicio"],
                      type: "pie",
                    },
                  ]}
                  layout={{
                    width: 320,
                    height: 240,
                    title: "Gastos pordefault",
                  }}
                />
              </div>
              <div className={style.boxInfoPie}>
                <div className={style.titleBoxEdr}>Otros gastos</div>
                <Plot
                  data={[
                    {
                      values: [100000, 23500, 500000],
                      labels: ["Guerrilla", "Arreglo sillas", "putas"],
                      type: "pie",
                    },
                  ]}
                  layout={{ width: 320, height: 240, title: "Otros gastos" }}
                />
              </div>
            </div>
            <div className={style.rowSection}>
              <div className={style.boxInfoPie}>
                <div className={style.titleBoxEdr}>Platillo mas vendido</div>
                {/* <Plot
                  data={[
                    {
                      values: [100, 500, 500],
                      labels: ["arroz con coco", "camarones", "jugo de sandia"],
                      type: "pie",
                    },
                  ]}
                  layout={{
                    width: 320,
                    height: 240,
                    title: "Platillos mas vendidos",
                  }}
                /> */}
                <EdrGraph data={edrsData}/>

              </div>
              <div className={style.boxInfoPie}>
                <div className={style.titleBoxEdr}>Platillo menos vendido</div>
                {/* <Plot
                  data={[
                    {
                      values: [100, 500, 500],
                      labels: ["arroz con coco", "camarones", "jugo de sandia"],
                      type: "pie",
                    },
                  ]}
                  layout={{
                    width: 320,
                    height: 240,
                    title: "Platillos menos vendidos",
                  }}
                /> */}
                {/* <EdrGraph data={edrsData}/> */}

              </div>
            </div>
            <div className={style.rowSection}>
              <div className={style.boxInfoChart}>
                <div className={style.titleBoxEdr}>
                  Promedio ventas por dias del mes
                </div>
                <Plot
                  data={[
                    {
                      x: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18],
                      y: [32, 37, 40.5, 43, 49, 54, 59, 63.5, 69.5, 73, 74],
                      mode: "markers",
                      type: "scatter",
                    },
                  ]}
                  layout={{
                    title: "Growth Rate in Boys",
                    xaxis: {
                      title: "Age (years)",
                    },
                    yaxis: {
                      title: "Height (inches)",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
