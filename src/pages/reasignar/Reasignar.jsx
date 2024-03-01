import logoIntendencia from "../../img/LOGO.png";
import "./Reasignar.css";
import { Link } from "react-router-dom";

const Reasignar = () => {
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
            <div className="card-body px-9">
              <h3>Recuperar Contraseña</h3>

              {
                <form>
                  <input
                    type="text"
                    className="p-2 mt-4 mb-2 form-control input-bg"
                    placeholder="Ficha"
                  />

                  <div className="mt-3 d-grid">
                    <button
                      type="submit"
                      className="custom-btn custom-btn-blue"
                    >
                      Recuperar
                    </button>
                  </div>
                  <div className="my-4">
                    <hr className="text-muted" />
                  </div>
                  <div className="mt-3 mb-5 d-grid">
                    <a>
                      <Link to="/" className="text-muted fs-6">
                        Volver al Inicio
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

export default Reasignar;
