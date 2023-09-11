import axios from "axios";
import { getToken } from "../auth/auth";

export const getIngredients = async (id) => {
  try {
    let token = getToken();
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
    let token = getToken();
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
    let token = getToken();
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
    res.status(400).json({ message: error });
  }
};
