import axios from "axios";
import { getToken } from "../auth/auth";


export const getResipes = async (id) => {
  try {
    let tokenStr = getToken();

    const response = await axios.post("/resipe/resipes", {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        id: id,
      },
    });

    if (response.status == 200) {
      return response.data.result;
    } else {
      return { message: "Error" };
    }
  } catch (error) {
    return { message: error };
  }
};

export const getIngredient = async (id) => {
  try {
    let tokenStr = getToken();

    const response = await axios.post("/ingredient/getIngredients", {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        id: id,
      },
    });

    if (response.status == 200) {
      return response.data.result;
    } else {
      return { message: "Error" };
    }
  } catch (error) {
    return { message: error };
  }
}


export const saveEditRespie = async (data) => {
  try {
    let tokenStr = getToken();

      if (response.data){ 
        if (response.data.message){
          if (response.data.id_create != undefined){
            return response.data.id_create;
          }else{
            return response.data.message;
          }
        }else response.data.message;
      } 
  } catch (error) {
    return { message: error };
  }

}

export const getResipe = async(id, id_receta) => {
  try {
    let tokenStr= getToken();
 
      const response = await axios.post('http://localhost:3000/api/resipe/getRespieEdit',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
        data: {
          "id": id,
          "respie": id_receta
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
    console.log(error)
  }
}

