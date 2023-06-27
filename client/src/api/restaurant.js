import axios from "axios";
import { getToken } from "../auth/auth";

//se verifica si el restaurante existe o no
export const verifiedRestaurant = async (data) => {
  try{
    const response = await axios.post("http://localhost:3000/api/restaurant/verifiedRestaurant", {name: data});
    return response;
  }catch(error){
    return {error}
  }
}

//creacion del restaurante
export const createRestaurant =async (data) => {
  const res = await axios.post("http://localhost:3000/api/restaurant/create",  data);
  return res;

}

//va en el homepage
export const getRestaurant = async () => {
  let tokenStr = getToken();
  try{
    const res = await axios.get("http://localhost:3000/api/restaurant/getRestaurant",  {
      headers: { Authorization: `Bearer ${tokenStr}` },
    });

    return res;
  }catch(error){

  }
}

//obtener todos los restaurantes superAdmin
export const getAllRestaurants = async () => {
  try {
    let tokenStr = getToken();
    const res = await axios.get("http://localhost:3000/api/restaurant/getAllRestaurant",  {
      headers: { Authorization: `Bearer ${tokenStr}` },
    });


    if (res.status == 200){
      return res;
    }
    
  } catch (error) {
    return {message: error}
  }
}