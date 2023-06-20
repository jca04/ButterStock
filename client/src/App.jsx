import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/notFound";
import LogginUser from "./components/loginUsers";
import FormRestaurant from "./components/createRestaurant";
import HomePage from "./components/homepage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "./auth/auth";

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
                        !isAuthenticated() ? (
                            <LogginUser />
                        ) : (
                            <Navigate to="/homepage" />
                        )
                    }
                />
                <Route
                    exact
                    path="/homepage"
                    element={
                        isAuthenticated() ? (
                            <HomePage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    exact
                    path="/createRestaurant"
                    element={<FormRestaurant />}
                />
            </Routes>
        </>
    );
}

export default App;
