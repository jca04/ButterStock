import axios from "axios";
import { setToken } from "../auth/auth";
import { getToken } from "../auth/auth";

const tokenStr = getToken();

export const validateUser = async (data) => {
  try {
    const response = await axios.post("/users/login", {
      contraseña: data.pass,
      correo: data.user,
    });
    if (response.data.token) {
      setToken(response.data.token);
      return { message: "continue" };
    }

    return { message: "failed" };
  } catch (error) {
    return { message: error };
  }
};

export const createUser = async (data) => {
  const res = await axios.post("/users/register", {
    nombre: data.nombreUser,
    contraseña: data.contraseña,
    apellido: data.apellidoUser,
    correo: data.correoUser,
    idRestaurant: data.idRestaurant,
  });

  return res;
};

export const getuserPerRest = async (id) => {
  try{
    const response = await axios.post('/users/getUser',{
      headers: { Authorization: `Bearer ${tokenStr}` },
      data: {
        id: id,
      },
    });

    return response.data.message;
  }catch(error){
    console.log(error)
    return {message: '!Ha ocurrido un error inesperado'};
  }
}
