import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getKardex } from "../api/kardex";
import Navbar from "./reuseComponents/navbar";
import KardexTable from "./component/KardexTable";

export default function Kardex() {
  const { id_ingrediente } = useParams();
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
      <Navbar />
      <KardexTable kardex={kardex} ingredient={ingredient} />
    </>
  );
}
