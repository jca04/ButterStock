import axios from "axios";
import { getToken } from "../auth/auth";


export const getResipes = async (id) => {
    try {
        let tokenStr= getToken();

        const response = await axios.post('http://localhost:3000/api/resipe/resipes',  {
          headers: { Authorization: `Bearer ${tokenStr}` },
          data: {
            "id": id
          }
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

export const getIngredient = async (id) => {
  try {
      let tokenStr= getToken();
 
      const response = await axios.post('http://localhost:3000/api/ingredient/getIngredients',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
        data: {
          "id" : id
        }
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


export const saveEditRespie = async (data) => {
  try {
      let tokenStr= getToken();
 
      const response = await axios.post('http://localhost:3000/api/resipe/create-edit',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
        data: {
          "data": data
        }
      });

      console.log(response)

  } catch (error) {
    return {message: error};
  }
}