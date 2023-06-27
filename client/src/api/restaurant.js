import axios from "axios";
import { getToken } from "../auth/auth";

export const verifiedRestaurant = async (data) => {
  try{
    const response = await axios.post("http://localhost:3000/api/restaurant/verifiedRestaurant", {name: data});
    return response;
  }catch(error){
    return {error}
  }
}

export const createRestaurant =async (data) => {
  const res = await axios.post("http://localhost:3000/api/restaurant/create",  data);
  return res;

}

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