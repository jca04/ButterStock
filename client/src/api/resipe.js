import axios from "axios";
import { getToken } from "../auth/auth";


export const getResipes = async () => {
    try {
        let tokenStr= getToken();

        const response = await axios.get('http://localhost:3000/api/resipe/resipes',  {
          headers: { Authorization: `Bearer ${tokenStr}` },
        });

        if (response.status == 200){
          return response.data.result;
        }else{
          return {message : "Error"};
        }

    } catch (error) {
      return {message: error};
    }
}

export const getIngredient = async () => {
  try {
      let tokenStr= getToken();

      const response = await axios.post('http://localhost:3000/api/ingredient/getIngredients',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
      });

      if (response.status == 200){
        return response.data.result;
      }else{
        return {message : "Error"};
      }

  } catch (error) {
    return {message: error};
  }
}