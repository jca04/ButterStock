import axios from "axios";
import { getToken } from "../auth/auth";

let token = getToken();

export const getKardex = async (id) => {
  const response = await axios.post("/kardex/", {
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

export const entradasPromPonderado = async (
  id_ingredient,
  cantidad,
  costo_unitario,
  unidad_medida,
  id_restaurant
) => {

  console.log(  id_ingredient,
    cantidad,
    costo_unitario,
    unidad_medida,
    id_restaurant)
  try {
    const response = await axios.post(
      `/kardex/promedio/entradas/${id_ingredient}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          cantidad: cantidad,
          costo_unitario: costo_unitario,
          unidad_medida: unidad_medida,
          id_restaurant: id_restaurant,
        },
      }
    );

    return response;
  } catch (error) {
    return error;
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

export const salidasPromPonderado = async (
  id_ingredient,
  cantidad,
  unidad_medida,
  id_restaurant
) => {
  try {
    const response = await axios.post(
      `/kardex/promedio/salidas/${id_ingredient}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          cantidad: cantidad,
          unidad_medida: unidad_medida,
          id_restaurant: id_restaurant,
        },
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const validacionInventario = async (
  id_restaurant,
  cantidad,
  unidad_medida,
  kardex,
  id_ingredient
) => {
  try {
    const response = await axios.post(`/kardex/validacion/${id_ingredient}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id_restaurant: id_restaurant,
        cantidad: cantidad,
        unidad_medida: unidad_medida,
        kardex: kardex,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};
