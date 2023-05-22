import axios from "axios";

export const validateUser = async (data) => {
  try {
    axios
      .post("http://localhost:3000/api/users/login", {
        "contraseña": data.pass,
        "correo":  data.user,
      })
      .then((response) => {
        console.log(response.data);
      });
  } catch (error) {
    return {"error": error};
  }
};
