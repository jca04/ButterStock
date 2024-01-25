import React, { useEffect, useState } from "react";
import { getKardex } from "../api/kardex";
import style from "..//public/css/kardexStyle.module.css";

//import components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import KardexTable from "./component/KardexTable";

export default function Kardex({id_ingrediente}) {

  const [kardex, setKardex] = useState([]);
  const [ingredient, setIngredient] = useState("");

  useEffect(() => { 
    document.title = "Kardex";
    const res = async () => {
      const response = await getKardex(id_ingrediente);
      setKardex(response.data.kardex);
      setIngredient(response.data.ingrediente);
    };
    res();
  }, []);

  return (
    <>
      <Dialog
        open={true}
        className={style.modalKardex}
      >
        <DialogContent>
            <KardexTable kardex={kardex} ingredient={ingredient} />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>

    </>
  );
}
