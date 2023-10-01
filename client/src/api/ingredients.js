import axios from "axios";
import { getToken } from "../auth/auth";

let token = getToken();

export const getIngredients = async (id) => {
  try {
    const res = await axios.post("/ingredient/ingredients", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id: id,
      },
    });
    if (res.status == 200) {
      return res.data;
    } else {
      return { message: "Error" };
    }
  } catch (error) {
    return { message: error };
  }
};

export const banIngredient = async (id) => {
  try {
    const res = await axios.put("/ingredient/ban-ingredient", {
      headers: { Authorization: `Bearer ${token}` },
      id: id,
    });
    if (res.status == 200) {
      return res.data;
    } else {
      return { message: "Error" };
    }
  } catch (error) {
    return { message: error };
  }
};

export const unbanIngredient = async (id) => {
  try {
    const res = await axios.put("/ingredient/unban-ingredient", {
      headers: { Authorization: `Bearer ${token}` },
      id: id,
    });

    if (res.status == 200) {
      return res.data;
    } else {
      return { message: "Error" };
    }
  } catch (error) {
    return { message: error };
  }
};


export const createIngredient = async(values, id) => {
  try {
    const response = await axios.post('/ingredient/createIngredient', {
      headers : {Authorization:  `Bearer ${token}` },
      data: values,
      id
    });

    if (response.status == 200){
      return response.data
    }else{
      return response.data.message
    }
  } catch (error) {
    return {message: error}
  }
}

export const updateIngredients = async(values, id) => {
  try{
    const response = await axios.put('/ingredient/update-ingredient', {
      headers: { Authorization: `Bearer ${token}` },
      data: values,
      id: id
    });

    if (response.status == 200){
      return response.data.message
    }else{
      return response.data.message
    }
  }catch(err){
    return {message: 'Ha ocurrido un error inesperado'};
  }
}
