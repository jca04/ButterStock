import axios from "axios";

export const validateUser = async (data) => {
  try {
    const response = await axios.post("http://localhost:3000/api/users/login", {
      contraseña: data.pass,
      correo: data.user,
    });
    document.cookie = `token=${response.data.token}; path=/`;
    return {
      status: response.status,
    };
  } catch (error) {
    return { error: error };
  }
};
