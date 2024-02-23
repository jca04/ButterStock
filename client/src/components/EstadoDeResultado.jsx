import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
//apis
import { verifyUrl } from '../auth/verifyUrl'
//components
import Navbar from './reuseComponents/navbar'
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { DatePicker } from "@mui/x-date-pickers/DatePicker"
// import dayjs from 'dayjs'
import { getAllEdr, getEdr, getPieChartEdr } from '../api/edr'
import Edr from './component/Edr'
// import PieChartEdr from './reuseComponents/PieChartEdr'
import EdrHistoricalTable from './component/EdrHistoricalTable'
import EdrGraph from './reuseComponents/EdrGraph'

//style
import style from "../public/css/estadoDeResultadoStyle.module.css"

export default function EstadoDeResultado() {

    document.title = "ButterStock | Estado de Resultado"

    let{ id_restaurant } = useParams();
    id_restaurant = verifyUrl(id_restaurant)

    // const [selectedDate, setSelectedDate] = useState(null);
    // const [selectedMonth, setSelectedMonth] = useState(null);
    // const [edr, setEdr] = useState([]);
    // const [edrLoading, setEdrLoading] = useState(false);
    const [edrModalOpen, setEdrModalOpen] = useState(false);
    const [ edrTipo, setEdrTipo ] = useState("")
    // const [data, setData] = useState({})
    const [edrsData, setEdrsData] = useState([])

    useEffect(() => {
        const res = async () => {
            const response = await getAllEdr(id_restaurant);
            setEdrsData(response.data.edrs);
        }
        res();
    }, [])

    // const handleDateChange = (date) => {
    //     setSelectedDate(date);
    // }

    // const handleMonthChange = (month) => {
    //     setSelectedMonth(month);
    // }

    const handleEdrModalOpen = (e) => {
        setEdrModalOpen(true);
        setEdrTipo(e.target.value);
    }

    const handleEdrModalClose = () => {
        setEdrModalOpen(false);
    }

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


    
    

    // GRAFICAS
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await getPieChartEdr(id_restaurant);
    //         if (res.data.message == "ok") {
    //             setData(res.data.data)
    //         }
    //     }
    //     fetchData();
    // }, [id_restaurant])


  return (
    <div className={style.globalEdr}>
        <Navbar  restaurant = {id_restaurant}/>
        <div className={style.edr_wrapper}>
            <div className={style.edr_container}>
                <aside className={style.aside_content}>
                    <p className={style.edr_description}>Crea tu Estado de Resultados Diario o Mensual</p>
                    <div className={style.btns_edr}>
                        <button onClick={handleEdrModalOpen} value="diario" className={style.btn}>Diario</button>
                        <button onClick={handleEdrModalOpen} value="mensual" className={style.btn}>Mensual</button>
                    </div>
                </aside>
                <main className={style.main_content}>
                    {/* <PieChartEdr data={data}/> */}
                    <EdrHistoricalTable id_restaurant={id_restaurant}/>
                </main>
                <div className={style.graph}>
                    <EdrGraph data={edrsData} />
                </div>
            </div>
            {
                edrModalOpen ? (
                    <Edr id_restaurant={id_restaurant} tipoEdr = {edrTipo} closeModal={handleEdrModalClose}/>
                ) : null
            }
        </div>
    </div>
  )
}
