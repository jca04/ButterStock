import axios from "axios";
import { getToken } from "../auth/auth";

let token = getToken();

export const getKardex = async (id) => {
  const response = await axios.post("/kardex/peps", {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      id_ingredient: id,
    },
  });

  return response;
};

export const entradasPeps = async (
  id_ingredient,
  cantidad,
  costo_unitario,
  unidad_medida,
  id_restaurant
) => {
  try {
    const response = await axios.post(`/kardex/entradas/${id_ingredient}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id: id_restaurant,
        cantidad: cantidad,
        costo_unitario: costo_unitario,
        unidad_medida: unidad_medida,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const salidasPeps = async (
  id_ingredient,
  cantidad,
  unidad_medida,
  id_restaurant
) => {
  try {
    const response = await axios.post(`/kardex/salidas/${id_ingredient}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id: id_restaurant,
        cantidad: cantidad,
        unidad_medida: unidad_medida,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
