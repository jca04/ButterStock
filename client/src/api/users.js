import axios from "axios";
import { setToken } from "../auth/auth";

export const validateUser = async (data) => {
  try {
    const response = await axios.post("http://localhost:3000/api/users/login", {
      contraseña: data.pass,
      correo: data.user,
    });

    if (response.data.token) {
      setToken(response.data.token);
        return { message: "continue" };
    } 

     return { message: "failed"}
    
  } catch (error) {
    return { message: error };
  }
};

export const createUser = async (data) => {
  const res = await axios.post("http://localhost:3000/api/users/register", {
    nombre: data.nombreUser,
    contraseña: data.contraseña,
    apellido: data.apellidoUser,
    correo: data.correoUser,
    idRestaurant: data.idRestaurant,
  });

  return res;
};
