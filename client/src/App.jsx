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
import ShowRespie from "./components/showRespie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "./auth/auth";
import Ingredients from "./components/Ingredients";
import Comandas from "./components/Comandas";
import Inventory from "./components/Inventory";
import Kardex from "./components/Kardex";
import EstadoDeResultado from "./components/EstadoDeResultado";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route exact path="*" element={<NotFound />} />
        <Route
          exact
          path="/login"
          element={
            !isAuthenticated() ? <LogginUser /> : <Navigate to="/homepage" />
          }
        />
        <Route
          exact
          path="/homepage"
          element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route exact path="/createRestaurant" element={<FormRestaurant />} />
        <Route exact path="/" element={<LandingPage />} />
        <Route
          exact
          path="/configurations/:id"
          element={
            isAuthenticated() ? <MyRestaurante /> : <Navigate to="/login" />
          }
        />
        <Route
          exact
          path="/AllRestaurant"
          element={
            isAuthenticated() ? <AllRestaurant /> : <Navigate to="/login" />
          }
        />
        <Route
          exact
          path="/users"
          element={isAuthenticated() ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/SuperAdminUser"
          element={
            isAuthenticated() ? <SuperAdminUser /> : <Navigate to="/login" />
          }
        />
        <Route
          exact
          path="/respies/all/:id"
          element={
            isAuthenticated() ? <ShowRespie /> : <Navigate to="/login" />
          }
        />
        <Route 
          exact
          path="/ingredients/all/:id"
          element={
            isAuthenticated() ? <Ingredients /> : <Navigate to="/login" />
          }
        />
        <Route exact path="/comandas/:id" element= {isAuthenticated() ? <Comandas /> : <Navigate to="/login" />} />
        <Route exact path="/inventario/:id" element= {isAuthenticated() ? <Inventory /> : <Navigate to="/login" />} />
        <Route exact path="/kardex/:id_ingrediente/:id" element = {isAuthenticated() ? <Kardex /> : <Navigate to="/login" />} />
        <Route exact path="/edr/:id_restaurant" element = {isAuthenticated() ? <EstadoDeResultado /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
