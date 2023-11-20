import axios from "axios";
import { getToken } from "../auth/auth";

const tokenStr = getToken();

export const saveSales = async (data, restaurant) => {
  try {
    const response = await axios.post("/sales/saveSales", {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        info: data,
        restaurant: restaurant,
      },
    });

    return response.data.message;
  } catch (error) {
    return error;
  }
};
