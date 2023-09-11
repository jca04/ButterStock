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

    const response = await axios.post('/resipe/create-edit',  {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        "data": data
      }
    });

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
 
      const response = await axios.post('/resipe/getRespieEdit',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
        data: {
          "id": id,
          "respie": id_receta
        }
      });

      console.log(response)

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
    console.log(error)
  }
}

