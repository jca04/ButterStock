import React, { useEffect, useState } from "react";
import { getKardex } from "../api/kardex";
import style from "../public/css/kardexStyle.module.css";

//import components
import KardexTable from "./component/KardexTable";
import CircularProgress from "@mui/material/CircularProgress";

export default function Kardex({id_ingrediente}) {

  const [kardex, setKardex] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [loadKardex, setKardexLoad] = useState(false);

  document.title = "ButterStock | Kardex";


  useEffect(() => { 
    const res = async () => {
      const response = await getKardex(id_ingrediente);
      setKardex(response.data.kardex);
      setIngredient(response.data.ingrediente);

      setKardexLoad(true);
    };
    res();
  }, []);

  return (
    <>
    {loadKardex ? (
     <KardexTable kardex={kardex} ingredient={ingredient} />
     ) : (
      <div className={style.loadingTable}><CircularProgress color="inherit" /></div>
     )}
    </>
  );
}
