import { useState } from "react";
import { useDispatch } from "react-redux";

import logoIntendencia from "../../img/LOGO.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import axios, { HttpStatusCode } from "axios";
import { API_BASE_URL } from "../../../src/config";
import Swal from "sweetalert2";

const Login = () => {
  const [fk_empleado_codigo, setFicha] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const agregarPrefijoFicha = (codigo) => {
    if (codigo.length === 3) {
      return "10000" + codigo;
    } else if (codigo.length === 4) {
      return "1000" + codigo;
    } else if (codigo.length === 5) {
      return "100" + codigo;
    } else {
      return codigo;
    }
  };

  const login = (event) => {
    event.preventDefault();

    setLoading(true);

    const codigoModificado = agregarPrefijoFicha(fk_empleado_codigo); 
    const requestData = { fk_empleado_codigo: codigoModificado, password };
    
    axios
      .post(`${API_BASE_URL}/loginApi`, requestData)
      .then((result) => {
       
        if (result.status === HttpStatusCode.Ok) {

          setLoading(false);

          sessionStorage.setItem("token", result.data.access_token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: result.data.user,
          });
          setLoading(false);
        
          navigate("/inicio");
        }
      })
      .catch((error) => {
       
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
        });
      });
  };

  
  return (
    <div className="container login-container">
      <div className="row">
        <div className="contenedor-logo col-md-7 col-sm-12 d-flex justify-content-center align-items-center">
          <div className="column">
            <img alt="logo" className="logoIntendencia" src={logoIntendencia} />
          </div>
        </div>
        <div className="contenedor-login col-md-5 col-sm-12">
          <div className="card shadow">
            {loading ? (
              <div className="col-md-12 mt-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="card-body px-9 text-center">
              <h3>Gestor de Marcas</h3>

              {
                <form onSubmit={(e) => login(e)}>
                  <input
                    type="text"
                    value={fk_empleado_codigo}
                    onChange={(ev) => setFicha(ev.target.value)}
                    className="p-2 mt-4 mb-2 form-control input-bg"
                    placeholder="Ficha"
                    required
                  />
                  
                  <input
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="p-2 mb-2 form-control input-bg"
                    placeholder="Contraseña"
                    required
                  />
                  
                  <div className="mt-3 d-grid">
                    <button
                      type="submit"
                      className="custom-btn custom-btn-blue"
                    >
                      Ingresar
                    </button>
                  </div>
                  <div className="my-4">
                    <hr className="text-muted" />
                  </div>
                  <div className="mt-3 mb-5 d-grid">
                    <a>
                      <Link to="/reasignar" className="text-muted fs-6">
                        Olvidaste tu contraseña?
                      </Link>
                    </a>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
