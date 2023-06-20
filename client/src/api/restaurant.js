import axios from "axios";


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