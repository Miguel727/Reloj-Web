import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../src/config";
import Swal from "sweetalert2";
import logoIntendencia from "../../img/LOGO.png";
import "./Reasignar.css";
import { Link, useNavigate } from "react-router-dom";

const Reasignar = () => {
  const [fk_empleado_codigo, setFicha] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handlePasswordReset = (event) => {
    event.preventDefault();
    setLoading(true);

    const codigoModificado = agregarPrefijoFicha(fk_empleado_codigo);
    axios
      .post(`${API_BASE_URL}/resetearContrasena`, { fk_empleado_codigo: codigoModificado })
      .then((response) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Solicitud enviada",
          text: "Se ha enviado una solicitud para restablecer tu contraseña.",
        }).then(() => {
          navigate("/login");
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo procesar la solicitud. Por favor, intenta de nuevo.",
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
            {loading && (
              <div className="col-md-12 mt-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body px-9">
              <h3>Recuperar Contraseña</h3>
              <form onSubmit={handlePasswordReset}>
                <input
                  type="text"
                  value={fk_empleado_codigo}
                  onChange={(ev) => setFicha(ev.target.value)}
                  className="p-2 mt-4 mb-2 form-control input-bg"
                  placeholder="Ficha"
                  required
                />
                <div className="mt-3 d-grid">
                  <button type="submit" className="custom-btn custom-btn-blue">
                    
                      Recuperar
                   
                  </button>
                </div>
                <div className="my-4">
                  <hr className="text-muted" />
                </div>
                <div className="mt-3 mb-5 d-grid">
                  <Link to="/login" className="text-muted fs-6">
                    Volver al Inicio
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reasignar;
