import React, { useEffect } from "react";
import { validateToken } from "../out/validateToke";

function HomePage(){

  validateToken()


  return(
    <h1>holas</h1>
  );

}

export default HomePage;