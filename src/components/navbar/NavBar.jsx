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
    dispatch({ type: "LOGIN_ERROR" });
    navigate("/");
  };
  return (
    <div>
      <nav className="navbar bg-light  shadow-sm">
        <div className="container-fluid">
          <NavLink to="/">
            <img alt="logo" src={logoIntendencia} height="45px" />
          </NavLink>
          <form className="d-flex">
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              onClick={() => logout()}
            >
              Cerrar Sesion
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
