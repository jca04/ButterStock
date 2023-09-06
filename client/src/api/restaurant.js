import axios from "axios";
import { getToken } from "../auth/auth";

//se verifica si el restaurante existe o no
export const verifiedRestaurant = async (data) => {
  try {
    const response = await axios.post("/restaurant/verifiedRestaurant", {
      name: data,
    });
    return response;
  } catch (error) {
    return { error };
  }
};

//creacion del restaurante
export const createRestaurant = async (data) => {
  const res = await axios.post("/restaurant/create", data);
  return res;
};

//va en el homepage
export const getRestaurant = async () => {
  let tokenStr = getToken();
  try {
    const res = await axios.get("/restaurant/getRestaurant", {
      headers: { Authorization: `Bearer ${tokenStr}` },
    });

    if (res.status == 200) {
      return res.data.result;
    }

    if (res.status == 400) {
      return { message: "error" };
    }

    return res;
  } catch (error) {
    return { message: error };
  }
};

//obtener todos los restaurantes superAdmin
export const getAllRestaurants = async () => {
  try {
    let tokenStr = getToken();
    const res = await axios.get("/restaurant/getAllRestaurant", {
      headers: { Authorization: `Bearer ${tokenStr}` },
    });

    if (res.status == 200) {
      return res;
    }
  } catch (error) {
    return { message: error };
  }
};

//desactivar un restaurante
export const toggleRestaurante = async (id, value) => {
  try {
    let tokenStr = getToken();
    const res = await axios.put("/restaurant/deactivateRestaurant", {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        resId: id,
        value: value,
      },
    });

    if (res.status == 200) {
      if (res.data.message) {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    return { message: error };
  }
};
