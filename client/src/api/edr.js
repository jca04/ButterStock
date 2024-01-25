import axios from "axios";
import { getToken } from "../auth/auth";

let token = getToken();

export const getEdr = async (date, id_restaurante) => {
  try {
    const response = await axios.post("/edr/get", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id_restaurant: id_restaurante,
        fecha_edr: date,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const getDataEdr = async (tipoEdr, id_restaurante) => {
  try {
    const response = await axios.post("/edr/get-data", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id_restaurant: id_restaurante,
        tipoEdr: tipoEdr,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const createEdr = async (gastos, id_restaurant, fecha_edr) => {
  try {
    const response = await axios.post("/edr/create", {
      header: { Authorization: `Bearer ${token}` },
      data: {
        gastos,
        id_restaurant,
        fecha_edr,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const getPieChartEdr = async (id_restaurant) => {
  try {
    const response = await axios.post("/edr/get-pie-chart", {
      header: { Authorization: `Bearer ${token}` },
      data: {
        id_restaurant,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};
