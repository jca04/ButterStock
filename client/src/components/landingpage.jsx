import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../public/css/landingPageStyle.css";
import logo from "../public/resources/logo/logotoai_smooth.svg"

function LandingPage() {
  return (
    <section className="landingPage-background">
      <nav className="landingPage-navbar">
        <Link to="/login" className="landingPage-iniciarSesion">Iniciar Sesión</Link>
      </nav>
      <section className="landingPage-titles">
        <div className="landingPage-byProjectersTitle">BY PROJECTERS</div>
        <div className="landingPage-butterstockTitle">
          <h2>ButterStock</h2>
        </div>
        <div className="landingPage-divLogo">
          <img className="landingPage-logo" src={logo} alt="logo" />
        </div>

        <div className="landingPage-mainbutton">
          <button className="landingPage-stylebutton" type="button">Empieza ya</button>
        </div>
      </section>
    </section>
  );
}

export default LandingPage;
