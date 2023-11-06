import axios from "axios";

export const sendMail = async (to, type) => {
  const response = await axios.post("/mail/mail", {
    to, type
  });

  return response;
};