import axios from "axios";
import { getToken } from "../auth/auth";

let token = getToken();

export const getKardex = async (id) => {
  const response = await axios.post("/kardex/peps", {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      id_ingredient: id,
    },
  });

  console.log(response);

  return response;
};
