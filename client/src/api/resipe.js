import axios from "axios";
import { getToken } from "../auth/auth";

let tokenStr = getToken();


export const getResipes = async (id) => {
  try {
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
};

export const saveEditRespie = async (data) => {
  try {
    const response = await axios.post('/resipe/create-edit',  {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        data: data,
      },
    });
    if (response.data) {
      if (response.data.message) {
        if (response.data.id_create != undefined) {
          return response.data.id_create;
        } else {
          return response.data.message;
        }
      } else response.data.message;
    }
  } catch (error) {
    return { message: error };
  }
};

export const getResipe = async(id, id_receta) => {
  try { 
      const response = await axios.post('/resipe/getRespieEdit',  {
        headers: { Authorization: `Bearer ${tokenStr}` },
        data: {
          "id": id,
          "respie": id_receta
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
    console.log(error)
    return {message: error};
  }
};

export const editIngredientsResipe = async(id, ingredient) => {

  try {
    const response = await axios.post('/resipe/editQuantity', {
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        "id": id,
        "ingredient" : ingredient
      }
    });

    if (response.status == 200){
      return true;
    }
  } catch (error) {
    return {message: error}
  }
}