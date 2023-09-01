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

      if (response.data){ 
        if (response.data.message){
          return response.data.message;
        }else response.data.message;
      } 
  } catch (error) {
    return {message: error};
  }
}

export const getResipeLimit = async (id) => {
  try {
      let tokenStr= getToken();
 
      const response = await axios.post('http://localhost:3000/api/resipe/getResipeLimit',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
        data: {
          "data": id
        }
      });


      if (response.data){
        if (Array.isArray(response.data.response)){
          return response.data.response;
        }else{
          return false;
        }
      }else{
        false;
      }
  } catch (error) {
    return {message: error};
  }
}