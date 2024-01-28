import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'


//apis
import { getEdr, getPieChartEdr } from '../api/edr'
import { verifyUrl } from '../auth/verifyUrl'

//components
import Navbar from './reuseComponents/navbar'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from 'dayjs'
import Edr from './component/Edr'
import PieChartEdr from './reuseComponents/PieChartEdr'

//style
import style from "../public/css/estadoDeResultadoStyle.module.css"

export default function EstadoDeResultado() {

    document.title = "ButterStock | Estado de Resultado"

    let{ id_restaurant } = useParams();
    id_restaurant = verifyUrl(id_restaurant)

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [edr, setEdr] = useState([]);
    const [edrLoading, setEdrLoading] = useState(false);
    const [edrModalOpen, setEdrModalOpen] = useState(false);
    const [ edrTipo, setEdrTipo ] = useState("")
    const [data, setData] = useState({})

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    }

    const handleEdrModalOpen = (e) => {
        setEdrModalOpen(true);
        setEdrTipo(e.target.value);
    }

    const handleEdrModalClose = () => {
        setEdrModalOpen(false);
    }

    useEffect(() => {
        if (selectedDate && selectedMonth) {
            setSelectedMonth(null);
        }

    }, [selectedDate])

    useEffect(() => {
        if (selectedMonth && selectedDate) {
            setSelectedDate(null);
        }
    }, [selectedMonth])

    useEffect(() => {
        const fetchData = async () => {

            setEdrLoading(true);
            
        let currentData;

        if (selectedDate) {
            currentData = dayjs(selectedDate).format('YYYY-MM-DD');
        } else if (selectedMonth) {
            const year = dayjs(selectedMonth).year();
            const month = dayjs(selectedMonth).month() + 1;
            currentData = `${year}-${month}`;
        } else {
            currentData = dayjs().format('YYYY-MM-DD');
        }
        const response = await getEdr(currentData, id_restaurant).then(setEdrLoading(false));
        setEdr(response.data.edr);
    }
        fetchData();
    }, [selectedDate, selectedMonth, id_restaurant])

    

    // GRAFICAS
    useEffect(() => {
        const fetchData = async () => {
            const res = await getPieChartEdr(id_restaurant);
            if (res.data.message == "ok") {
                setData(res.data.data)
            }
        }
        fetchData();
    }, [id_restaurant])



  return (
    <div className={style.stateOfContainer}>
        <Navbar restaurant = {id_restaurant}/>
        <div className={style.edrContainer}>
            <header>Estado de Resultado</header>
            <div className={style.boxInfoFirst}>
                <div className={style.boxActionEdr}>
                    <div className={style.titleBoxEdr}>Generar Estados</div>
                    <div className={style.btnsBoxEdr}>
                        <button type='button' value={"diario"} className={style.btnDay} onClick={handleEdrModalOpen}>Diario</button>
                        <button type='button' value={"mensual"} className={style.btnMonth} onClick={handleEdrModalOpen} >Mensual</button>
                    </div>
                    <div className={style.spanEdrGenerate}>Generar un tipo de estado</div>
                </div>
                <div className={style.promedMonthBox}>
                    Grafica del promedio del mes
                </div>
            </div>

            <aside className='aside-content'>
                <div className="calendar">
                    <h1>Estados de resultados anteriores</h1>
                    <div className="calendar-content">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={'Año, Mes y Dia'}
                            views={['year', 'month', 'day']}
                            // minDate={new Date('2017-01-01')}
                            // maxDate={new Date('2023-01-01')}
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            className='date-picker'
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label={'Año y Mes'}
                            views={['month', 'year']}
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            renderInput={(params) => <TextField {...params} />}
                            className='date-picker'
                        />
                    </LocalizationProvider>
                    </div>
                </div>
                {
                    edrLoading ? (null ) : ( 
                    edr.length > 0 
                    ? 
                    <div className='historico-container'>
                        <div className="historico-content">
                            <h4>Ventas:</h4>
                            <p>${Number(edr[0].ventas).toLocaleString()}</p>
                        </div>
                        <div className="historico-content">
                            <h4>Costos:</h4>
                            <p>${Number(edr[0].costos).toLocaleString()}</p>
                        </div>
                        <div className="historico-content">
                            <h4>Otros Gastos:</h4>
                            <p>
                                {
                                    Object.entries(JSON.parse(edr[0].otros_gastos)).map((item, index) => {
                                        return <p key={index} className='otros-gastos'>{item[0]}: ${Number(item[1]).toLocaleString()}</p>
                                    })
                                }
                            </p>
                        </div>
                        <div className="historico-content">
                            <h4>Valor otros gastos:</h4>
                            <p>${Number(edr[0].otros_gastos_valor).toLocaleString()}</p>
                        </div>
                        <div className={`historico-content ${edr[0].utilidad < 0 ? "negativo" : null}`}>
                            <h4>Utilidad:</h4>
                            <p>${Number(edr[0].utilidad).toLocaleString()}</p>
                        </div>
                        <div className="historico-content">
                            <h4>Automatico:</h4>
                            <p>{edr[0].automatico == 0 ? "No" : "Si"}</p>
                        </div>
                    </div>
                    : <div className='no-data'>
                        <h1>No hay estado de resultado en la fecha indicada</h1>
                    </div>
                    )
                }
            </aside>
            <main className='main-content'>
                <PieChartEdr data={data}/>
            </main>
        </div>
        {
            edrModalOpen ? (
                <Edr id_restaurant={id_restaurant} tipoEdr = {edrTipo} closeModal={handleEdrModalClose}/>
            ) : null
        }
    </div>
  )
}
