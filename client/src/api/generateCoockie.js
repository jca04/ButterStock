import axios from "axios";

 export const coockie =  (data) => {
  const res =   axios.get("http://localhost:3000/api/getToken", {token: data});
  return res;
}