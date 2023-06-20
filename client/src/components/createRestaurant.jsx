import React, { useEffect } from "react";
import "../public/css/createRestaurantStyle.css";
import axios from "axios";

function FormRestaurant(){

  // const token = document.cookie.split("; ").find(cookie => cookie.startsWith("token="))
  // const tokenValue = token.split("=")[1];
  // axios.get("http://localhost:3000/api/users", {
  //   headers: {
  //     Authorization: `Bearer ${tokenValue}`
  //   }
  // }).then(res => {
  //   console.log(res.data)
  // }).catch(err => {
  //   console.log(err)
  // })
  

  return(
    <h2>AQUI SE CREA EL RESTAURANTE</h2>
  )
}

export default FormRestaurant;