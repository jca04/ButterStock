import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/notFound";
import LogginUser from "./components/loginUsers";
import FormRestaurant from "./components/createRestaurant";
import HomePage from "./components/homepage";
import LandingPage from "./components/landingpage";
import MyRestaurante from "./components/userAdmin/myRestaurant";
import AllRestaurant from "./components/superAdmin/allRestaurants";
import Users from "./components/userAdmin/usersPerRest";
import SuperAdminUser from "./components/superAdmin/superAdminUsers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "./auth/auth";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route exact path="*" element={<NotFound />} />
        <Route exact path="/login" element={!isAuthenticated() ? <LogginUser /> : <Navigate to="/homepage" />}/>
        <Route exact path="/homepage" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />}/>
        <Route exact path="/createRestaurant" element={<FormRestaurant />} />
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/configurations" element={isAuthenticated() ? <MyRestaurante/> : <Navigate to="/login" />}/>
        <Route exact path="/AllRestaurant" element={isAuthenticated() ? <AllRestaurant/> : <Navigate to="/login" />}/>
        <Route exact path="/users" element={isAuthenticated() ? <Users/> : <Navigate to="/login" />}/>
        <Route exact path="/SuperAdminUser" element={isAuthenticated() ? <SuperAdminUser/> : <Navigate to="/login" />}/>
      </Routes>
    </>
  );
}

export default App;
