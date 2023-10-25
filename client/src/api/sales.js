import axios from "axios";
import { getToken } from "../auth/auth";

const tokenStr = getToken();

export const saveSales= async (data) => {
  try {
    const response = await axios.post("/sales/saveSales", {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        info: data
      }
    });

    return response.data.message;
  } catch (error) {
    return error ;
  }
};
