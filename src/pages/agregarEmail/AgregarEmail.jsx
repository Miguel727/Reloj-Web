import NavBar from "../../components/navbar/NavBar";
import "./AgregarEmail.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { API_BASE_URL } from "../../../src/config";
import Swal from "sweetalert2";

const AgregarEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleEmailUpdate = (event) => {
    event.preventDefault();
    setLoading(true);

    const requestData = {
      fk_empleado_codigo: user.fk_empleado_codigo,
      email,
    };

    axios
      .post(`${API_BASE_URL}/agregarEmail`, requestData)
      .then((response) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Correo asociado",
          text: "Tu correo electrónico ha sido asociado exitosamente.",
        }).then(() => {
          navigate("/inicio");
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo asociar el correo electrónico. Por favor, intenta de nuevo.",
        });
      });
  };

  return (
    <>
      <NavBar className="nav" />
      <div className="container login-container">
        <div className="contenedor-email col-md-9 col-sm-12">
          <h4>Funcionario: {user.nombre}</h4>
          <div className="card shadow">
            {loading && (
              <div className="col-md-12 mt-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="card-body px-9">
              <h3>Asociar Correo Electrónico</h3>
              <form onSubmit={handleEmailUpdate}>
                <input
                  type="email"
                  className="p-2 mt-4 mb-2 form-control input-bg"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="mt-3 d-grid">
                  <button
                    type="submit"
                    className="custom-btn custom-btn-blue"
                  >
                    {loading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Enviar"
                    )}
                  </button>
                </div>
                <div className="my-4">
                  <hr className="text-muted" />
                </div>
                <div className="mt-3 mb-5 d-grid">
                  <Link to="/inicio" className="text-muted fs-6">
                    Volver
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgregarEmail;
