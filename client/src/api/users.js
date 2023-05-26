import axios from "axios";

export const validateUser = async (data) => {
    const res = await axios.post("http://localhost:3000/api/users/login", {
        "contraseña": data.pass,
        "correo":  data.user,
      });

      return res;
};
