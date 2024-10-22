import { Navigate, Route, Routes} from "react-router-dom";

//components
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
import Ingredients from "./components/Ingredients";
import Inventory from "./components/Inventory";
import EstadoDeResultado from "./components/EstadoDeResultado";

//css
import "react-toastify/dist/ReactToastify.css";

//toast
import { ToastContainer } from "react-toastify";

//js
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
          <Route exact path="/configurations/:id" element={isAuthenticated() ? <MyRestaurante /> : <Navigate to="/login" />}/>
          <Route exact path="/AllRestaurant" element={isAuthenticated() ? <AllRestaurant /> : <Navigate to="/login" />}/>
          <Route exact path="/users" element={isAuthenticated() ? <Users /> : <Navigate to="/login" />}/>
          <Route exact path="/SuperAdminUser" element={isAuthenticated() ? <SuperAdminUser /> : <Navigate to="/login" />}/>
          <Route exact path="/Recipe_book/all/:id" element={isAuthenticated() ? <ShowRespie /> : <Navigate to="/login" />}/>
          <Route exact path="/ingredients/all/:id" element={isAuthenticated() ? <Ingredients /> : <Navigate to="/login" />}/>
          <Route exact path="/inventory/:id" element= {isAuthenticated() ? <Inventory /> : <Navigate to="/login" />} />
          <Route exact path="/edr/:id_restaurant" element = {isAuthenticated() ? <EstadoDeResultado /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
