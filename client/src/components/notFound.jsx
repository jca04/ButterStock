import React from "react";
import { Link, NavLink } from "react-router-dom";

function NotFound(){

  return(
    <div><h2>No se encontro</h2><Link to="/about">About</Link></div>
  )
}

export default NotFound;