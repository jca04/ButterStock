import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function NotFound(){

  const showToastMessage = () => {
    toast.success('Success Notification !', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 500
    });
};

  return(
    <div>
    <button onClick={showToastMessage}>Notify</button>
</div>
  )
}

export default NotFound;