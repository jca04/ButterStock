import axios from "axios";

export const validateUser = async (data) => {
    const res = await axios.post("http://localhost:3000/api/users/login", {
        "contraseña": data.pass,
        "correo":  data.user,
      });

      return res;
};

export const createUser = async(data) => {
  const res = await axios.post("http://localhost:3000/api/users/register", {
    "nombre": data.nombreUser,
    "contraseña":  data.contraseña,
    "apellido": data.apellidoUser,
    "correo": data.correoUser,
    "idRestaurant": data.idRestaurant
  });

  return res;
}

