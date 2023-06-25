import axios from "axios";
import { getToken } from "../auth/auth";

export const getUser = async () => {
  try {
    let tokenStr = getToken();
    const res = await axios.get("http://localhost:3000/api/users/getUser", {
      headers: { Authorization: `Bearer ${tokenStr}` },
    });

    //cuando el token no es valido en el midleware
    if (res.status == 200) {
      return res.data
    }

  } catch (error) {
    return { message: error };
  }
};
