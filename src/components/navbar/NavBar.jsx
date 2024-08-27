import "./NavBar.css";
import logoIntendencia from "../../img/LOGO.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    navigate("/");
  };

  const recuperar = () => {
    navigate("/recuperar");
  };

  const email = () => {
    navigate("/agregar-email");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          <NavLink to="/inicio" className="navbar-brand">
            <img alt="logo" src={logoIntendencia} height="45px" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
             
              <li className="nav-item mx-2 centered-item">
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => email()}
                >
                  Cambiar email
                </button>
              </li>
              
              <li className="nav-item mx-2 centered-item">
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => recuperar()}
                >
                  Cambiar contraseña
                </button>
              </li>
              <li className="nav-item mx-2 centered-item">
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={() => logout()}
                >
                  Cerrar Sesion
                </button>
              </li> 
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
