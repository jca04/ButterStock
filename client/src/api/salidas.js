import axios from "axios";
import { getToken } from "../auth/auth";

const tokenStr = getToken();

export const getDataSelectsSalida = async (id_restaurant) => {
  try{
    const response = await axios.post('/salidas/getData',{
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        restaurant: id_restaurant,
      },
    });

    if (response.status == 200){
      return response.data;
    }else{
      return response.data
    }
  }catch(error){
    console.log(error)
    return {message: '!Ha ocurrido un error inesperado'};
  }
}
