import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../public/css/landingPageStyle.css";
import logo from "../public/resources/logo/logotoai_smooth.svg"
import { Fade, Slide } from "react-awesome-reveal";

function LandingPage() {
  return (
    <section className="landingPage-background">
      <nav className="landingPage-navbar">
        <Link to="/login" className="landingPage-iniciarSesion">Iniciar Sesión</Link>
      </nav>
      
      <section className="landingPage-titles">
        <Fade delay={300}>  
          <div className="landingPage-byProjectersTitle">BY PROJECTERS</div>
        </Fade>

        <Fade delay={100}>
          <div className="landingPage-butterstockTitle">
            <Slide> 
              <h2>ButterStock</h2>
            </Slide>
          </div>
        </Fade>

        <Fade delay={100}>
          <div className="landingPage-divLogo">
            <img className="landingPage-logo" src={logo} alt="logo" />
          </div>
        </Fade>

        <div className="landingPage-mainbutton">
          <button className="landingPage-stylebutton" type="button">Empieza ya</button>
        </div>
        
      </section>
      
    </section>
  );
}

export default LandingPage;
