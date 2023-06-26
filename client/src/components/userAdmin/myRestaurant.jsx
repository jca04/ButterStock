import React from "react";
import Navbar from "../reuseComponents/navbar";
import {useDispatch, useSelector} from 'react-redux'

function MyRestaurante(){

  let homeSlice = useSelector(state => state.home);
  return(
    <Navbar/>
  )
}


export default MyRestaurante;