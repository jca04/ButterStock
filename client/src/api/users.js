import axios from "axios";
import Cookie from "universal-cookie";

export const validateUser = async (data) => {
  try {
    const cookie = new Cookie();
    const response = await axios.post("http://localhost:3000/api/users/login", {
      contraseña: data.pass,
      correo: data.user,
    });
    // document.cookie = `token=${response.data.token}; path=/`;
    if (response.data.token) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      cookie.set("token", response.data.token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: date,
      });
    }
    return {
      status: response.status,
    };
  } catch (error) {
    return { error: error };
  }
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

